# Apply manual membership payments

This archive is structured to merge into the **root of your existing moba-site repository**. It intentionally has `src/` and `supabase/` at the ZIP root (not inside another project folder).

1. Extract the ZIP directly into your existing `moba-site` folder and allow it to replace the matching files.
2. Confirm these files were replaced:
   - `src/components/CheckoutForm.jsx`
   - `src/lib/adminTables.js`
3. The database migration is `supabase/migrations/202610270006_manual_membership_payments.sql`. You already confirmed its constraint exists in Supabase; if you have marked migration 202610270006 as applied with `supabase migration repair`, do not re-run its SQL. Keep the migration file in the repo for history.
4. From the repo folder, run `npm run build`, then commit and push the changed files. After Cloudflare deploys, choose a membership plan to view payment instructions above the details form.

The form collects payment method, transaction reference, and payer phone; it does not upload receipt files. Membership remains subject to manual payment verification.
