-- Fix: picture uploads in the admin failed with "The database schema is invalid or incompatible."
--
-- Cause: 202611140001 added the "member contributions insert own" policy on storage.objects, and that policy
-- counts rows with a subquery on storage.objects itself. Policies on storage.objects are checked for every
-- upload to every bucket, so the self-referencing policy broke site-media uploads as well. It is the same
-- mistake 202610280006 fixed for member avatars.
-- Fix: do the 40-file count in a SECURITY DEFINER function, as the avatar fix does.
-- Run in the Supabase SQL Editor. Safe to run twice.

create or replace function public.moba_can_upload_contribution()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select public.moba_is_active_member())
     and (
       select count(*) from storage.objects o
        where o.bucket_id = 'member-contributions'
          and (storage.foldername(o.name))[1] = (select auth.uid())::text
     ) < 40;
$$;
revoke all on function public.moba_can_upload_contribution() from public, anon;
grant execute on function public.moba_can_upload_contribution() to authenticated;

drop policy if exists "member contributions insert own" on storage.objects;
create policy "member contributions insert own" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-contributions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.moba_can_upload_contribution())
  );
