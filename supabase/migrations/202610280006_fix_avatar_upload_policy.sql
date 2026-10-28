-- Fix: the avatar upload policy in 0005 queried storage.objects from a policy on storage.objects,
-- which Postgres rejects. Do the register-row and 5-file check in a function instead.
create or replace function public.moba_can_upload_avatar()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.members m where m.user_id = (select auth.uid()))
     and (
       select count(*) from storage.objects o
        where o.bucket_id = 'member-avatars'
          and (storage.foldername(o.name))[1] = (select auth.uid())::text
     ) < 5;
$$;
revoke all on function public.moba_can_upload_avatar() from public, anon;
grant execute on function public.moba_can_upload_avatar() to authenticated;

drop policy if exists "member avatars insert own" on storage.objects;
create policy "member avatars insert own" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.moba_can_upload_avatar())
  );
