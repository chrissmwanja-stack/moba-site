-- MOBA site: editable website content (drafts + publishing), editor role, image storage.
--
-- Runs AFTER 202610260001_moba_admin_allowlist.sql (uses public.moba_admins).
-- Run it in the Supabase SQL Editor. It is safe to run twice.
--
-- Who can do what
--   admin  (public.moba_admins)  : everything on the site, including orders and the member register
--   editor (public.moba_editors) : website content only (this file); no access to orders or members
--   public (anon)                : reads PUBLISHED content through site_content_public() and nothing else
--
-- How content is stored
--   One row per item in public.site_content. `live` is what visitors see, `draft` is the working copy.
--   Saving writes `draft`. Publishing (moba_publish_content) copies draft into live. Browsers can never
--   write `live` directly, so every public change goes through the publish function.

-- ---------------------------------------------------------------------------
-- 1. Editors and the role helpers
-- ---------------------------------------------------------------------------
create table if not exists public.moba_editors (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.moba_editors enable row level security;
-- No client policies: only the SECURITY DEFINER functions below read this table.

create or replace function public.moba_can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.moba_admins  a where a.user_id = (select auth.uid()))
      or exists (select 1 from public.moba_editors e where e.user_id = (select auth.uid()));
$$;

create or replace function public.moba_admin_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when exists (select 1 from public.moba_admins  a where a.user_id = (select auth.uid())) then 'admin'
    when exists (select 1 from public.moba_editors e where e.user_id = (select auth.uid())) then 'editor'
  end;
$$;

revoke all on function public.moba_can_edit_content() from public;
revoke all on function public.moba_admin_role()       from public;
grant execute on function public.moba_can_edit_content() to authenticated;
grant execute on function public.moba_admin_role()       to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Content table
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null check (kind in ('news', 'photo', 'mwirian', 'archive', 'project', 'leader', 'setting')),
  key          text check (key is null or char_length(key) <= 40),   -- only for one-off rows, e.g. the 'site' setting
  position     integer,                                              -- display order inside a kind (lowest first)
  live         jsonb,                                                -- what visitors see (null = not published)
  draft        jsonb,                                                -- working copy (null = nothing pending)
  created_at   timestamptz not null default now(),
  created_by   uuid,
  updated_at   timestamptz not null default now(),
  updated_by   uuid,
  published_at timestamptz,
  published_by uuid,
  constraint site_content_has_content check (live is not null or draft is not null),
  constraint site_content_live_ok  check (live  is null or (jsonb_typeof(live)  = 'object' and pg_column_size(live)  < 100000)),
  constraint site_content_draft_ok check (draft is null or (jsonb_typeof(draft) = 'object' and pg_column_size(draft) < 100000))
);
comment on table public.site_content is 'Editable website content. live = published, draft = pending changes.';

create unique index if not exists site_content_one_per_key on public.site_content (kind, key) where key is not null;
create index if not exists site_content_kind_position on public.site_content (kind, position);

-- Remembers which kinds the database now controls. Once a kind is in here the public site shows the
-- database version of that section, even if every item is later removed or unpublished.
create table if not exists public.site_content_managed (kind text primary key);
alter table public.site_content_managed enable row level security;
-- No client policies: read through site_content_public(), written by the trigger below.

create or replace function public.site_content_touch()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.site_content_managed (kind) values (new.kind) on conflict do nothing;
    new.created_by := (select auth.uid());
  else
    new.updated_at := now();
  end if;
  new.updated_by := (select auth.uid());
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before insert or update on public.site_content
  for each row execute function public.site_content_touch();

-- ---------------------------------------------------------------------------
-- 3. Row level security on the table
-- ---------------------------------------------------------------------------
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;

-- Staff can read everything (drafts included). They can add rows and change ONLY draft and position.
-- `live` has no column grant: it changes only inside the publish / unpublish / import functions.
grant select on public.site_content to authenticated;
grant insert (kind, key, position, draft) on public.site_content to authenticated;
grant update (position, draft)             on public.site_content to authenticated;
grant delete on public.site_content to authenticated;

