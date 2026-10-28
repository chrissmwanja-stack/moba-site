-- Member self-service profile data, private avatars, and reviewable identity-change requests.
-- Keep database house choices in sync with the nine official houses in the member UI.
update public.moba_houses set name = 'Waako', code = 'WAA' where name = 'Wako';
insert into public.moba_houses (name, code) values
  ('Hannington', 'HAN'), ('Nabikamba', 'NAB'), ('Nadiope', 'NAD'),
  ('Willis', 'WLS'), ('Wilson', 'WIL'), ('Waako', 'WAA'),
  ('Presidents', 'PRE'), ('Coates', 'COA'), ('Brewer', 'BRE')
on conflict (name) do update set code = excluded.code;
update public.members set house = 'Waako' where house = 'Wako';
insert into public.moba_number_counters (cohort, house_code, last_seq)
select cohort, 'WAA', max(last_seq) from public.moba_number_counters where house_code = 'WAK' group by cohort
on conflict (cohort, house_code) do update set last_seq = greatest(public.moba_number_counters.last_seq, excluded.last_seq);
delete from public.moba_number_counters where house_code = 'WAK';
create table if not exists public.member_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  year_left   smallint check (year_left is null or year_left between 1900 and 2100),
  location    text check (location is null or char_length(location) <= 120),
  profession  text check (profession is null or char_length(profession) <= 160),
  help_with   text[] not null default '{}',
  avatar_path text check (avatar_path is null or char_length(avatar_path) <= 240),
  updated_at  timestamptz not null default now(),
  check (cardinality(help_with) <= 10)
);
alter table public.member_profiles enable row level security;
revoke all on public.member_profiles from anon, authenticated;
grant select on public.member_profiles to authenticated;
drop policy if exists "members read own profile" on public.member_profiles;
drop policy if exists "admins read member profiles" on public.member_profiles;
create policy "members read own profile" on public.member_profiles
  for select to authenticated using (user_id = (select auth.uid()));
create policy "admins read member profiles" on public.member_profiles
  for select to authenticated using ((select public.moba_is_admin()));

create table if not exists public.member_profile_change_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  member_id       uuid not null references public.members(id) on delete cascade,
  member_name     text not null,
  member_email    text,
  current_cohort  smallint,
  current_house   text,
  requested_name  text,
  requested_cohort smallint,
  requested_house text,
  reason          text check (reason is null or char_length(reason) <= 1000),
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes     text,
  resolved_at     timestamptz,
  resolved_by     uuid references auth.users(id)
);
alter table public.member_profile_change_requests enable row level security;
revoke all on public.member_profile_change_requests from anon, authenticated;
grant select on public.member_profile_change_requests to authenticated;
grant update (admin_notes) on public.member_profile_change_requests to authenticated;
drop policy if exists "members read own profile requests" on public.member_profile_change_requests;
drop policy if exists "admins read profile requests" on public.member_profile_change_requests;
drop policy if exists "admins note profile requests" on public.member_profile_change_requests;
create policy "members read own profile requests" on public.member_profile_change_requests
  for select to authenticated using (user_id = (select auth.uid()));
create policy "admins read profile requests" on public.member_profile_change_requests
  for select to authenticated using ((select public.moba_is_admin()));
create policy "admins note profile requests" on public.member_profile_change_requests
  for update to authenticated using ((select public.moba_is_admin())) with check ((select public.moba_is_admin()));

alter table public.member_updates
  add column if not exists applied_member_id uuid references public.members(id) on delete set null,
  add column if not exists applied_at timestamptz,
  add column if not exists applied_by uuid references auth.users(id);

