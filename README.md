# MOBA website

Public website and member/admin portal for Mwiri Old Boys Association: [www.mwirian.org](https://www.mwirian.org). It covers the association's history, projects, news, gallery, archives, Store, membership and member area.

Built with React 18, React Router, Vite 5, Tailwind CSS 4 and Supabase. The production build is a static single-page application; database access, authentication, managed content and storage are provided by Supabase.

## Start here

- **Requirements:** Node 22 (see `.nvmrc`) and npm.
- **Current operations guide:** [docs/OPERATIONS.md](docs/OPERATIONS.md).
- **Supabase feature setup:** [supabase/SETUP.md](supabase/SETUP.md).
- **Historical material:** [docs/patch-notes/](docs/patch-notes/) and [the data-safety review](docs/DATA-SAFETY-REVIEW.md) — reference only, not the current setup sequence.

```sh
nvm use
npm ci
cp .env.example .env.local
# Fill in the Supabase URL and anon/publishable key in .env.local.
npm run dev
```

Without Supabase environment values, public pages render the content bundled in `src/data/content.js`. Managed content, accounts and database-backed submissions need a configured Supabase project.

Only browser-safe values may use the `VITE_` prefix. **Never put a service-role/secret key in this repository, a Vite environment file or the hosting provider's public build variables.** The anon/publishable key is public by design; row-level security must enforce access.

## Quality checks

```sh
npm run lint                 # JavaScript, JSX and React Hook checks
npm run test:unit            # Content, cart/size lines, URL, news/date and CSV tests
npm run check:migrations     # Migration filenames, order, uniqueness and conflict markers
npm run build                # Production bundle in dist/
npm run check                # All four commands above

npx playwright install chromium            # Windows/macOS; first browser-test run
# Linux CI/new Linux machine: npx playwright install --with-deps chromium
npm run test:browser         # Desktop + mobile smoke and WCAG A/AA checks; previews existing dist/
npm run test:browser:prod    # Same smoke suite against https://www.mwirian.org
```

Build before running local browser tests. To test another deployed origin:

```sh
PLAYWRIGHT_BASE_URL=https://preview.example.com npm run test:browser:prod
```

### Anonymous Supabase security checks

```sh
# Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the shell environment.
npm run test:security
```

These checks use only anonymous GET requests and read-only RPC calls. They do **not** create, update or delete submissions, members, orders, content or authentication users. They require real public Supabase environment values and deliberately fail when those values are missing.

## Content and Store rules

- `src/data/content.js` is the bundled fallback when Supabase is unreachable or a section is unmanaged.
- Once a content kind has published managed rows, those rows replace its bundled array. Adding an item only to code will not make it public while that section is database-managed.
- Publish and verify managed content through `/admin/content`; see the operations guide before changing managed data.
- Store product images belong in `public/store/`. `sizes` (for example `S, M, L, XL`) enables the size picker and creates size-specific cart lines; `soldOut` disables ordering.
- Orders use pay-on-delivery/manual operational checks. Browser-supplied prices and totals still require staff verification.

## GitHub automation

- **Quality** (`.github/workflows/build.yml`) runs on pushes to `main`, pull requests and manual dispatch: clean install, lint, unit tests, migration consistency, build, `git diff --check`, Chromium browser tests and anonymous read-boundary checks.
- **Production smoke** runs after a successful GitHub `deployment_status`, or manually from the Actions tab. It checks deployed public journeys and anonymous Supabase boundaries. The hosting integration must emit deployment statuses for automatic triggering.

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **GitHub → Settings → Secrets and variables → Actions → Secrets**. Use the public anon/publishable key, never a service-role key. Forked pull requests do not receive secrets; their local-content quality/browser checks still run. The production security step requires the secrets and fails closed if they are absent.

## Repository map

```text
src/                    React pages, components, context and pure helpers
public/                 Static assets, sitemap, host headers and SPA redirect rules
supabase/migrations/    Ordered database schema and security migrations
scripts/                Repository consistency checks
tests/unit/             Node's built-in test runner; no browser required
tests/browser/          Playwright desktop/mobile public smoke and WCAG A/AA journeys
tests/security/         Read-only anonymous Supabase boundary checks
.github/workflows/      CI and post-deployment checks
docs/OPERATIONS.md      Current deployment, publishing and recovery runbook
docs/patch-notes/       Preserved historical instructions and superseded packages
```

The app also includes a top-level error boundary and an XML sitemap. Deployment must preserve `public/_redirects`, `public/_headers`, and `public/sitemap.xml` in the generated `dist/` output.
