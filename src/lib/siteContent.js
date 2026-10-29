// What the public website shows. Content comes from two places:
//  1. src/data/content.js (ships with the site), and
//  2. the Supabase table site_content, edited from /admin/content.
// Once a section (news, photos...) has been taken over by the database, the website shows the database
// version of it; until then the built-in content is used. If Supabase is unreachable the built-in content
// is used too, so the site never goes blank. The last good copy is kept in the browser for fast loads.
import { useSyncExternalStore } from 'react'
import { build } from './contentModel.js'

export { build } from './contentModel.js'

const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const CACHE = 'moba-content-v1'

function readCache() {
  try {
    const s = JSON.parse(localStorage.getItem(CACHE))
    return s && Array.isArray(s.rows) && Array.isArray(s.managed) ? s : null
  } catch { return null }
}

let state = readCache() // { managed: ['news', ...], rows: [{ id, kind, key, data }] } or null
let snapshot = null
const listeners = new Set()

export const getContent = () => (snapshot ||= build(state))
export const getSite = () => getContent().site
const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn) }

// Use inside components: const { news, site } = useContent()
export const useContent = () => useSyncExternalStore(subscribe, getContent, getContent)

// Fetches the published content. Plain fetch with the anon key on purpose: the shared Supabase client may
// carry an admin session, and the public site must only ever see what the public sees.
export async function loadContent() {
  if (!URL || !KEY) return
  const headers = { apikey: KEY, 'Content-Type': 'application/json' }
  if (KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${KEY}` // sb_publishable_ keys are not JWTs
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/site_content_public`, { method: 'POST', headers, body: '{}' })
    if (!res.ok) return // migration not applied yet: keep the built-in content
    const data = await res.json()
    if (!data || !Array.isArray(data.rows) || !Array.isArray(data.managed)) return
    state = data
    snapshot = null
    try { localStorage.setItem(CACHE, JSON.stringify(data)) } catch { /* storage full or blocked */ }
    listeners.forEach(fn => fn())
  } catch { /* offline: keep what we have */ }
}
