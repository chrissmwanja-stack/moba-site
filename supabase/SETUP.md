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
3. Authentication > URL Configuration: add `https://www.mwirian.org/member`, `https://www.mwirian.org/member/reset` and the local dev equivalents to Redirect URLs.
4. Consider turning on CAPTCHA protection (Authentication > Attack Protection): sign-up is now open to anyone with the site's public key.
5. Run `migrations/202610270002_members.sql` in the SQL Editor (after the two earlier migrations).
6. Add every school house to `public.moba_houses` (name + 3-letter code) and to `houses` in `src/data/content.js`. A member whose house is not in the table cannot be approved.
7. Day to day: new sign-ups appear under **Member register** on `/admin` with status `pending`. Check the cohort and house, then set status to `active`. That issues the permanent MOBA number (`MWI-1995-HAN-023`). Record a paid subscription by setting **Subscribed until**.

Notes: the MOBA number is built once, at first approval, and never changes (fix cohort/house *before* approving). Deleting a register row does not delete the sign-in account; remove that under Authentication > Users as well.

## Editing website content (news, photos, Mwirians, archives, projects, leadership, site details)

Admins and editors change the website from `/admin/content`. Everything is saved as a **draft** first and only appears on the website when someone presses **Publish**.

1. Run `migrations/202610270003_site_content.sql` in the SQL Editor (after the earlier ones). It is safe to run twice. It creates the content tables, the `moba_editors` list and a public storage bucket called `site-media` for pictures and PDFs.
2. **Roles.** Admins (the `moba_admins` list) can edit content and also see orders and the member register. **Editors** can edit content only. To add an editor, create their account under Authentication > Users, then run:

   ```sql
   insert into public.moba_editors (user_id)
   select id from auth.users where email = 'editor@example.com';
   ```

   Editors sign in at `/admin/login` and land on the content screen. Only admins can delete something that is on the website; editors use **Take off website** instead.
3. **First time in each section.** The website is still showing the content that ships with the code (`src/data/content.js`). Open a section and press **Import current ...** once. That copies what is on the site into the editor, already published, so nothing changes visibly. From then on that section is controlled from the admin screen and edits to `content.js` for it are ignored. Archives and Prominent Mwirians start empty, so there is nothing to import.
4. **Pictures** are shrunk in the browser and saved as WebP (gallery photos get a large and a small copy). PDFs for the archive can be up to 10 MB.
5. **Who can publish.** At the moment anyone who can edit can publish. To make editors save drafts only, so an administrator approves changes, change `moba_can_edit_content()` to `moba_is_admin()` inside `moba_publish_content` and `moba_unpublish_content` in the migration and run it again.

Order changes in the lists (arrows) and gallery uploads that are already published take effect immediately; everything else waits for Publish. If Supabase is unreachable the website falls back to the content in `content.js`.


## Editing remaining built-in content

The admin content editor also supports the history timeline, About page copy, store products, membership plans and cohorts. Apply the follow-up migration `migrations/202610270004_editable_static_content.sql` after the site-content migration. For each section currently served from `src/data/content.js`, choose **Import current ...** once in `/admin/content`; the import is published without changing how the live page looks. About is a single editable record: open **About page** and save/publish the initial values.

## Editing life members and headmasters

Apply `migrations/202610290001_editable_rosters.sql` after the earlier content migrations. In `/admin/content`, open **Life members** and choose **Import current life members** once, then open **Headmasters** and choose **Import current headmasters** once. Each import preserves the current public list and makes every entry editable.

Both sections support adding, editing, removing, reordering, drafts and publishing. Life members have a public display name; headmasters have a name and a **Years / note** field so details such as “Acting” are preserved. The Membership page automatically balances the life-member columns and numbering when the list changes. Until a section is imported, its public page continues to use the built-in fallback list.
