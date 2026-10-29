import test from 'node:test'
import assert from 'node:assert/strict'

const base = (process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const key = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!base || !key) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running the live anonymous security checks.')
  process.exit(1)
}

const headers = { apikey: key, Accept: 'application/json', 'Content-Type': 'application/json' }
if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`

async function request(path, options = {}) {
  const response = await fetch(`${base}/rest/v1${path}`, { ...options, headers: { ...headers, ...options.headers } })
  const text = await response.text()
  let body
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  return { status: response.status, body }
}

function assertDeniedOrEmpty(result, label) {
  assert.ok([200, 401, 403].includes(result.status), `${label}: unexpected HTTP ${result.status}`)
  if (result.status === 200) assert.deepEqual(result.body, [], `${label}: anonymous data was returned`)
}

test('public content RPC returns only the public row shape', async () => {
  const result = await request('/rpc/site_content_public', { method: 'POST', body: '{}' })
  assert.equal(result.status, 200)
  assert.ok(Array.isArray(result.body.rows))
  assert.ok(Array.isArray(result.body.managed))
  for (const row of result.body.rows) {
    assert.deepEqual(Object.keys(row).sort(), ['data', 'id', 'key', 'kind'])
    assert.equal('draft' in row, false)
    assert.equal('live' in row, false)
    assert.equal('published_by' in row, false)
    assert.equal('created_by' in row, false)
  }
})

test('anonymous users cannot read private submission, member or editable-content tables', async () => {
  for (const table of ['orders', 'contact_messages', 'membership_applications', 'funeral_enrolments', 'members', 'member_profiles', 'site_content']) {
    const result = await request(`/${table}?select=*&limit=1`)
    assertDeniedOrEmpty(result, table)
  }
})

test('anonymous users receive no admin, editor or managed-kind records', async () => {
  for (const table of ['moba_admins', 'moba_editors', 'site_content_managed']) {
    const result = await request(`/${table}?select=*&limit=1`)
    assertDeniedOrEmpty(result, table)
  }
})

test('anonymous role checks never identify a staff member', async () => {
  for (const fn of ['moba_is_admin', 'moba_can_edit_content']) {
    const result = await request(`/rpc/${fn}`, { method: 'POST', body: '{}' })
    if ([401, 403].includes(result.status)) continue // revoking anonymous execution is also secure
    assert.equal(result.status, 200)
    assert.equal(result.body, false)
  }
})
