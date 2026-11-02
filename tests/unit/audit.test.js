import test from 'node:test'
import assert from 'node:assert/strict'
import { AREAS, actionLabel, actionTone, canRestore, contentDiff, pinProblem, tableLabel } from '../../src/lib/audit.js'

test('contentDiff lists only the fields that changed, on the right side', () => {
  const before = { draft: { title: 'Old title', body: 'Same' }, live: { title: 'Live title' } }
  const after = { draft: { title: 'New title', body: 'Same' }, live: { title: 'Live title' } }
  const { lines, more } = contentDiff(before, after)
  assert.deepEqual(lines, [{ side: 'draft', field: 'title', before: 'Old title', after: 'New title' }])
  assert.equal(more, 0)
})

test('contentDiff handles a missing side (new draft, deleted item)', () => {
  const { lines } = contentDiff(null, { draft: { title: 'Hello' }, live: null })
  assert.deepEqual(lines, [{ side: 'draft', field: 'title', before: '', after: 'Hello' }])
  const gone = contentDiff({ draft: null, live: { title: 'Bye' } }, null)
  assert.deepEqual(gone.lines, [{ side: 'live', field: 'title', before: 'Bye', after: '' }])
})

test('contentDiff shortens long text and caps the number of lines', () => {
  const long = 'x'.repeat(500)
  const one = contentDiff({ draft: { story: long } }, { draft: { story: 'short' } })
  assert.equal(one.lines[0].before.length, 160)
  assert.ok(one.lines[0].before.endsWith('…'))
  const many = {}
  for (let i = 0; i < 40; i += 1) many[`f${String(i).padStart(2, '0')}`] = 'v'
  const big = contentDiff({ draft: {} }, { draft: many })
  assert.equal(big.lines.length, 30)
  assert.equal(big.more, 10)
})

test('only website content can be restored, and only from actions that hold an earlier copy', () => {
  assert.equal(canRestore({ table_name: 'site_content', action: 'DELETE' }), true)
  assert.equal(canRestore({ table_name: 'site_content', action: 'PUBLISH' }), true)
  assert.equal(canRestore({ table_name: 'site_content', action: 'INSERT' }), false)
  assert.equal(canRestore({ table_name: 'orders', action: 'DELETE' }), false)
  assert.equal(canRestore(null), false)
})

test('labels and tones are readable for every action the database writes', () => {
  assert.equal(actionLabel('PUBLISH'), 'Published')
  assert.equal(actionLabel('SOMETHING NEW'), 'SOMETHING NEW')
  assert.equal(actionTone('DELETE'), 'danger')
  assert.equal(actionTone('EDIT DRAFT'), 'plain')
  assert.equal(tableLabel('site_content'), 'Website content')
  assert.equal(tableLabel(null), '')
})

test('areas cover every audited table exactly once', () => {
  const tables = AREAS.flatMap(a => a.tables || [])
  assert.equal(new Set(tables).size, tables.length)
  for (const t of ['site_content', 'members', 'orders', 'membership_applications', 'funeral_enrolments', 'member_updates', 'member_profile_change_requests', 'member_admin_notes', 'member_profile_change_admin_notes']) {
    assert.ok(tables.includes(t), `${t} is missing from AREAS`)
  }
})

test('PINs must be 6 to 12 digits', () => {
  assert.equal(pinProblem('123456'), '')
  assert.equal(pinProblem('123456789012'), '')
  assert.notEqual(pinProblem('12345'), '')
  assert.notEqual(pinProblem('12345a'), '')
  assert.notEqual(pinProblem('1234567890123'), '')
  assert.notEqual(pinProblem(''), '')
})
