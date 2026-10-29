# Apply payment details across MOBA contribution pages

This ZIP merges into the **root of your existing moba-site repository**. It has `src/` and `supabase/` at the ZIP root; do not commit it as a nested folder.

## Included changes
- Membership: shows the official payment methods and collects method/reference/payer phone.
- Donate: displays the methods, asks for a donation amount and payment reference, and sends the details for manual verification.
- Funeral cover: displays the same payment methods and collects optional payment details. The premium is still listed as confirmed on enrolment, so applicants are told to verify the amount before paying.
- Admin submissions: shows membership and funeral-cover payment references for verification.
- Store orders are unchanged because the site currently says they are paid on delivery.

## Apply
1. Extract this ZIP directly into the existing `moba-site` project folder, allowing files to merge/replace at matching paths.
2. You already confirmed migration `202610270006`'s constraint exists. Ensure it is recorded as applied (`supabase migration repair 202610270006 --status applied`) rather than rerunning its SQL.
3. Apply the new funeral-cover columns with `supabase db push` from the project folder. The new migration is `202610270007_manual_funeral_cover_payments.sql`.
4. Run `npm run build`, commit and push the changes, then let Cloudflare deploy.

These pages record transaction references; they do not upload receipt image files or automatically confirm/activate a payment. The annual insurance contribution is not specified in the current site data and is deliberately not guessed.
