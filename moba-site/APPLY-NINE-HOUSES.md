# Add MOBA's nine confirmed houses

This ZIP is structured to merge into the root of your existing moba-site repository. Extract it directly into the project folder; `src/` and `supabase/` are at the ZIP root.

- The member registration dropdown and admin house selector will list: Hannington, Nabikamba, Nadiope, Willis, Wilson, Waako, Presidents, Coates, and Brewer.
- Migration `202610270009_add_nine_houses.sql` registers all nine with unique three-letter internal codes required to issue MOBA numbers. It also renames legacy `Wako` entries to the confirmed spelling `Waako` in member records and CMS leadership cards.
- The included `src/data/content.js` retains Henry Mugisha Rodney's profile update and updates built-in leader house labels to `Waako`.
- Migration `202610270008_rodney_leadership_profile.sql` is included in case you have not yet applied the prior profile update. If it is already recorded as applied, Supabase will skip it.

After extracting, run `supabase db push` from your project folder (make sure earlier migrations are correctly marked applied), then `npm run build`, commit, push, and redeploy.
