import test from 'node:test'
import assert from 'node:assert/strict'
import { toCsv } from '../../src/lib/adminTables.js'

const tab = {
  title: row => row.name,
  fields: [['Message', row => row.message], ['Phone', row => row.phone]],
}
const row = overrides => ({
  created_at: '2026-10-29T08:00:00.000Z', status: 'new', name: 'Example',
  message: '', phone: '', ...overrides,
})

test('CSV export prefixes spreadsheet formula characters from public submissions', () => {
  for (const value of ['=1+1', '+SUM(A1:A2)', '-2+3', '@COMMAND', '\tformula', '\rformula']) {
    const csv = toCsv(tab, [row({ message: value })])
    assert.ok(csv.includes(`"'${value}"`), `formula was not neutralized: ${JSON.stringify(value)}`)
  }
})

test('normal phone numbers, quotes and UTF-8 content remain usable in CSV', () => {
  const csv = toCsv(tab, [row({ name: 'Mwirian “Example”', message: 'He said "hello"', phone: '+256 700 000000' })])
  assert.equal(csv.charCodeAt(0), 0xfeff)
  assert.ok(csv.includes('"+256 700 000000"'), 'phone-like text must not be prefixed')
  assert.ok(csv.includes('"He said ""hello"""'))
  assert.ok(csv.includes('Mwirian “Example”'))
  assert.ok(csv.startsWith('\uFEFF"Received","Status","Title","Message","Phone","Admin notes"'))
})
