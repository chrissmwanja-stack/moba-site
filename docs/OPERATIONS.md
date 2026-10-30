# Current operations runbook

This is the authoritative routine guide for the repository. Documents in `docs/patch-notes/` explain historical changes and must not be used as the current installation sequence.

## 1. Before merging

Use Node 22 and a clean dependency install:

```sh
npm ci
npm run check
npx playwright install --with-deps chromium  # once per machine/runner
npm run test:browser
```

`npm run check` performs lint, unit tests, migration consistency and a production build. Local browser tests exercise the generated `dist/` build at desktop and mobile sizes and run automated WCAG A/AA checks on the public routes. Do not merge with a failing check merely because the public site still renders.

For a change to Supabase policies, functions or grants, also run the read-only anonymous checks with the public environment values:

```sh
npm run test:security
```

Review `npm audit` periodically. Do not apply `npm audit fix --force` without checking framework upgrades and rerunning the full suite.

## 2. Build and deployment

- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Runtime: static files plus Supabase; there is no Node server in production.
- Public build variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optionally `VITE_WEB3FORMS_KEY`.
- Never configure a Supabase service-role/secret key in the static site's environment.
- Preserve the SPA fallback in `public/_redirects` and response headers in `public/_headers` on the hosting platform.

After deployment, the **Production smoke** GitHub workflow should run automatically when the host emits a successful deployment status. It always targets `https://www.mwirian.org` unless manually given another origin. To run it manually, open **GitHub → Actions → Production smoke → Run workflow**.

If automation is unavailable, run:

```sh
npm ci
npx playwright install --with-deps chromium
npm run test:browser:prod
npm run test:security
```

A production smoke failure is a release signal: inspect the Playwright artifact, identify whether the fault is code, content, environment, hosting or Supabase, and roll back a code deployment when necessary. Do not repair production by repeatedly submitting real forms or orders.

## 3. Publishing website content

1. Sign in through `/admin/login` and open `/admin/content`.
2. Save and review the draft, upload/verify media, then publish.
3. Check the affected public route on desktop and mobile, including image loading and links.
4. For Store changes, verify category filtering and Add to cart. For news, verify the date and canonical slug route. For Gallery, verify thumbnails and the lightbox.

Managed sections use published Supabase rows instead of their bundled arrays. If a code edit to `src/data/content.js` does not appear, check whether that content kind is already managed before adding duplicate records. Archives and Prominent Mwirians can legitimately be empty until records are published.

### Archive PDFs from scans

Old scans have no text layer, so nobody can search inside them. Before uploading a scanned PDF to Admin > Archives, run `scripts/ocr-pdfs.ps1` on it (setup steps are at the top of the script). It writes a searchable copy to a `searchable` folder and leaves the original untouched. Upload that copy. Keep each file under 25 MB (`MAX_PDF_MB`); if a result is larger, split the original into two PDFs and upload them as separate records. Only publish material the executive is happy to make public.

Admin/editor role setup and feature-specific notes are in `supabase/SETUP.md`. Keep membership payments and orders under manual staff verification until server-side repricing/validation is implemented and approved.

## 4. Database migrations

`supabase/migrations/` is the schema source of truth. `npm run check:migrations` checks naming and ordering; it does not prove that a migration is safe to apply.

For a new environment, apply migrations in filename order using the established Supabase workflow. For an existing environment, apply only reviewed migrations that have not yet been applied, and record them in migration history. Do not blindly rerun historical SQL from `docs/patch-notes/` or repeat every migration against production.

Before a production schema change:

1. Confirm a current database backup and a rollback/forward-fix plan.
2. Review RLS policies, grants, triggers, constraints and security-definer functions in the migration.
3. Test on a separate project/restored copy when the change is consequential.
4. Apply the migration and record the result.
5. Run `npm run test:security`, the relevant admin/content check and production browser smoke tests.

## 5. Recovery

### Bad code deployment

Roll back to the last known-good deployment in the hosting provider, then run production smoke tests. Fix forward in Git; do not edit generated `dist/` files on the host.

### Incorrect published content

Use the admin content workflow to correct and republish the item, or take it off the website where that option is available. Verify the public route afterwards. Keep a record of the previous value for significant corrections.

### Supabase unavailable

Public pages can fall back to bundled content, but login, managed updates and database submissions are degraded. Check Supabase status and environment configuration. Do not disable RLS or broaden anonymous grants as an outage workaround.

### Submission or notification failure

Check the browser/network error, Supabase table/policy health and optional Web3Forms configuration. Email notification is best-effort and is not a substitute for checking the admin queues. Preserve any user-provided reference and avoid duplicate submissions.

### Suspected key exposure

A public anon/publishable key is expected in the browser. A service-role/secret key is not: revoke/rotate it immediately in Supabase, remove it from build variables and any exposed artifact, review logs/access, and redeploy. Never solve a permissions error by placing the replacement secret in frontend code.

## 6. Backups and routine review

- Use Supabase's backup facilities for the database and maintain an independent recovery plan for critical storage media.
- Periodically export/retain a recoverable copy of critical submissions, member records, orders and published content according to the association's data-governance policy.
- Test restoration on a separate project; a backup that has never been restored is not a verified recovery plan.
- Review admin/editor membership, pending operational queues, anonymous security checks, dependencies and production smoke results regularly.

## 7. Test-data policy

The committed browser and security suites are read-only with respect to application data. They navigate public pages and use a browser-local cart; they do not submit Contact, membership, funeral-cover, donation or order forms. Any future authenticated or write-path test must use an isolated test project and synthetic data, never the production association database.
