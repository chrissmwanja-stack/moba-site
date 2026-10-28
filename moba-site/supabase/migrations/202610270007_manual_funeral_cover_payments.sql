-- Save optional direct-payment details with funeral-cover enrolments.
-- The contribution amount is still confirmed by the scheme secretary; no payment is processed here.
alter table public.funeral_enrolments
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_phone text;

alter table public.funeral_enrolments
  add constraint funeral_enrolments_payment_method_check
  check (payment_method is null or payment_method in ('MTN MoMoPay', 'Airtel Money', 'Bank transfer'));
