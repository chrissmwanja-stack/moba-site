-- Member-owned rows are readable to the member, so staff-only notes cannot live on members.
create table if not exists public.member_admin_notes (
  member_id   uuid primary key references public.members(id) on delete cascade,
  admin_notes text not null default '' check (char_length(admin_notes) <= 2000),
  updated_at  timestamptz not null default now()
);
alter table public.member_admin_notes enable row level security;
revoke all on public.member_admin_notes from anon, authenticated;
grant select on public.member_admin_notes to authenticated;
drop policy if exists "admins read member admin notes" on public.member_admin_notes;
create policy "admins read member admin notes" on public.member_admin_notes
  for select to authenticated using ((select public.moba_is_admin()));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'members' and column_name = 'admin_notes'
  ) then
    execute $copy$
      insert into public.member_admin_notes (member_id, admin_notes)
      select id, admin_notes from public.members where nullif(admin_notes, '') is not null
      on conflict (member_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
    $copy$;
    execute 'revoke update (admin_notes) on public.members from authenticated';
    execute 'alter table public.members drop column admin_notes';
  end if;
end $$;

create or replace function public.moba_set_member_admin_note(p_member_id uuid, p_admin_notes text)
returns public.member_admin_notes
language plpgsql security definer set search_path = '' as $$
declare n public.member_admin_notes;
begin
  if not (select public.moba_is_admin()) then raise exception 'Not authorised.' using errcode = '42501'; end if;
  if char_length(coalesce(p_admin_notes, '')) > 2000 then raise exception 'Admin note is too long.'; end if;
  if not exists (select 1 from public.members where id = p_member_id) then raise exception 'Member not found.'; end if;
  insert into public.member_admin_notes (member_id, admin_notes, updated_at)
  values (p_member_id, coalesce(p_admin_notes, ''), now())
  on conflict (member_id) do update set admin_notes = excluded.admin_notes, updated_at = now()
  returning * into n;
  return n;
end;
$$;
revoke all on function public.moba_set_member_admin_note(uuid, text) from public, anon;
grant execute on function public.moba_set_member_admin_note(uuid, text) to authenticated;
