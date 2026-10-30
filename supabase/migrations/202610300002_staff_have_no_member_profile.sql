-- Admins and editors are staff, not members. Every new login gets a pending row in the member register
-- (see moba_handle_new_user), so a staff account would otherwise show up there awaiting approval.
-- When someone is added to moba_admins or moba_editors, remove their register row, but only if it is still
-- an unapproved application with no MOBA number, so a real member's record is never touched.
-- Safe to run twice.
create or replace function public.moba_drop_staff_member_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.members
   where user_id = new.user_id
     and status = 'pending'
     and moba_number is null;
  return new;
end;
$$;

revoke all on function public.moba_drop_staff_member_row() from public, anon, authenticated;

drop trigger if exists moba_admin_is_not_member on public.moba_admins;
create trigger moba_admin_is_not_member
  after insert on public.moba_admins
  for each row execute function public.moba_drop_staff_member_row();

drop trigger if exists moba_editor_is_not_member on public.moba_editors;
create trigger moba_editor_is_not_member
  after insert on public.moba_editors
  for each row execute function public.moba_drop_staff_member_row();
