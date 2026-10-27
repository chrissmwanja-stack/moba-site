# Update Henry Mugisha Rodney's profile

This ZIP merges into the root of the existing moba-site repository (`src/` and `supabase/` are at the ZIP root).

- `src/data/content.js` updates the bundled leadership record to Henry Mugisha Rodney, Ruga Ruga cohort, Coates House, and adds the refined biography.
- `supabase/migrations/202610270008_rodney_leadership_profile.sql` updates the matching published/draft CMS leader record if the website's Leaders section is managed in Supabase.

Extract into the repository root, run `supabase db push` (after ensuring earlier migrations 006/007 are recorded as applied), then build, commit, push, and redeploy. If the CMS migration finds an existing Rodney Mugisha leader record, it updates the public profile directly. No portrait was supplied, so the profile will continue to show initials until a photo is added.
