// Keeps the Supabase free-tier project from auto-pausing after a week of inactivity.
//
// It makes one anonymous, read-only call to the public content RPC `site_content_public`, which
// runs a real query against the database (the same call the website and the anonymous security
// tests already make). It writes nothing and needs no secret key: only the public URL and the
// anon/publishable key that the site itself ships to browsers.
//
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run keepalive
//
// Exits non-zero if the project does not answer correctly, so a scheduled run shows as failed.

const base = (process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const key = process.env.VITE_SUPABASE_ANON_KEY || ''

const ATTEMPTS = 3
const TIMEOUT_MS = 20_000
const RETRY_DELAY_MS = 5_000

if (!base || !key) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (the public values, never a service-role key).')
  process.exit(1)
}

const headers = { apikey: key, Accept: 'application/json', 'Content-Type': 'application/json' }
// Legacy anon keys are JWTs and also go in Authorization; sb_publishable_ keys are not JWTs.
if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function ping() {
  const started = Date.now()
  const response = await fetch(`${base}/rest/v1/rpc/site_content_public`, {
    method: 'POST',
    headers,
    body: '{}',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const text = await response.text()
  const ms = Date.now() - started
  if (response.status !== 200) throw new Error(`HTTP ${response.status} after ${ms} ms`)
  let body
  try { body = JSON.parse(text) } catch { throw new Error(`HTTP 200 but the body was not JSON (${ms} ms)`) }
  if (!body || !Array.isArray(body.rows)) throw new Error(`HTTP 200 but the response shape was unexpected (${ms} ms)`)
  return { ms, rows: body.rows.length }
}

let lastError
for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  try {
    const { ms, rows } = await ping()
    console.log(`Supabase is awake: site_content_public returned ${rows} published rows in ${ms} ms (attempt ${attempt}).`)
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(`Attempt ${attempt}/${ATTEMPTS} failed: ${error.message}`)
    if (attempt < ATTEMPTS) await sleep(RETRY_DELAY_MS)
  }
}

console.error(`::error::Supabase keep-alive failed after ${ATTEMPTS} attempts (${lastError.message}).`)
console.error('If the project was paused, open the Supabase dashboard and click Restore project, then re-run this workflow.')
process.exit(1)
