-- Fix: payment details on membership applications and funeral-cover enrolments were never saved.
-- Visitors may only insert into the columns granted to anon (migration 202610270001). Migrations
-- 202610270006 and 202610270007 added the payment columns but did not grant them, so every
-- submission that included them was rejected and only the alert email went out.
-- Safe to run more than once, and safe whether or not those two migrations were applied.

alter table public.membership_applications
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_phone text;

alter table public.funeral_enrolments
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_phone text;

grant insert (payment_method, payment_reference, payment_phone)
  on public.membership_applications to anon;
grant insert (payment_method, payment_reference, payment_phone)
  on public.funeral_enrolments to anon;
