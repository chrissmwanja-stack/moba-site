-- MOBA site: public form submissions
--
-- Runs AFTER 202610260001_moba_admin_allowlist.sql (uses public.moba_is_admin()).
--
-- Visitors (anon) can only INSERT rows. Staff on the moba_admins allowlist, signed in
-- through /admin/login, can read, triage (status / admin_notes) and delete them.
-- Nobody else can read, change or delete anything through the public API.

-- ---------------------------------------------------------------------------
-- 1. Member register updates  (/update-details)
-- ---------------------------------------------------------------------------
create table public.member_updates (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'reviewed', 'added', 'rejected')),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text check (phone is null or char_length(phone) <= 30),
  cohort        smallint check (cohort is null or cohort between 1900 and 2100),
  year_left     smallint check (year_left is null or year_left between 1900 and 2100),
  location      text check (location is null or char_length(location) <= 120),
  profession    text check (profession is null or char_length(profession) <= 160),
  help_with     text[] not null default '{}' check (cardinality(help_with) <= 10),
  consent       boolean not null check (consent),
  admin_notes   text
);
comment on table public.member_updates is 'Submissions from the Update your details page. Secretary adds approved ones to the register.';

-- ---------------------------------------------------------------------------
-- 2. Membership applications  (/membership)
-- ---------------------------------------------------------------------------
create table public.membership_applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'contacted', 'paid', 'rejected')),
  plan_id       text not null check (char_length(plan_id) <= 40),
  plan_name     text not null check (char_length(plan_name) <= 80),
  amount_ugx    integer not null check (amount_ugx >= 0),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  phone         text not null check (char_length(btrim(phone)) between 5 and 30),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  cohort        text check (cohort is null or char_length(cohort) <= 10),
  admin_notes   text
);
comment on table public.membership_applications is 'Annual / Life membership applications. amount_ugx is what the browser sent: check it against the plan before taking payment.';

-- ---------------------------------------------------------------------------
-- 3. Funeral insurance enrolments  (/funeral-cover)
--    dependants is a small JSON array: [{ "name", "relationship", "born" }]
-- ---------------------------------------------------------------------------
create table public.funeral_enrolments (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'contacted', 'paid', 'active', 'rejected')),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  phone         text not null check (char_length(btrim(phone)) between 5 and 30),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  cohort        text check (cohort is null or char_length(cohort) <= 10),
  kin_name      text not null check (char_length(btrim(kin_name)) between 2 and 120),
  kin_phone     text not null check (char_length(btrim(kin_phone)) between 5 and 30),
  dependants    jsonb not null default '[]'::jsonb
                  check (jsonb_typeof(dependants) = 'array' and jsonb_array_length(dependants) <= 12
                         and pg_column_size(dependants) <= 4000),
  consent       boolean not null check (consent),
  admin_notes   text
);
comment on table public.funeral_enrolments is 'Funeral Insurance enrolments. Contains details of third parties (next of kin, dependants): keep access tight.';

-- ---------------------------------------------------------------------------
-- 4. Store orders  (/cart, pay on delivery)
--    items is [{ "id", "name", "price", "qty" }] exactly as the cart holds it.
-- ---------------------------------------------------------------------------
create table public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  ref           text not null unique check (ref ~ '^MOBA-[A-Z0-9]{4,10}$'),
  status        text not null default 'new' check (status in ('new', 'confirmed', 'delivered', 'cancelled')),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  phone         text not null check (char_length(btrim(phone)) between 5 and 30),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  cohort        text check (cohort is null or char_length(cohort) <= 10),
  address       text not null check (char_length(btrim(address)) between 3 and 300),
  notes         text check (notes is null or char_length(notes) <= 1000),
  items         jsonb not null
                  check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 60
                         and pg_column_size(items) <= 20000),
  total_ugx     integer not null check (total_ugx >= 0),
  admin_notes   text
);
comment on table public.orders is 'Pay-on-delivery store orders. total_ugx and item prices come from the browser: treat as a request, confirm by phone.';

-- ---------------------------------------------------------------------------
-- 5. Contact messages  (/contact)
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'answered', 'spam')),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  topic         text not null check (char_length(topic) <= 80),
  message       text not null check (char_length(btrim(message)) between 3 and 5000),
  admin_notes   text
);
comment on table public.contact_messages is 'Messages from the Contact page.';

-- ---------------------------------------------------------------------------
-- Row level security: the public may insert new rows, and nothing else.
-- ---------------------------------------------------------------------------
alter table public.member_updates          enable row level security;
alter table public.membership_applications enable row level security;
alter table public.funeral_enrolments      enable row level security;
alter table public.orders                  enable row level security;
alter table public.contact_messages        enable row level security;

-- Start from zero privileges, then grant exactly one: INSERT for anon, on the
-- columns a visitor is allowed to set (never id, status, created_at, admin_notes).
revoke all on public.member_updates, public.membership_applications,
              public.funeral_enrolments, public.orders, public.contact_messages
  from anon, authenticated;

grant insert (name, email, phone, cohort, year_left, location, profession, help_with, consent)
  on public.member_updates to anon;
grant insert (plan_id, plan_name, amount_ugx, name, phone, email, cohort)
  on public.membership_applications to anon;
grant insert (name, phone, email, cohort, kin_name, kin_phone, dependants, consent)
  on public.funeral_enrolments to anon;
grant insert (ref, name, phone, email, cohort, address, notes, items, total_ugx)
  on public.orders to anon;
grant insert (name, email, topic, message)
  on public.contact_messages to anon;

create policy "public can submit" on public.member_updates          for insert to anon with check (true);
create policy "public can submit" on public.membership_applications for insert to anon with check (true);
create policy "public can submit" on public.funeral_enrolments      for insert to anon with check (true);
create policy "public can submit" on public.orders                  for insert to anon with check (true);
create policy "public can submit" on public.contact_messages        for insert to anon with check (true);

-- ---------------------------------------------------------------------------
-- Staff access: only users on the moba_admins allowlist.
-- A signed-in user who is NOT on the list gets zero rows and cannot write.
-- Staff may change only status and admin_notes, never the visitor's own details.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['member_updates','membership_applications','funeral_enrolments','orders','contact_messages']
  loop
    execute format('grant select, delete on public.%I to authenticated', t);
    execute format('grant update (status, admin_notes) on public.%I to authenticated', t);
    execute format('create policy "admins can read"   on public.%I for select to authenticated using ((select public.moba_is_admin()))', t);
    execute format('create policy "admins can update" on public.%I for update to authenticated using ((select public.moba_is_admin())) with check ((select public.moba_is_admin()))', t);
    execute format('create policy "admins can delete" on public.%I for delete to authenticated using ((select public.moba_is_admin()))', t);
  end loop;
end $$;

-- The Supabase dashboard and the service role bypass RLS and can always read everything.
