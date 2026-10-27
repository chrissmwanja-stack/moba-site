# MOBA admin interface refresh

This ZIP is structured to merge into the root of your existing moba-site repository.

- `src/pages/Admin.jsx` refreshes the submissions/member administration dashboard with queue summary cards, clearer queue controls, and cleaner submission cards.
- `src/pages/AdminContent.jsx` refreshes the website content editor with a section overview, item/draft/publish counts, improved editor navigation, and cleaner edit/list panels.

The changes are presentation-only; authentication, permissions, database operations, publishing, and export behavior are unchanged. Extract into the repository root, run `npm run build`, commit, push, and redeploy. No database migration is needed.
