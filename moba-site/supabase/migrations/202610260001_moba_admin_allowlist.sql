-- MOBA administrator allowlist. Apply in Supabase SQL Editor.
-- Create the user's account first using Supabase Auth, then insert their auth.users UUID below.
create table if not exists public.moba_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.moba_admins enable row level security;
-- No client policies: only the SECURITY DEFINER check can read this table.

create or replace function public.moba_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.moba_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.moba_is_admin() from public;
grant execute on function public.moba_is_admin() to authenticated;