create or replace function public.moba_update_my_profile(
  p_phone text, p_year_left smallint, p_location text, p_profession text,
  p_help_with text[], p_avatar_path text
)
returns public.member_profiles
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.member_profiles;
begin
  if v_uid is null then raise exception 'Sign in required.' using errcode = '42501'; end if;
  if not exists (select 1 from public.members where user_id = v_uid) then
    raise exception 'No member record is linked to this account.';
  end if;
  if nullif(btrim(p_phone), '') is not null and char_length(btrim(p_phone)) not between 5 and 30 then
    raise exception 'Phone number must be 5 to 30 characters.';
  end if;
  if p_year_left is not null and p_year_left not between 1900 and 2100 then raise exception 'Invalid year left.'; end if;
  if p_location is not null and char_length(btrim(p_location)) > 120 then raise exception 'Location is too long.'; end if;
  if p_profession is not null and char_length(btrim(p_profession)) > 160 then raise exception 'Profession is too long.'; end if;
  if cardinality(coalesce(p_help_with, '{}'::text[])) > 10 or exists (
    select 1 from unnest(coalesce(p_help_with, '{}'::text[])) x
    where x not in ('Mentoring current students', 'Association projects', 'Reunions and events', 'Professional networking')
  ) then raise exception 'Invalid help preference.'; end if;
  if p_avatar_path is not null and (
    split_part(p_avatar_path, '/', 1) <> v_uid::text
    or array_length(string_to_array(p_avatar_path, '/'), 1) <> 2
    or p_avatar_path !~ '\.(jpg|png|webp)$'
  ) then raise exception 'Invalid profile photo path.' using errcode = '42501'; end if;

  update public.members set phone = nullif(btrim(p_phone), '') where user_id = v_uid;
  insert into public.member_profiles (user_id, year_left, location, profession, help_with, avatar_path, updated_at)
  values (v_uid, p_year_left, nullif(btrim(p_location), ''), nullif(btrim(p_profession), ''), coalesce(p_help_with, '{}'::text[]), p_avatar_path, now())
  on conflict (user_id) do update set
    year_left = excluded.year_left, location = excluded.location, profession = excluded.profession,
    help_with = excluded.help_with, avatar_path = excluded.avatar_path, updated_at = now()
  returning * into v_profile;
  return v_profile;
end;
$$;
revoke all on function public.moba_update_my_profile(text, smallint, text, text, text[], text) from public, anon;
grant execute on function public.moba_update_my_profile(text, smallint, text, text, text[], text) to authenticated;

create or replace function public.moba_submit_member_profile_change(
  p_name text, p_cohort smallint, p_house text, p_reason text
)
returns public.member_profile_change_requests
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  m public.members;
  r public.member_profile_change_requests;
  v_name text := nullif(btrim(p_name), '');
  v_cohort smallint := p_cohort;
  v_house text := nullif(btrim(p_house), '');
begin
  if v_uid is null then raise exception 'Sign in required.' using errcode = '42501'; end if;
  select * into m from public.members where user_id = v_uid;
  if not found then raise exception 'No member record is linked to this account.'; end if;
  if v_name is not null and char_length(v_name) not between 2 and 120 then raise exception 'Name must be 2 to 120 characters.'; end if;
  if v_cohort is not null and v_cohort not between 1900 and 2100 then raise exception 'Invalid cohort year.'; end if;
  if v_house is not null and not exists (select 1 from public.moba_houses where name = v_house) then raise exception 'Choose a valid MOBA house.'; end if;
  if v_name is not distinct from m.name then v_name := null; end if;
  if v_cohort is not distinct from m.cohort then v_cohort := null; end if;
  if v_house is not distinct from m.house then v_house := null; end if;
  if v_name is null and v_cohort is null and v_house is null then raise exception 'Enter at least one change.'; end if;

  insert into public.member_profile_change_requests (
    user_id, member_id, member_name, member_email, current_cohort, current_house,
    requested_name, requested_cohort, requested_house, reason
  ) values (
    v_uid, m.id, m.name, m.email, m.cohort, m.house, v_name, v_cohort, v_house, nullif(btrim(p_reason), '')
  ) returning * into r;
  return r;
end;
$$;
revoke all on function public.moba_submit_member_profile_change(text, smallint, text, text) from public, anon;
grant execute on function public.moba_submit_member_profile_change(text, smallint, text, text) to authenticated;

