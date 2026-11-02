-- MOBA site: audit trail for a shared staff login.
--
-- Runs AFTER 202610270003_site_content.sql (uses moba_admins, moba_editors, site_content).
-- Run it in the Supabase SQL Editor. It is safe to run twice.
--
-- Problem: several people use the same admin login, so Supabase only knows "the admin account" made a change.
-- Solution: after signing in, each person picks their name and enters a personal PIN ("Who is editing?").
--   * The PIN is checked in the database (stored as a bcrypt hash) and tied to THAT browser sign-in, using the
--     session_id inside the login token. Three people signed in at once are told apart.
--   * Every change to site content and to the admin tables is written to moba_audit_log by a database trigger,
--     with the editor's name. The website code cannot skip it, and nobody can edit or delete log rows.
--   * Once at least one editor exists, staff changes are REFUSED unless an editor has been chosen.
--     Until the first editor is added, nothing changes: edits are still logged, as "Nobody chosen yet".
--
-- What is logged
--   site_content (news, photos, archives, leadership...): full before/after copy, so a change can be undone.
--   members, orders, applications, funeral cover, notes: WHO changed WHICH record and WHICH fields changed,
--     never the personal details themselves (the log is not a second copy of the member register).
--   Not logged: visitors and members acting on their own data; file uploads in storage (the file's address is
--     saved in the content row, which is logged).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. People who may be chosen as "the editor", and their sessions
-- ---------------------------------------------------------------------------
create table if not exists public.moba_staff_people (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(btrim(name)) between 2 and 60),
  pin_hash        text not null,
  active          boolean not null default true,
  failed_attempts integer not null default 0,
  locked_until    timestamptz,
  created_at      timestamptz not null default now()
);
create unique index if not exists moba_staff_people_name_key on public.moba_staff_people (lower(btrim(name)));
alter table public.moba_staff_people enable row level security;
revoke all on public.moba_staff_people from anon, authenticated;
-- No client policies: only the SECURITY DEFINER functions below touch this table.

create table if not exists public.moba_edit_sessions (
  session_id uuid primary key,                     -- the session_id claim of the shared login's token
  person_id  uuid not null references public.moba_staff_people(id) on delete cascade,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null
);
alter table public.moba_edit_sessions enable row level security;
revoke all on public.moba_edit_sessions from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. The log itself
-- ---------------------------------------------------------------------------
create table if not exists public.moba_audit_log (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  auth_user      uuid,                    -- the shared login that was used
  person_id      uuid,
  person_name    text not null,           -- who, as chosen on the "Who is editing?" screen
  action         text not null,           -- INSERT, UPDATE, DELETE, PUBLISH, UNPUBLISH, EDIT DRAFT, STATUS, SIGN IN...
  table_name     text,
  record_id      text,
  summary        text,
  changed_fields text[],
  old_data       jsonb,                   -- only for site_content
  new_data       jsonb
);
create index if not exists moba_audit_log_at on public.moba_audit_log (at desc);
create index if not exists moba_audit_log_record on public.moba_audit_log (table_name, record_id);
create index if not exists moba_audit_log_person on public.moba_audit_log (person_name, at desc);

alter table public.moba_audit_log enable row level security;
revoke all on public.moba_audit_log from anon, authenticated;
grant select on public.moba_audit_log to authenticated;
drop policy if exists "admins read audit log" on public.moba_audit_log;
create policy "admins read audit log" on public.moba_audit_log
  for select to authenticated using ((select public.moba_is_admin()));
-- No insert, update or delete policy and no grant: rows are written only by the SECURITY DEFINER code below.

-- ---------------------------------------------------------------------------
-- 3. Who is editing right now?
-- ---------------------------------------------------------------------------
create or replace function public.moba_session_id()
returns uuid
language sql
stable
set search_path = ''
as $$
  select nullif(coalesce(auth.jwt() ->> 'session_id', ''), '')::uuid;
$$;

