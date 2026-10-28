# MOBA member/profile data safety review

**Scope reviewed:** current MOBA frontend and the Supabase migrations present in `/home/user/moba-latest`, especially member register access, profile edits, request review, public submissions, storage policies, admin access, and client configuration. This is a source-code/config review only. I could not inspect the live project's `pg_policies`, grants, Storage configuration, Auth settings, logs, or backup status, so this is not a live penetration test or a certification that the deployed project is leak-free.

## Executive summary

The core design is directionally good: the browser uses only the Supabase anon/publishable key; member rows are protected by RLS; official self-service edits go through authenticated RPCs; anonymous forms are insert-only; and staff access is allowlisted. The production frontend build passes.

Two concrete confidentiality problems were found in the original profile implementation: staff-only `admin_notes` sat on rows readable by the member owner. The current patch moves profile-request notes into an admin-only table and adds the same separation for notes on member register rows. **Those protections are not effective in production until migrations `202610280003` and `202610280004` have been applied successfully.**

## Findings and actions

### P0 — Staff-only notes were readable by member owners

- `members` grants authenticated users `SELECT` and has an owner policy. Since `admin_notes` was a column on that row, a member could query their own internal note using the Supabase API, even though the UI did not display it.
- `member_profile_change_requests` similarly allowed members to read their own request row, which originally included `admin_notes`. Hiding a field in React is not an access-control boundary.
- The workspace now includes migrations `202610280003_private_profile_request_notes.sql` and `202610280004_private_member_admin_notes.sql`. These migrate notes to separate tables with admin-only RLS and remove the note columns from member-readable tables. The Admin UI loads/saves the separated notes through admin-only access/RPCs.
- **Action:** apply these migrations and verify with a member account that direct API reads cannot return either notes table. If any staff notes were sensitive, treat the earlier exposure as potential access and review access logs where available.

### P1 — Verify effective RLS and grants on the live database

The source migrations show strict intended policies, but the recent `db push` error shows the remote migration state may be partially applied or may differ from local. Do not infer live safety from source files alone.

- Run `supabase migration list` and reconcile local vs remote versions before pushing again.
- Inspect `pg_policies`, table/column grants, function execute privileges, and `storage.objects` policies in the target project.
- Test with two ordinary member accounts: A must not read B's member row, profile, requests, or photo; anon must not read private tables; a normal member must not call admin RPCs or change another user's record.

### P1 — Protect the MOBA number from admin-side cohort/house edits

The member-request approval RPC refuses cohort/house changes that conflict with an already-issued MOBA number. However, the Admin register UI currently edits `cohort` and `house` directly through the admin-authorized table update path. That could leave a permanent number inconsistent with the official fields. Disable those edits after `moba_number` exists or route them through a guarded correction/renumbering procedure. Do not silently rewrite permanent numbers.

### P1 — Signed avatar URLs are bearer links

The bucket is private and policies scope object access to the owner/admin. The frontend currently creates a signed URL valid for one hour. Anyone who obtains that URL can use it until expiry, even without the account session. This is normal signed-URL behavior, but it is weaker than session-bound viewing.

- Consider using authenticated Storage `download()` and a temporary browser blob URL instead of creating signed URLs; revoke the blob URL on route change/logout.
- Keep the bucket private, reject SVG, retain strict file-size/MIME limits, and consider server-side image decoding/re-encoding because client-supplied MIME types are not proof of file contents.

### P1 — Add audit history for consequential changes

`updated_at`, request status, `resolved_by`, and public-submission `applied_by` provide some history, but there is no complete append-only before/after audit for member record edits, approvals/rejections, admin edits, note changes, and avatar replacement. Add an admin-only audit table or database triggers recording actor, timestamp, entity, old/new values, and operation. Limit who can read it and prevent edits/deletes through the client API.

### P2 — Prevent request and public-form abuse

- An authenticated member can submit repeated profile-change requests; there is no one-pending-request rule or rate limit. Consider a partial unique index allowing one pending request per member plus a clear UI message.
- Public forms are insert-only, which protects confidentiality, but they can still be spammed. Enable Supabase CAPTCHA/abuse protection and add rate limiting (often via an Edge Function or WAF) for account creation and anonymous submissions.
- Continue requiring a human to verify public `/update-details` submissions before selecting **Added**. Email matching alone is not proof that the submitter controls that address.

### P2 — Treat public form data and client-supplied totals as untrusted

The public forms are designed as requests, not authoritative records. Confirm prices, order contents, payment references, and identity claims out of band before approving/fulfilling. The website's public insert restrictions help prevent reading or changing submissions, but do not prove the facts submitted are true.

### P2 — Keep member email consistent with Auth

`members.email` is a copy made at sign-up and is not kept in sync if a member changes their Auth email. This can confuse profile display and exact-email matching for public update submissions. Add a verified email-change flow and a trusted database sync, or clearly label the registered email and route changes through the secretary. Never let a user set the official email field merely by typing it into a public form.

### P2 — Strengthen account and deployment controls

- Require MFA for all administrators and editors where practical, review the allowlist regularly, and remove access promptly when roles change.
- Confirm email verification, redirect URL allowlists, password policy, SMTP, Auth rate limits, and CAPTCHA in the live Supabase dashboard; these settings are not established by the frontend build alone.
- The code review found no service-role key in frontend source. Continue keeping service-role credentials out of `VITE_*` variables and browser bundles.
- The current `_headers` includes useful content-type, referrer, frame, permissions, and noindex headers. Add a carefully tested Content-Security-Policy (start in report-only mode) and HSTS at the hosting/CDN layer. Avoid turning CSP on blindly because Supabase requests and inline styles/scripts need explicit allowances.

### P2 — Backups, retention, and incident readiness

Set appropriate Supabase backups/PITR for the project plan, define how long public submissions and member data are retained, restrict dashboard/database access, and test a restore. Decide how account deletion, former-member records, and legal/privacy requests should be handled; the `auth.users` foreign keys cascade to member records, so account deletion may erase register data unless archival is designed separately.

## Suggested release gates

1. Resolve migration status after the failed push; apply the corrected profile migration and private-notes migrations in order.
2. Confirm the Supabase Storage bucket `member-avatars` is private and inspect all policies on `storage.objects` for broad permissive policies that could override intended isolation.
3. Run cross-account RLS tests (A vs B), anonymous read tests, and unauthorized RPC tests against the live project.
4. Verify no private admin notes appear through direct REST queries as a member; verify photo URLs are not public and are inaccessible to another member.
5. Add audit logging and guard the Admin cohort/house edit path before treating the profile workflow as fully hardened.
6. Confirm backups, MFA, CAPTCHA/rate limits, Auth email confirmation, and production security headers.
