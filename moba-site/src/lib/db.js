// Saves form submissions to Supabase (the MOBA project) over its REST API.
// Only INSERT is ever used: row level security lets visitors add rows, never read them.
// Uses the same two env values as the admin login (see .env.example). Plain fetch is used on
// purpose instead of the shared supabase client: that client carries the admin's session, which
// would turn a visitor-style submission into a signed-in one. Without the env values the site
// behaves as before and sends submissions by email.
const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const dbEnabled = Boolean(URL && KEY)

// Whole-year fields (cohort, year left): a 4-digit year or null, never a value the database would reject.
export function toYear(v) {
  const n = parseInt(String(v ?? '').replace(/\D/g, '').slice(0, 4), 10)
  return n >= 1900 && n <= 2100 ? n : null
}

// Empty text becomes null so optional columns stay empty instead of holding ''.
export const orNull = v => {
  const s = String(v ?? '').trim()
  return s ? s : null
}

export async function insertRow(table, row) {
  if (!dbEnabled) return { ok: false, skipped: true }
  const headers = { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }
  // Legacy anon keys are JWTs and go in Authorization too; sb_publishable_ keys are not JWTs and must not.
  if (KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${KEY}`
  try {
    const res = await fetch(`${URL}/rest/v1/${table}`, { method: 'POST', headers, body: JSON.stringify(row) })
    return { ok: res.ok, status: res.status }
  } catch {
    return { ok: false }
  }
}
