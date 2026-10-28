-- MOBA member accounts, register and MOBA numbers.
--
-- Runs AFTER 202610260001_moba_admin_allowlist.sql (uses public.moba_is_admin()).
--
-- How it works
--   1. Anyone can create an account (email + password) on /member/login.
--      Their details travel as sign-up metadata; a trigger copies them into public.members
--      with status 'pending'. A pending member can sign in but gets no card.
--   2. An admin reviews the row on /admin (Member register tab) and sets status to 'active'.
--      That calls moba_set_member_status(), which issues the permanent MOBA number
--      (MWI-<cohort>-<house code>-<3 digit sequence>, e.g. MWI-1995-HAN-023) exactly once.
--   3. A member can read ONLY their own row. They cannot change status, number or cohort:
--      there is no update policy for them, and status changes go through the function.
--
-- Before using: in Supabase > Authentication enable email sign-ups and "Confirm email",
-- and raise the minimum password length (see supabase/SETUP.md).

-- ---------------------------------------------------------------------------
-- 1. Houses and their 3-letter codes (used in MOBA numbers)
--    Add the remaining houses here before approving their members, e.g.
--      insert into public.moba_houses (name, code) values ('Exampleton', 'EXA');
--    The name must match the list in src/data/content.js (houses).
-- ---------------------------------------------------------------------------
create table if not exists public.moba_houses (
  name text primary key check (char_length(name) between 2 and 40),
  code text not null unique check (code ~ '^[A-Z]{3}$')
);

insert into public.moba_houses (name, code) values
  ('Hannington', 'HAN'),
  ('Wilson',     'WIL'),
  ('Wako',       'WAK'),
  ('Nadiope',    'NAD'),
  ('Presidents', 'PRE')
on conflict (name) do nothing;

-- One counter per cohort + house, so numbers never repeat even if two approvals race.
create table if not exists public.moba_number_counters (
  cohort    smallint not null,
  house_code text    not null,
  last_seq  integer  not null default 0,
  primary key (cohort, house_code)
);

alter table public.moba_houses          enable row level security;
alter table public.moba_number_counters enable row level security;
revoke all on public.moba_houses, public.moba_number_counters from anon, authenticated;
-- No policies: only the SECURITY DEFINER functions below touch these tables.

-- ---------------------------------------------------------------------------
-- 2. The register
-- ---------------------------------------------------------------------------
create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  status      text not null default 'pending' check (status in ('pending', 'active', 'suspended', 'rejected')),
  name        text not null check (char_length(btrim(name)) between 2 and 120),
  email       text check (email is null or char_length(email) <= 254),
  phone       text check (phone is null or char_length(phone) between 5 and 30),
  cohort      smallint check (cohort is null or cohort between 1900 and 2100),
  house       text check (house is null or char_length(house) <= 40),
  moba_number text unique,
  approved_at timestamptz,
  paid_until  date,          -- subscription valid up to this date; null = not subscribed
  admin_notes text
);
comment on table public.members is 'MOBA member register, one row per account. Status changes and MOBA numbers only via moba_set_member_status().';
comment on column public.members.email is 'Copy of the sign-up email so admins can see it; not kept in sync if the member later changes it.';

alter table public.members enable row level security;

revoke all on public.members from anon, authenticated;
grant select on public.members to authenticated;
-- Staff may correct the details used to build the number, record payment and add notes.
-- status and moba_number are deliberately NOT updatable directly.
grant update (name, phone, cohort, house, paid_until, admin_notes) on public.members to authenticated;
grant delete on public.members to authenticated;

create policy "members read own row" on public.members
  for select to authenticated using (user_id = (select auth.uid()));
create policy "admins read all" on public.members
  for select to authenticated using ((select public.moba_is_admin()));
create policy "admins update" on public.members
  for update to authenticated
  using ((select public.moba_is_admin())) with check ((select public.moba_is_admin()));
create policy "admins delete" on public.members
  for delete to authenticated using ((select public.moba_is_admin()));

-- ---------------------------------------------------------------------------
-- 3. Create the register row when an account is created
--    Never raises on odd input (that would block sign-up with an unhelpful error):
--    bad values are stored as null and an admin fixes them before approval.
-- ---------------------------------------------------------------------------
create or replace function public.moba_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  m        jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name   text  := left(btrim(coalesce(m->>'name', '')), 120);
  v_phone  text  := left(btrim(coalesce(m->>'phone', '')), 30);
  v_cohort int;
  v_house  text  := btrim(coalesce(m->>'house', ''));
begin
  if char_length(v_name) < 2 then
    v_name := left(btrim(split_part(coalesce(new.email, ''), '@', 1)), 120);
  end if;
  if char_length(v_name) < 2 then v_name := 'Member'; end if;

  if char_length(v_phone) < 5 then v_phone := null; end if;

  if (m->>'cohort') ~ '^\d{4}$' then
    v_cohort := (m->>'cohort')::int;
    if v_cohort not between 1900 and 2100 then v_cohort := null; end if;
  end if;

  if not exists (select 1 from public.moba_houses h where h.name = v_house) then
    v_house := null;
  end if;

  insert into public.members (user_id, name, email, phone, cohort, house)
  values (new.id, v_name, new.email, v_phone, v_cohort::smallint, v_house)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.moba_handle_new_user() from public, anon, authenticated;

drop trigger if exists moba_on_auth_user_created on auth.users;
create trigger moba_on_auth_user_created
  after insert on auth.users
  for each row execute function public.moba_handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Approve / suspend / reject (admins only). Issues the MOBA number once.
-- ---------------------------------------------------------------------------
create or replace function public.moba_set_member_status(p_member_id uuid, p_status text)
returns public.members
language plpgsql
security definer
set search_path = ''
as $$
declare
  r      public.members;
  v_code text;
  v_seq  integer;
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Not authorised' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'active', 'suspended', 'rejected') then
    raise exception 'Unknown status: %', p_status;
  end if;

  select * into r from public.members where id = p_member_id for update;
  if not found then
    raise exception 'Member not found';
  end if;

  if p_status = 'active' and r.moba_number is null then
    if r.cohort is null then
      raise exception 'Set this member''s cohort year before approving.';
    end if;
    select h.code into v_code from public.moba_houses h where h.name = r.house;
    if v_code is null then
      raise exception 'Set a known house for this member before approving (house is "%").', coalesce(r.house, 'empty');
    end if;

    insert into public.moba_number_counters as c (cohort, house_code, last_seq)
    values (r.cohort, v_code, 1)
    on conflict (cohort, house_code) do update set last_seq = c.last_seq + 1
    returning c.last_seq into v_seq;

    update public.members
       set moba_number = format('MWI-%s-%s-%s', r.cohort, v_code, lpad(v_seq::text, 3, '0')),
           approved_at = now()
     where id = r.id;
  end if;

  update public.members set status = p_status where id = r.id returning * into r;
  return r;
end;
$$;

revoke all on function public.moba_set_member_status(uuid, text) from public, anon;
grant execute on function public.moba_set_member_status(uuid, text) to authenticated;