create or replace function public.moba_resolve_member_profile_change(
  p_request_id uuid, p_status text, p_admin_notes text default null
)
returns public.member_profile_change_requests
language plpgsql security definer set search_path = '' as $$
declare
  q public.member_profile_change_requests;
  m public.members;
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if p_status not in ('approved', 'rejected') then raise exception 'Choose approved or rejected.'; end if;
  select * into q from public.member_profile_change_requests where id = p_request_id for update;
  if not found or q.status <> 'pending' then raise exception 'This request is no longer pending.'; end if;
  select * into m from public.members where id = q.member_id for update;
  if p_status = 'approved' then
    if m.moba_number is not null and (
      (q.requested_cohort is not null and q.requested_cohort is distinct from m.cohort)
      or (q.requested_house is not null and q.requested_house is distinct from m.house)
    ) then raise exception 'Cohort or house correction would conflict with this permanent MOBA number; resolve the number with the secretary before applying.'; end if;
    update public.members set
      name = coalesce(q.requested_name, m.name),
      cohort = coalesce(q.requested_cohort, m.cohort),
      house = coalesce(q.requested_house, m.house)
    where id = m.id;
  end if;
  update public.member_profile_change_requests set status = p_status,
    admin_notes = coalesce(nullif(btrim(p_admin_notes), ''), admin_notes),
    resolved_at = now(), resolved_by = auth.uid()
  where id = q.id returning * into q;
  return q;
end;
$$;
revoke all on function public.moba_resolve_member_profile_change(uuid, text, text) from public, anon;
grant execute on function public.moba_resolve_member_profile_change(uuid, text, text) to authenticated;

create or replace function public.moba_set_member_update_status(p_update_id uuid, p_status text)
returns public.member_updates
language plpgsql security definer set search_path = '' as $$
declare
  u public.member_updates;
  m public.members;
  v_count integer;
  v_note text;
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if p_status not in ('new', 'reviewed', 'added', 'rejected') then raise exception 'Invalid status.'; end if;
  select * into u from public.member_updates where id = p_update_id for update;
  if not found then raise exception 'Member details submission not found.'; end if;
  if p_status = 'added' and u.status = 'added' then raise exception 'This submission has already been applied.'; end if;
  if p_status = 'added' then
    select count(*) into v_count from public.members where lower(btrim(email)) = lower(btrim(u.email));
    if v_count = 0 then raise exception 'No member account matches this email. Ask the person to create/sign in to their member account first.'; end if;
    if v_count > 1 then raise exception 'More than one member account matches this email. Resolve the duplicate before applying.'; end if;
    select * into m from public.members where lower(btrim(email)) = lower(btrim(u.email)) for update;
    if m.moba_number is not null and u.cohort is not null and u.cohort is distinct from m.cohort then
      v_note := 'Cohort was not changed because this member already has a permanent MOBA number; verify and resolve the number separately.';
    end if;
    update public.members set name = u.name, phone = coalesce(nullif(btrim(u.phone), ''), m.phone),
      cohort = case when m.moba_number is null then coalesce(u.cohort, m.cohort) else m.cohort end
    where id = m.id;
    insert into public.member_profiles (user_id, year_left, location, profession, help_with, updated_at)
    values (m.user_id, u.year_left, u.location, u.profession, coalesce(u.help_with, '{}'::text[]), now())
    on conflict (user_id) do update set
      year_left = coalesce(excluded.year_left, public.member_profiles.year_left),
      location = coalesce(excluded.location, public.member_profiles.location),
      profession = coalesce(excluded.profession, public.member_profiles.profession),
      help_with = case when cardinality(excluded.help_with) > 0 then excluded.help_with else public.member_profiles.help_with end,
      updated_at = now();
    update public.member_updates set status = 'added', applied_member_id = m.id, applied_at = now(), applied_by = auth.uid(),
      admin_notes = case when v_note is null then admin_notes else concat_ws(E'\n', nullif(admin_notes, ''), v_note) end
    where id = u.id returning * into u;
  else
    update public.member_updates set status = p_status where id = u.id returning * into u;
  end if;
  return u;
end;
$$;
revoke all on function public.moba_set_member_update_status(uuid, text) from public, anon;
grant execute on function public.moba_set_member_update_status(uuid, text) to authenticated;

-- Private, per-member avatar bucket. Storage object names must be <auth.uid()>/<random file>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('member-avatars', 'member-avatars', false, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 3145728, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "member avatars read own or admin" on storage.objects;
drop policy if exists "member avatars insert own" on storage.objects;
drop policy if exists "member avatars update own" on storage.objects;
drop policy if exists "member avatars delete own" on storage.objects;
create policy "member avatars read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'member-avatars' and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.moba_is_admin())));
create policy "member avatars insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'member-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "member avatars update own" on storage.objects for update to authenticated
  using (bucket_id = 'member-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'member-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "member avatars delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'member-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
