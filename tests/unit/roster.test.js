import test from 'node:test'
import assert from 'node:assert/strict'
import { balancedColumns } from '../../src/lib/roster.js'

test('balancedColumns returns no columns for an empty roster', () => {
  assert.deepEqual(balancedColumns([]), [])
  assert.deepEqual(balancedColumns(null), [])
})

test('balancedColumns balances a long roster and preserves order and numbering', () => {
  const members = Array.from({ length: 62 }, (_, index) => ({ name: `Member ${index + 1}` }))
  const columns = balancedColumns(members)

  assert.deepEqual(columns.map(column => column.items.length), [16, 16, 15, 15])
  assert.deepEqual(columns.map(column => column.start), [1, 17, 33, 48])
  assert.deepEqual(columns.flatMap(column => column.items), members)
})

test('balancedColumns does not create empty columns for a short roster', () => {
  const members = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
  const columns = balancedColumns(members)

  assert.equal(columns.length, 3)
  assert.deepEqual(columns.map(column => column.start), [1, 2, 3])
  assert.deepEqual(columns.flatMap(column => column.items), members)
})
