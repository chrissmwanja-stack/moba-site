# Member dashboard update

This ZIP is structured to extract into the root of your existing moba-site repository.

- `src/pages/Member.jsx` turns the signed-in member page into a wider dashboard with a full profile summary, status, subscription information, and member-service shortcuts.
- `src/components/Header.jsx` switches the account button to **My MOBA** when a session is signed in, so members can return to their dashboard while browsing other pages. Signed-out visitors still see **Member Login**.

Extract into the project root, then run `npm run build`, commit, push, and redeploy. No database migration is needed. Member information remains behind authentication; the login form itself does not expose personal details.
