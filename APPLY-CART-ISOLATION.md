# Isolate carts by signed-in account

This ZIP merges into the root of your existing moba-site repository.

The cart was stored under one browser-wide `moba-cart` localStorage key. The update stores guest carts separately and keys signed-in carts by the Supabase user ID, reloading the right cart when auth changes. It also removes the legacy unowned cart once, because its owner cannot be determined, and stops the member dashboard from showing a cart if the signed-in account has no member record.

To verify: sign in as the test member, add an item; sign out and sign in as the admin in the same browser; the admin's cart should be empty. Sign back in as the member and that member's cart remains under their own account. No database migration is needed.

Extract into the repo root, run `npm run build`, commit, push, and redeploy.
