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
