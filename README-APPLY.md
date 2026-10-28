# MOBA member profile workflow update

This patch implements the approved hybrid workflow:

- Members can update phone, year left, location, profession, help preferences, and a private profile photo.
- Members can submit name, cohort, and house corrections for admin review. Those official fields do not change until an admin approves the request.
- The public `/update-details` form remains unchanged. In Admin → Member details, setting a verified submission to **added** applies its information to the one member record that exactly matches the submitted email. It refuses to apply if there is no unique match.
- The profile photo bucket is private, with storage policies scoped to each signed-in member; admin reads are allowed.
- Profile table reads are restricted to the owner and admins. Writes go through security-definer RPCs that validate the signed-in member or admin.

## Apply

1. Copy the included `src/` files into the matching paths in the latest MOBA site repository.
2. Copy all included `202610280002`–`202610280004` migrations into that repository's migrations folder. Keep existing earlier migrations, including the nine-house migration, in order. The later two migrations move internal notes out of member-readable rows into admin-only tables.
3. Check `supabase migration list` and reconcile any failed/partial remote application before pushing. Apply migrations to the intended project (normally `supabase db push` after reviewing the SQL).
4. Deploy the frontend. The new member route is `/member/profile`; members reach it from their dashboard.
5. In the Admin area, review **Profile requests** and approve/reject. For public update submissions, set **Member details → Added** only after verification.

An approved cohort or house correction is intentionally blocked by the database when it conflicts with an already-assigned permanent MOBA number; resolve that number separately rather than silently breaking it.

## Verification

`npm run build` passes and `git diff --check` is clean. The SQL migration was not executed against a live Supabase database in this workspace; review and apply it to the intended project before release. The dependency install reports existing Supabase package Node >=22 engine warnings under the workspace's Node 20 runtime, plus 4 npm audit vulnerabilities.
