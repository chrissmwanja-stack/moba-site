-- Security hardening.
-- 1. Length limits on the free-text payment fields visitors can submit.
-- 2. Avatar uploads: only people who have a register row, and at most 5 files each.

-- ---------------------------------------------------------------------------
-- 1. Length limits (NOT VALID: applies to new rows, does not fail on rows already saved)
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['membership_applications', 'funeral_enrolments'] loop
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_payment_text_len');
    execute format(
      'alter table public.%I add constraint %I check ((payment_reference is null or char_length(payment_reference) <= 100) and (payment_phone is null or char_length(payment_phone) <= 30)) not valid',
      t, t || '_payment_text_len');
  end loop;
end $$;

alter table public.member_updates drop constraint if exists member_updates_help_with_len;
alter table public.member_updates
  add constraint member_updates_help_with_len
  check (char_length(array_to_string(help_with, '|')) <= 400) not valid;

-- ---------------------------------------------------------------------------
-- 2. Avatar uploads
-- ---------------------------------------------------------------------------
create or replace function public.moba_is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.members m where m.user_id = (select auth.uid()));
$$;
revoke all on function public.moba_is_member() from public, anon;
grant execute on function public.moba_is_member() to authenticated;

drop policy if exists "member avatars insert own" on storage.objects;
create policy "member avatars insert own" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.moba_is_member())
    and (
      select count(*) from storage.objects o
       where o.bucket_id = 'member-avatars'
         and (storage.foldername(o.name))[1] = (select auth.uid())::text
    ) < 5
  );
