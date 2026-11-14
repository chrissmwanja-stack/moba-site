-- Members can share articles, pictures and PDFs with the association (Contact page, "Contribute to the archives").
-- Files go to a PRIVATE bucket: only the member who sent them and staff on the admin list can open them.
-- Nothing is published automatically; staff review each contribution in /admin first.
-- Runs AFTER 202610280005_security_hardening.sql (uses public.moba_is_admin()).

-- Active members only (a pending or suspended account cannot upload).
create or replace function public.moba_is_active_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.members m where m.user_id = (select auth.uid()) and m.status = 'active');
$$;
revoke all on function public.moba_is_active_member() from public, anon;
grant execute on function public.moba_is_active_member() to authenticated;

-- ---------------------------------------------------------------------------
-- Private bucket. Object names must be <auth.uid()>/<random file>.
-- 25 MB per file (keep in step with MAX_CONTRIBUTION_MB in src/lib/contributions.js; Supabase's project-wide
-- upload limit still applies on top of this).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('member-contributions', 'member-contributions', false, 26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "member contributions read own or admin" on storage.objects;
drop policy if exists "member contributions insert own"        on storage.objects;
drop policy if exists "member contributions delete own"        on storage.objects;
drop policy if exists "member contributions delete admin"      on storage.objects;

create policy "member contributions read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'member-contributions'
         and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.moba_is_admin())));

-- At most 40 files per member in total, so one account cannot fill the bucket.
create policy "member contributions insert own" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-contributions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.moba_is_active_member())
    and (select count(*) from storage.objects o
          where o.bucket_id = 'member-contributions'
            and (storage.foldername(o.name))[1] = (select auth.uid())::text) < 40
  );

-- Members may remove their own upload (used to clean up when a submission fails); staff may remove any.
create policy "member contributions delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'member-contributions' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "member contributions delete admin" on storage.objects for delete to authenticated
  using (bucket_id = 'member-contributions' and (select public.moba_is_admin()));

-- ---------------------------------------------------------------------------
-- The contribution itself.
-- ---------------------------------------------------------------------------
create table public.member_contributions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  status       text not null default 'new' check (status in ('new', 'reviewing', 'published', 'declined')),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null,
  email        text not null,
  moba_number  text,
  title        text not null check (char_length(btrim(title)) between 3 and 150),
  message      text check (message is null or char_length(message) <= 5000),
  files        jsonb not null default '[]'::jsonb check (jsonb_typeof(files) = 'array' and jsonb_array_length(files) between 1 and 10),
  admin_notes  text
);
comment on table public.member_contributions is 'Articles, pictures and PDFs sent by active members from the Contact page. Files are in the private member-contributions bucket.';

-- The member's name, email and number come from the register, never from the browser.
-- Every file path must sit in the member's own folder.
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
  new.admin_notes := null;
  for f in select * from jsonb_array_elements(new.files) loop
    if coalesce(f ->> 'path', '') not like (select auth.uid())::text || '/%' or f ->> 'path' like '%..%' then
      raise exception 'A file does not belong to this member.';
    end if;
  end loop;
  return new;
end;
$$;
revoke all on function public.moba_member_contribution_before_insert() from public, anon, authenticated;
create trigger member_contribution_before_insert before insert on public.member_contributions
  for each row execute function public.moba_member_contribution_before_insert();

alter table public.member_contributions enable row level security;
revoke all on public.member_contributions from anon, authenticated;

grant insert (title, message, files) on public.member_contributions to authenticated;
create policy "active members can contribute" on public.member_contributions for insert to authenticated
  with check ((select public.moba_is_active_member()) and user_id = (select auth.uid()));

-- Members can see their own contributions; staff see all and may change only status and admin_notes.
grant select, delete on public.member_contributions to authenticated;
grant update (status, admin_notes) on public.member_contributions to authenticated;
create policy "own or admin can read" on public.member_contributions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.moba_is_admin()));
create policy "admins can update" on public.member_contributions for update to authenticated
  using ((select public.moba_is_admin())) with check ((select public.moba_is_admin()));
create policy "admins can delete" on public.member_contributions for delete to authenticated
  using ((select public.moba_is_admin()));
