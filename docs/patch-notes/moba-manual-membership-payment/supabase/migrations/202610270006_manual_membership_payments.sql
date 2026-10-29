-- Record self-reported payment details with each membership application.
-- MOBA admins still verify transfers manually; this does not mark an application paid.
alter table public.membership_applications
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_phone text;

alter table public.membership_applications
  add constraint membership_applications_payment_method_check
  check (payment_method is null or payment_method in ('MTN MoMoPay', 'Airtel Money', 'Bank transfer'));