drop policy if exists "staff read content"   on public.site_content;
drop policy if exists "staff add content"    on public.site_content;
drop policy if exists "staff edit content"   on public.site_content;
drop policy if exists "staff delete content" on public.site_content;

create policy "staff read content" on public.site_content
  for select to authenticated using ((select public.moba_can_edit_content()));
create policy "staff add content" on public.site_content
  for insert to authenticated with check ((select public.moba_can_edit_content()));
create policy "staff edit content" on public.site_content
  for update to authenticated
  using ((select public.moba_can_edit_content()))
  with check ((select public.moba_can_edit_content()));
-- Admins can delete anything. Editors can only delete items that are not on the website.
create policy "staff delete content" on public.site_content
  for delete to authenticated
  using ((select public.moba_is_admin()) or ((select public.moba_can_edit_content()) and live is null));

-- ---------------------------------------------------------------------------
-- 4. Publishing functions
-- ---------------------------------------------------------------------------
-- To require an administrator to approve changes (editors could then only save drafts), change
-- public.moba_can_edit_content() to public.moba_is_admin() in the first two functions below.
create or replace function public.moba_publish_content(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to publish content.' using errcode = '42501';
  end if;
  update public.site_content
     set live = draft, draft = null, published_at = now(), published_by = (select auth.uid())
   where id = p_id and draft is not null;
  if not found then
    raise exception 'There is nothing to publish for this item.';
  end if;
end;
$$;

-- Takes an item off the website but keeps it as a draft, so it can be published again.
create or replace function public.moba_unpublish_content(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to change published content.' using errcode = '42501';
  end if;
  update public.site_content
     set draft = coalesce(draft, live), live = null, published_at = null
   where id = p_id and live is not null;
  if not found then
    raise exception 'This item is not published.';
  end if;
end;
$$;

-- One-time copy of the content that ships with the site into the database, already published, so the
-- website looks the same afterwards. Refuses if the kind already has rows.
create or replace function public.moba_import_content(p_kind text, p_items jsonb, p_key text default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to import content.' using errcode = '42501';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Items must be a list.';
  end if;
  if exists (select 1 from public.site_content where kind = p_kind) then
    raise exception 'This section already has content, so it cannot be imported again.';
  end if;
  insert into public.site_content (kind, key, position, live, published_at, published_by)
  select p_kind, p_key, (t.ord * 10)::integer, t.item, now(), (select auth.uid())
    from jsonb_array_elements(p_items) with ordinality as t(item, ord);
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.moba_publish_content(uuid)            from public;
revoke all on function public.moba_unpublish_content(uuid)          from public;
revoke all on function public.moba_import_content(text, jsonb, text) from public;
grant execute on function public.moba_publish_content(uuid)            to authenticated;
grant execute on function public.moba_unpublish_content(uuid)          to authenticated;
grant execute on function public.moba_import_content(text, jsonb, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. What the public website reads (published content only)
-- ---------------------------------------------------------------------------
create or replace function public.site_content_public()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'managed', coalesce((select jsonb_agg(m.kind) from public.site_content_managed m), '[]'::jsonb),
    'rows',    coalesce((select jsonb_agg(
                           jsonb_build_object('id', c.id, 'kind', c.kind, 'key', c.key, 'data', c.live)
                           order by c.position nulls last, c.created_at desc)
                         from public.site_content c where c.live is not null), '[]'::jsonb)
  );
$$;

revoke all on function public.site_content_public() from public;
grant execute on function public.site_content_public() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Image and document storage
-- ---------------------------------------------------------------------------
-- A public bucket: anyone can open a file if they know its address, but only staff can add or change files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "staff upload site media"  on storage.objects;
drop policy if exists "staff replace site media" on storage.objects;
drop policy if exists "staff delete site media"  on storage.objects;

create policy "staff upload site media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-media' and (select public.moba_can_edit_content()));
create policy "staff replace site media" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and (select public.moba_can_edit_content()))
  with check (bucket_id = 'site-media' and (select public.moba_can_edit_content()));
create policy "staff delete site media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and (select public.moba_can_edit_content()));
