# MOBA editable content update

This update extends the existing admin CMS so staff can edit the History timeline, About page, Store products, Membership plans and Cohorts.

## Apply
1. Merge/extract this project update over the current repo, preserving your local `.env.local` (it is not included in this archive).
2. From the project folder run `supabase db push`. It will apply `202610270004_editable_static_content.sql` after the already-applied migrations.
3. Run `npm install`, then `npm run build` and `npm run dev`.
4. Sign in at `/admin/login`, then open `/admin/content`.
5. For History, Store products, Membership plans and Cohorts, use **Import current ...** once to copy the existing built-in content into the editor as published content. About is a single record: open **About page**, save the initial draft, then publish it.
6. Test a draft and publish on each public page before deploying.

About-page priorities, values, committees and site-stat cards use friendly repeatable item controls. Existing content remains the fallback until each section is first imported/published. `.env.local` and credentials are excluded from the archive.
