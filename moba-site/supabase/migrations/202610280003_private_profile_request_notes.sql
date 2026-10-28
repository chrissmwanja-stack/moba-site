-- Internal admin notes must not be stored on a row that members can SELECT.
-- Preserve any existing notes in a separate admin-only table, then remove the exposed column.
create table if not exists public.member_profile_change_admin_notes (
  request_id  uuid primary key references public.member_profile_change_requests(id) on delete cascade,
  admin_notes text not null default '' check (char_length(admin_notes) <= 2000),
  updated_at  timestamptz not null default now()
);
alter table public.member_profile_change_admin_notes enable row level security;
revoke all on public.member_profile_change_admin_notes from anon, authenticated;
grant select on public.member_profile_change_admin_notes to authenticated;
drop policy if exists "admins read profile request notes" on public.member_profile_change_admin_notes;
create policy "admins read profile request notes" on public.member_profile_change_admin_notes
  for select to authenticated using ((select public.moba_is_admin()));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_profile_change_requests' and column_name = 'admin_notes'
  ) then
    execute $copy$
      insert into public.member_profile_change_admin_notes (request_id, admin_notes)
      select id, admin_notes from public.member_profile_change_requests
      where nullif(admin_notes, '') is not null
      on conflict (request_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
    $copy$;
  end if;
end $$;

drop policy if exists "admins note profile requests" on public.member_profile_change_requests;
revoke update on public.member_profile_change_requests from authenticated;
alter table public.member_profile_change_requests drop column if exists admin_notes;

create or replace function public.moba_set_profile_request_admin_note(p_request_id uuid, p_admin_notes text)
returns public.member_profile_change_admin_notes
language plpgsql security definer set search_path = '' as $$
declare n public.member_profile_change_admin_notes;
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if char_length(coalesce(p_admin_notes, '')) > 2000 then raise exception 'Admin note is too long.'; end if;
  if not exists (select 1 from public.member_profile_change_requests where id = p_request_id) then
    raise exception 'Profile request not found.';
  end if;
  insert into public.member_profile_change_admin_notes (request_id, admin_notes, updated_at)
  values (p_request_id, coalesce(p_admin_notes, ''), now())
  on conflict (request_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
  returning * into n;
  return n;
end;
$$;
revoke all on function public.moba_set_profile_request_admin_note(uuid, text) from public, anon;
grant execute on function public.moba_set_profile_request_admin_note(uuid, text) to authenticated;

-- Replace the resolver so admin notes are written only to the admin-only table.
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
  if char_length(coalesce(p_admin_notes, '')) > 2000 then raise exception 'Admin note is too long.'; end if;
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
  if p_admin_notes is not null then
    insert into public.member_profile_change_admin_notes (request_id, admin_notes, updated_at)
    values (q.id, p_admin_notes, now())
    on conflict (request_id) do update set admin_notes = excluded.admin_notes, updated_at = now();
  end if;
  update public.member_profile_change_requests set status = p_status,
    resolved_at = now(), resolved_by = auth.uid()
  where id = q.id returning * into q;
  return q;
end;
$$;
revoke all on function public.moba_resolve_member_profile_change(uuid, text, text) from public, anon;
grant execute on function public.moba_resolve_member_profile_change(uuid, text, text) to authenticated;
