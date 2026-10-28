-- Cohort and house determine a permanent MOBA number. Prevent direct table updates
-- and give admins a guarded path only before a number has been issued.
revoke update (cohort, house) on public.members from authenticated;

create or replace function public.moba_admin_update_member_identity(
  p_member_id uuid, p_cohort smallint, p_house text
)
returns public.members
language plpgsql security definer set search_path = '' as $$
declare
  m public.members;
  v_house text := nullif(btrim(p_house), '');
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if p_cohort is not null and p_cohort not between 1900 and 2100 then raise exception 'Invalid cohort year.'; end if;
  if v_house is not null and not exists (select 1 from public.moba_houses where name = v_house) then raise exception 'Choose a valid MOBA house.'; end if;
  select * into m from public.members where id = p_member_id for update;
  if not found then raise exception 'Member not found.'; end if;
  if m.moba_number is not null then
    raise exception 'Cohort and house are locked after a permanent MOBA number is issued. Contact the secretary for a verified number correction.';
  end if;
  update public.members set cohort = p_cohort, house = v_house where id = p_member_id returning * into m;
  return m;
end;
$$;
revoke all on function public.moba_admin_update_member_identity(uuid, smallint, text) from public, anon;
grant execute on function public.moba_admin_update_member_identity(uuid, smallint, text) to authenticated;
