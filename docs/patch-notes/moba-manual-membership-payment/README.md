# MOBA manual membership payment flow

The Membership page displays the payment instructions supplied by MOBA. Members submit the selected plan, their contact details, payment method, transaction reference, and (if different) payer phone. Applications remain pending manual verification; the form does not process online payments or mark a member paid automatically.

## Apply
1. Apply `supabase/migrations/202610270006_manual_membership_payments.sql` to the MOBA Supabase project before deploying.
2. Copy the included `src` files to the matching project locations.
3. Build, commit/push, and redeploy the site.
4. Review new submissions under Admin → Membership. Verify the transaction outside the site, then update its status.

This flow collects a transaction reference and payer phone; it does not upload receipt image files.
