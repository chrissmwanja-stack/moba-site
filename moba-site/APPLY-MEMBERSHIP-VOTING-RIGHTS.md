# Add voting rights to membership plans

The page layout is `src/pages/Membership.jsx`. The plan names, prices, and perks shown on its cards come from `src/data/content.js` unless the Membership Plans content section is managed in Supabase.

This ZIP has the correct root-relative paths. Extract it into the root of your existing repository. It adds “Voting rights at MOBA general meetings” to both Annual Member and Life Member in the bundled data. Migration `202610270010_voting_rights_membership_perks.sql` adds the same perk to existing CMS-managed annual/life plan records (`membership_plan` rows with IDs `annual` and `life`).

Then run `supabase db push` from the project folder, build, commit, push, and redeploy. If those CMS records use different IDs, update both plans in Admin → Website content → Membership plans instead.