create or replace function public.moba_current_editor()
returns table (person_id uuid, person_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.name
    from public.moba_edit_sessions s
    join public.moba_staff_people p on p.id = s.person_id
   where s.session_id = public.moba_session_id()
     and s.expires_at > now()
     and p.active;
$$;

-- Names offered on the "Who is editing?" screen (names only, never PINs).
create or replace function public.moba_editor_choices()
returns table (person_id uuid, person_name text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to edit.' using errcode = '42501';
  end if;
  return query select p.id, p.name from public.moba_staff_people p where p.active order by lower(p.name);
end;
$$;

create or replace function public.moba_start_editing(p_person uuid, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v   public.moba_staff_people%rowtype;
  sid uuid := public.moba_session_id();
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to edit.' using errcode = '42501';
  end if;
  if sid is null then
    return jsonb_build_object('ok', false, 'message', 'Please sign out and sign in again.');
  end if;

  select * into v from public.moba_staff_people where id = p_person and active for update;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'That name is not on the editors list.');
  end if;
  if v.locked_until is not null and v.locked_until > now() then
    return jsonb_build_object('ok', false, 'message', 'Too many wrong PINs for this name. Try again in 15 minutes.');
  end if;

  -- A wrong PIN is returned, not raised, so the failed-attempt counter is saved.
  if extensions.crypt(coalesce(p_pin, ''), v.pin_hash) <> v.pin_hash then
    update public.moba_staff_people
       set failed_attempts = case when failed_attempts + 1 >= 5 then 0 else failed_attempts + 1 end,
           locked_until    = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else locked_until end
     where id = v.id;
    insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
    values ((select auth.uid()), v.id, v.name, 'WRONG PIN', 'A wrong PIN was entered for this name');
    return jsonb_build_object('ok', false, 'message', 'That PIN is not correct.');
  end if;

  update public.moba_staff_people set failed_attempts = 0, locked_until = null where id = v.id;
  insert into public.moba_edit_sessions (session_id, person_id, started_at, expires_at)
  values (sid, v.id, now(), now() + interval '8 hours')
  on conflict (session_id) do update
    set person_id = excluded.person_id, started_at = excluded.started_at, expires_at = excluded.expires_at;
  -- Housekeeping: forget sessions that ended long ago.
  delete from public.moba_edit_sessions where expires_at < now() - interval '2 days';

  insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
  values ((select auth.uid()), v.id, v.name, 'SIGN IN', 'Started editing');
  return jsonb_build_object('ok', true, 'person_id', v.id, 'person_name', v.name);
end;
$$;

create or replace function public.moba_stop_editing()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  p_id   uuid;
  p_name text;
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to edit.' using errcode = '42501';
  end if;
  select c.person_id, c.person_name into p_id, p_name from public.moba_current_editor() c;
  delete from public.moba_edit_sessions where session_id = public.moba_session_id();
  if p_name is not null then
    insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
    values ((select auth.uid()), p_id, p_name, 'SIGN OUT', 'Finished editing');
  end if;
end;
$$;

-- Changing your own PIN needs the old one.
create or replace function public.moba_change_my_pin(p_old text, p_new text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  p_id   uuid;
  p_name text;
  v      public.moba_staff_people%rowtype;
begin
  if not (select public.moba_can_edit_content()) then
    raise exception 'You are not allowed to edit.' using errcode = '42501';
  end if;
  select c.person_id, c.person_name into p_id, p_name from public.moba_current_editor() c;
  if p_id is null then
    return jsonb_build_object('ok', false, 'message', 'Choose who is editing first.');
  end if;
  if p_new is null or p_new !~ '^[0-9]{6,12}$' then
    return jsonb_build_object('ok', false, 'message', 'The new PIN must be 6 to 12 digits.');
  end if;
  select * into v from public.moba_staff_people where id = p_id;
  if extensions.crypt(coalesce(p_old, ''), v.pin_hash) <> v.pin_hash then
    return jsonb_build_object('ok', false, 'message', 'The current PIN is not correct.');
  end if;
  update public.moba_staff_people set pin_hash = extensions.crypt(p_new, extensions.gen_salt('bf')) where id = p_id;
  insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
  values ((select auth.uid()), p_id, p_name, 'PIN CHANGED', 'Changed their own PIN');
  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Managing the list of editors (admins only, and always logged)
-- ---------------------------------------------------------------------------
-- Adding the very first editor needs no editor to be chosen; after that, the person acting must be signed in
-- as an editor, so the log shows who added or changed whom.
create or replace function public.moba_list_editors()
returns table (person_id uuid, person_name text, active boolean, locked_until timestamptz, created_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Only administrators can see the editors list.' using errcode = '42501';
  end if;
  return query
    select p.id, p.name, p.active, p.locked_until, p.created_at
      from public.moba_staff_people p order by p.active desc, lower(p.name);
end;
$$;

create or replace function public.moba_add_editor(p_name text, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  a_id   uuid;
  a_name text;
  new_id uuid;
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Only administrators can add editors.' using errcode = '42501';
  end if;
  if p_name is null or char_length(btrim(p_name)) < 2 then
    return jsonb_build_object('ok', false, 'message', 'Enter the editor''s name.');
  end if;
  if p_pin is null or p_pin !~ '^[0-9]{6,12}$' then
    return jsonb_build_object('ok', false, 'message', 'The PIN must be 6 to 12 digits.');
  end if;
  select c.person_id, c.person_name into a_id, a_name from public.moba_current_editor() c;
  if a_id is null and exists (select 1 from public.moba_staff_people where active) then
    return jsonb_build_object('ok', false, 'message', 'Choose who is editing first, then add the editor.');
  end if;

  insert into public.moba_staff_people (name, pin_hash)
  values (btrim(p_name), extensions.crypt(p_pin, extensions.gen_salt('bf')))
  returning id into new_id;

  insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
  values ((select auth.uid()), a_id, coalesce(a_name, 'Set-up'), 'EDITOR ADDED', 'Added editor: ' || btrim(p_name));
  return jsonb_build_object('ok', true, 'person_id', new_id);
exception when unique_violation then
  return jsonb_build_object('ok', false, 'message', 'There is already an editor with that name.');
end;
$$;

create or replace function public.moba_set_editor_active(p_person uuid, p_active boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  a_id   uuid;
  a_name text;
  t_name text;
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Only administrators can change editors.' using errcode = '42501';
  end if;
  select c.person_id, c.person_name into a_id, a_name from public.moba_current_editor() c;
  if a_id is null then
    return jsonb_build_object('ok', false, 'message', 'Choose who is editing first.');
  end if;
  select name into t_name from public.moba_staff_people where id = p_person;
  if t_name is null then
    return jsonb_build_object('ok', false, 'message', 'That editor was not found.');
  end if;
  if not p_active and not exists (select 1 from public.moba_staff_people where active and id <> p_person) then
    return jsonb_build_object('ok', false, 'message', 'At least one editor must stay active.');
  end if;
  update public.moba_staff_people set active = p_active, failed_attempts = 0, locked_until = null where id = p_person;
  if not p_active then
    delete from public.moba_edit_sessions where person_id = p_person;
  end if;
  insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
  values ((select auth.uid()), a_id, a_name,
          case when p_active then 'EDITOR ENABLED' else 'EDITOR DISABLED' end,
          (case when p_active then 'Re-enabled editor: ' else 'Disabled editor: ' end) || t_name);
  return jsonb_build_object('ok', true);
end;
$$;

-- An administrator can set a new PIN for someone who forgot theirs. It is logged under the acting editor's name,
-- so a PIN reset followed by a sign-in as that person is visible in the log.
create or replace function public.moba_reset_editor_pin(p_person uuid, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  a_id   uuid;
  a_name text;
  t_name text;
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Only administrators can reset a PIN.' using errcode = '42501';
  end if;
  if p_pin is null or p_pin !~ '^[0-9]{6,12}$' then
    return jsonb_build_object('ok', false, 'message', 'The PIN must be 6 to 12 digits.');
  end if;
  select c.person_id, c.person_name into a_id, a_name from public.moba_current_editor() c;
  if a_id is null then
    return jsonb_build_object('ok', false, 'message', 'Choose who is editing first.');
  end if;
  update public.moba_staff_people
     set pin_hash = extensions.crypt(p_pin, extensions.gen_salt('bf')), failed_attempts = 0, locked_until = null
   where id = p_person returning name into t_name;
  if t_name is null then
    return jsonb_build_object('ok', false, 'message', 'That editor was not found.');
  end if;
  delete from public.moba_edit_sessions where person_id = p_person and person_id <> a_id;
  insert into public.moba_audit_log (auth_user, person_id, person_name, action, summary)
  values ((select auth.uid()), a_id, a_name, 'PIN RESET', 'Set a new PIN for ' || t_name);
  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. The trigger that writes the log
-- ---------------------------------------------------------------------------
-- Argument 'full'   : keep before/after copies (website content, which is public anyway).
-- Argument 'fields' : keep only the names of the columns that changed (personal data stays out of the log).
create or replace function public.moba_audit_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mode    text := coalesce(tg_argv[0], 'fields');
  v_uid     uuid := (select auth.uid());
  v_role    text := (select auth.jwt() ->> 'role');
  v_old     jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new     jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  v_row     jsonb := coalesce(v_new, v_old);
  v_pid     uuid;
  v_pname   text;
  v_action  text := tg_op;
  v_changed text[];
  v_summary text;
  v_label   text;
begin
  -- Visitors submitting forms are not staff actions.
  if v_role = 'anon' then return null; end if;

  if v_uid is null then
    -- No sign-in at all: a change made straight in the database (SQL editor, a migration, a cascade).
    -- New rows created that way (for example sign-up copying a member row) are not worth logging.
    if tg_op = 'INSERT' then return null; end if;
    v_pname := 'Database (direct)';
  elsif not (select public.moba_can_edit_content()) then
    return null;                      -- a member acting on their own data
  end if;

  if tg_op = 'UPDATE' then
    select array_agg(k order by k) into v_changed
      from jsonb_object_keys(v_new) as k
     where k not in ('updated_at', 'updated_by') and (v_old -> k) is distinct from (v_new -> k);
    if v_changed is null then return null; end if;   -- nothing really changed
  end if;

  if v_uid is not null then
    select c.person_id, c.person_name into v_pid, v_pname from public.moba_current_editor() c;
    if v_pname is null then
      if exists (select 1 from public.moba_staff_people where active) then
        raise exception 'Choose who is editing first: open the admin page, then pick your name and enter your PIN.'
          using errcode = '42501';
      end if;
      v_pname := 'Nobody chosen yet';
    end if;
  end if;

  v_label := coalesce(nullif(coalesce(
      v_row -> 'draft' ->> 'title', v_row -> 'live' ->> 'title',
      v_row -> 'draft' ->> 'name',  v_row -> 'live' ->> 'name',
      v_row -> 'draft' ->> 'caption', v_row -> 'live' ->> 'caption', v_row ->> 'key'), ''), v_row ->> 'id');

  if tg_table_name = 'site_content' then
    if tg_op = 'UPDATE' then
      if (v_old -> 'live') is distinct from (v_new -> 'live') then
        v_action := case when v_new ->> 'live' is null then 'UNPUBLISH' else 'PUBLISH' end;
      elsif (v_old -> 'draft') is distinct from (v_new -> 'draft') then
        v_action := case when v_new ->> 'draft' is null then 'DISCARD DRAFT' else 'EDIT DRAFT' end;
      elsif (v_old -> 'position') is distinct from (v_new -> 'position') then
        v_action := 'REORDER';
      end if;
    end if;
    v_summary := (v_row ->> 'kind') || ': ' || coalesce(v_label, '(untitled)');
  else
    v_summary := tg_table_name || ' ' || coalesce(v_row ->> 'id', v_row ->> 'request_id', v_row ->> 'member_id', v_row ->> 'user_id', '');
    if tg_op = 'UPDATE' and (v_old ->> 'status') is distinct from (v_new ->> 'status') then
      v_action := 'STATUS';
      v_summary := v_summary || ': ' || coalesce(v_old ->> 'status', '?') || ' → ' || coalesce(v_new ->> 'status', '?');
    end if;
  end if;

  insert into public.moba_audit_log
    (auth_user, person_id, person_name, action, table_name, record_id, summary, changed_fields, old_data, new_data)
  values
    (v_uid, v_pid, v_pname, v_action, tg_table_name,
     coalesce(v_row ->> 'id', v_row ->> 'request_id', v_row ->> 'member_id', v_row ->> 'user_id'),
     v_summary, v_changed,
     case when v_mode = 'full' then v_old end,
     case when v_mode = 'full' then v_new end);
  return null;
end;
$$;

revoke all on function public.moba_audit_row() from public;

drop trigger if exists moba_audit on public.site_content;
create trigger moba_audit
  after insert or update or delete on public.site_content
  for each row execute function public.moba_audit_row('full');

do $$
declare t text;
begin
  foreach t in array array[
    'members', 'orders', 'membership_applications', 'funeral_enrolments', 'member_updates',
    'member_profile_change_requests', 'member_admin_notes', 'member_profile_change_admin_notes'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('drop trigger if exists moba_audit on public.%I', t);
      execute format(
        'create trigger moba_audit after insert or update or delete on public.%I for each row execute function public.moba_audit_row(%L)',
        t, 'fields');
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Undo: bring an earlier version of website content back as a DRAFT
-- ---------------------------------------------------------------------------
-- Nothing goes live until someone presses Publish. For a deleted item the row is created again as a draft.
create or replace function public.moba_restore_content_version(p_log_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  l       public.moba_audit_log%rowtype;
  v_draft jsonb;
begin
  if not (select public.moba_is_admin()) then
    raise exception 'Only administrators can restore earlier versions.' using errcode = '42501';
  end if;
  select * into l from public.moba_audit_log where id = p_log_id and table_name = 'site_content';
  if not found or l.old_data is null then
    return jsonb_build_object('ok', false, 'message', 'There is no earlier version to restore for this entry.');
  end if;

  if l.action = 'DELETE' then
    v_draft := coalesce(nullif(l.old_data -> 'draft', 'null'::jsonb), nullif(l.old_data -> 'live', 'null'::jsonb));
    if v_draft is null or jsonb_typeof(v_draft) <> 'object' then
      return jsonb_build_object('ok', false, 'message', 'This deleted item had no content to restore.');
    end if;
    if exists (select 1 from public.site_content where id = (l.old_data ->> 'id')::uuid) then
      return jsonb_build_object('ok', false, 'message', 'This item already exists again.');
    end if;
    insert into public.site_content (id, kind, key, position, draft)
    values ((l.old_data ->> 'id')::uuid, l.old_data ->> 'kind', l.old_data ->> 'key',
            nullif(l.old_data ->> 'position', '')::integer, v_draft);
    return jsonb_build_object('ok', true, 'message', 'Restored as a draft. Open it, check it, then publish.');
  end if;

  -- After a publish, the version worth bringing back is what was live BEFORE it.
  v_draft := case when l.action = 'PUBLISH' then nullif(l.old_data -> 'live', 'null'::jsonb)
                  else coalesce(nullif(l.old_data -> 'draft', 'null'::jsonb), nullif(l.old_data -> 'live', 'null'::jsonb)) end;
  if v_draft is null or jsonb_typeof(v_draft) <> 'object' then
    return jsonb_build_object('ok', false, 'message', 'There is no earlier version to restore for this entry.');
  end if;
  update public.site_content set draft = v_draft where id = l.record_id::uuid;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'That item no longer exists. Restore the entry where it was deleted instead.');
  end if;
  return jsonb_build_object('ok', true, 'message', 'Restored as a draft. Open it, check it, then publish.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Who may call what
-- ---------------------------------------------------------------------------
revoke all on function public.moba_session_id()                        from public;
revoke all on function public.moba_current_editor()                    from public;
revoke all on function public.moba_editor_choices()                    from public;
revoke all on function public.moba_start_editing(uuid, text)           from public;
revoke all on function public.moba_stop_editing()                      from public;
revoke all on function public.moba_change_my_pin(text, text)           from public;
revoke all on function public.moba_list_editors()                      from public;
revoke all on function public.moba_add_editor(text, text)              from public;
revoke all on function public.moba_set_editor_active(uuid, boolean)    from public;
revoke all on function public.moba_reset_editor_pin(uuid, text)        from public;
revoke all on function public.moba_restore_content_version(bigint)     from public;

grant execute on function public.moba_session_id()                     to authenticated;
grant execute on function public.moba_current_editor()                 to authenticated;
grant execute on function public.moba_editor_choices()                 to authenticated;
grant execute on function public.moba_start_editing(uuid, text)        to authenticated;
grant execute on function public.moba_stop_editing()                   to authenticated;
grant execute on function public.moba_change_my_pin(text, text)        to authenticated;
grant execute on function public.moba_list_editors()                   to authenticated;
grant execute on function public.moba_add_editor(text, text)           to authenticated;
grant execute on function public.moba_set_editor_active(uuid, boolean) to authenticated;
grant execute on function public.moba_reset_editor_pin(uuid, text)     to authenticated;
grant execute on function public.moba_restore_content_version(bigint)  to authenticated;
