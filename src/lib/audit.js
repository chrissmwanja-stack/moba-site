// Helpers for the activity log (see supabase/migrations/202610310001_editor_audit_trail.sql).
// Pure functions only, so they can be unit tested without a browser or a database.

// The "area" filter on the Activity page. `tables: null` means rows that belong to no table (sign-ins, editors).
export const AREAS = [
  { id: 'all', label: 'Everything' },
  { id: 'content', label: 'Website content', tables: ['site_content'] },
  { id: 'register', label: 'Member register', tables: ['members', 'member_admin_notes'] },
  { id: 'orders', label: 'Store orders', tables: ['orders'] },
  { id: 'membership', label: 'Membership applications', tables: ['membership_applications'] },
  { id: 'funeral', label: 'Funeral cover', tables: ['funeral_enrolments'] },
  { id: 'details', label: 'Member details and profile requests', tables: ['member_updates', 'member_profile_change_requests', 'member_profile_change_admin_notes'] },
  { id: 'people', label: 'Sign-ins and editors', tables: null },
]

const TABLE_NAMES = {
  site_content: 'Website content', members: 'Member register', member_admin_notes: 'Member note',
  orders: 'Store order', membership_applications: 'Membership application', funeral_enrolments: 'Funeral cover',
  member_updates: 'Member details', member_profile_change_requests: 'Profile request',
  member_profile_change_admin_notes: 'Profile request note',
}
export const tableLabel = name => TABLE_NAMES[name] || name || ''

const ACTIONS = {
  INSERT: 'Added', UPDATE: 'Changed', DELETE: 'Deleted', STATUS: 'Status changed',
  PUBLISH: 'Published', UNPUBLISH: 'Taken off the website', 'EDIT DRAFT': 'Edited a draft',
  'DISCARD DRAFT': 'Discarded a draft', REORDER: 'Changed the order',
  'SIGN IN': 'Started editing', 'SIGN OUT': 'Stopped editing', 'WRONG PIN': 'Wrong PIN entered',
  'PIN CHANGED': 'Changed their own PIN', 'PIN RESET': 'Reset a PIN',
  'EDITOR ADDED': 'Added an editor', 'EDITOR ENABLED': 'Re-enabled an editor', 'EDITOR DISABLED': 'Disabled an editor',
}
export const actionLabel = action => ACTIONS[action] || action

// Colour hint for the action chip.
export function actionTone(action) {
  if (action === 'DELETE' || action === 'WRONG PIN' || action === 'EDITOR DISABLED') return 'danger'
  if (action === 'PUBLISH' || action === 'UNPUBLISH' || action === 'PIN RESET' || action === 'EDITOR ADDED') return 'notice'
  return 'plain'
}

// Website content can be brought back as a draft. Everything else only keeps field names, by design.
const RESTORABLE = new Set(['DELETE', 'EDIT DRAFT', 'PUBLISH', 'UNPUBLISH', 'DISCARD DRAFT'])
export const canRestore = entry => entry?.table_name === 'site_content' && RESTORABLE.has(entry.action)

const asText = v => (v === null || v === undefined ? '' : typeof v === 'string' ? v : JSON.stringify(v))
const clip = (s, n = 160) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
const MAX_LINES = 30

// What changed between two copies of a site_content row, as readable lines.
// `side` says whether the line is about the draft or the published copy.
export function contentDiff(before, after) {
  const lines = []
  for (const side of ['draft', 'live']) {
    const a = before?.[side] && typeof before[side] === 'object' ? before[side] : {}
    const b = after?.[side] && typeof after[side] === 'object' ? after[side] : {}
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()
    for (const field of keys) {
      const x = asText(a[field]); const y = asText(b[field])
      if (x !== y) lines.push({ side, field, before: clip(x), after: clip(y) })
    }
  }
  return { lines: lines.slice(0, MAX_LINES), more: Math.max(0, lines.length - MAX_LINES) }
}

// PINs are digits only, 6 to 12 long. Checked again in the database.
export const pinProblem = pin => (/^[0-9]{6,12}$/.test(pin || '') ? '' : 'The PIN must be 6 to 12 digits, numbers only.')
