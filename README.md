# MOBA website

Website for the Mwiri Old Boys Association (MOBA): history, projects, news, gallery, archives, store, membership and member area.

**Stack:** React 18, Vite, Tailwind CSS 4, React Router, Supabase (auth, database, storage). No server of our own.

## Run it

```bash
npm ci
cp .env.example .env.local   # fill in the Supabase URL and anon key
npm run dev                  # http://localhost:5173
npm run build                # production build into dist/
```

Node 20 or newer (see `.nvmrc`).

## How content works

- `src/data/content.js` holds the content that ships with the site and is the fallback if Supabase is unreachable.
- Admins and editors change content at `/admin/content`. Once a section has been imported there, the website shows the database copy and edits to `content.js` for that section are ignored. See `supabase/SETUP.md`.
- Store products: images go in `public/store/`. `sizes` (for example `S, M, L, XL`) adds a size picker; `soldOut` disables ordering.
- Orders are pay-on-delivery: they are saved to Supabase and emailed to the admin.

## Layout

- `src/pages`, `src/components`: screens and shared UI
- `src/lib`: Supabase, content, orders and forms helpers
- `supabase/migrations`: database setup, run in order (see `supabase/SETUP.md`)
- `public/_headers`: security headers (the Content-Security-Policy is still report-only)
- `docs/`: data-safety review and old patch notes (history only)

## Deploy

Pushes to `main` build with `npm run build` (output `dist/`). The GitHub Action in `.github/workflows/build.yml` runs the same build on every push and pull request.
