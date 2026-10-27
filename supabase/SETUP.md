# MOBA Supabase admin login setup

1. Copy `.env.example` to `.env.local` and set the project's URL and **anon/publishable** key. Never put a service-role key in frontend env variables.
2. In Supabase Auth, disable public signups. Create/invite the intended admin user in the dashboard.
3. Run `migrations/202610260001_moba_admin_allowlist.sql` in the Supabase SQL Editor.
4. Find the admin's UUID in Authentication → Users, then run:

   ```sql
   insert into public.moba_admins (user_id) values ('ADMIN-USER-UUID');
   ```

5. Add the site URL and local development URL under Authentication → URL Configuration / Redirect URLs as needed.
6. Start the Vite site. Admin login is at `/admin/login`; `/admin` checks both the Auth session and the database allowlist.

The browser anon key is designed to be public. Authorization relies on Supabase Auth plus the allowlist function; never expose a service-role key. This only establishes administrator sign-in—site content/data permissions should get their own RLS policies as those features are built.

## Member accounts, register and cards

1. In Supabase Authentication > Sign In / Providers > Email: keep sign-ups **enabled** (members create their own accounts) and turn **Confirm email** on. Set the minimum password length to 8 or more.
2. Authentication > Emails: set up custom SMTP (for example Resend or Brevo). The built-in sender allows only a handful of emails an hour, which is not enough for confirmation and reset emails.
3. Authentication > URL Configuration: add `https://mwirian.org/member`, `https://mwirian.org/member/reset` and the local dev equivalents to Redirect URLs.
4. Consider turning on CAPTCHA protection (Authentication > Attack Protection): sign-up is now open to anyone with the site's public key.
5. Run `migrations/202610270002_members.sql` in the SQL Editor (after the two earlier migrations).
6. Add every school house to `public.moba_houses` (name + 3-letter code) and to `houses` in `src/data/content.js`. A member whose house is not in the table cannot be approved.
7. Day to day: new sign-ups appear under **Member register** on `/admin` with status `pending`. Check the cohort and house, then set status to `active`. That issues the permanent MOBA number (`MWI-1995-HAN-023`). Record a paid subscription by setting **Subscribed until**.

Notes: the MOBA number is built once, at first approval, and never changes (fix cohort/house *before* approving). Deleting a register row does not delete the sign-in account; remove that under Authentication > Users as well.
