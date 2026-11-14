-- Staff notes on a member contribution must not be readable by the member who sent it.
-- member_contributions rows are readable to their owner, so the notes move to a staff-only table
-- (the same pattern as member_admin_notes). Safe to run whether or not the column still exists.
-- Runs AFTER 202611140001_member_contributions.sql.

create table if not exists public.member_contribution_admin_notes (
  contribution_id uuid primary key references public.member_contributions (id) on delete cascade,
  admin_notes     text not null default '' check (char_length(admin_notes) <= 2000),
  updated_at      timestamptz not null default now()
);
alter table public.member_contribution_admin_notes enable row level security;
revoke all on public.member_contribution_admin_notes from anon, authenticated;
grant select on public.member_contribution_admin_notes to authenticated;
drop policy if exists "admins read contribution admin notes" on public.member_contribution_admin_notes;
create policy "admins read contribution admin notes" on public.member_contribution_admin_notes
  for select to authenticated using ((select public.moba_is_admin()));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_contributions' and column_name = 'admin_notes'
  ) then
    execute $copy$
      insert into public.member_contribution_admin_notes (contribution_id, admin_notes)
      select id, admin_notes from public.member_contributions where nullif(admin_notes, '') is not null
      on conflict (contribution_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
    $copy$;
    execute 'revoke update (admin_notes) on public.member_contributions from authenticated';
    execute 'alter table public.member_contributions drop column admin_notes';
  end if;
end $$;

-- The insert trigger no longer touches admin_notes.
create or replace function public.moba_member_contribution_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare m record; f jsonb;
begin
  select name, email, moba_number into m from public.members where user_id = (select auth.uid()) and status = 'active';
  if not found then raise exception 'Only active members can send contributions.'; end if;
  new.user_id := (select auth.uid());
  new.name := m.name;
  new.email := m.email;
  new.moba_number := m.moba_number;
  new.status := 'new';
  for f in select * from jsonb_array_elements(new.files) loop
    if coalesce(f ->> 'path', '') not like (select auth.uid())::text || '/%' or f ->> 'path' like '%..%' then
      raise exception 'A file does not belong to this member.';
    end if;
  end loop;
  return new;
end;
$$;
revoke all on function public.moba_member_contribution_before_insert() from public, anon, authenticated;

create or replace function public.moba_set_contribution_admin_note(p_contribution_id uuid, p_admin_notes text)
returns public.member_contribution_admin_notes
language plpgsql security definer set search_path = '' as $$
declare n public.member_contribution_admin_notes;
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if char_length(coalesce(p_admin_notes, '')) > 2000 then raise exception 'Admin note is too long.'; end if;
  if not exists (select 1 from public.member_contributions where id = p_contribution_id) then raise exception 'Contribution not found.'; end if;
  insert into public.member_contribution_admin_notes (contribution_id, admin_notes, updated_at)
  values (p_contribution_id, coalesce(p_admin_notes, ''), now())
  on conflict (contribution_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
  returning * into n;
  return n;
end;
$$;
revoke all on function public.moba_set_contribution_admin_note(uuid, text) from public, anon;
grant execute on function public.moba_set_contribution_admin_note(uuid, text) to authenticated;
