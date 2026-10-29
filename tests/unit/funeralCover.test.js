import test from 'node:test'
import assert from 'node:assert/strict'
import { funeralCover as cover } from '../../src/data/content.js'

test('Group Last Expense Insurance uses the supplied annual premium and family limit', () => {
  assert.equal(cover.name, 'MOBA Group Last Expense Insurance')
  assert.equal(cover.premium, 120000)
  assert.equal(cover.period, 'year')
  assert.equal(cover.maxDependants, 9)
})

test('scheme benefits preserve the approved amounts and parent clarification', () => {
  assert.deepEqual(cover.benefits.map(b => b.amount), [10000000, 5000000, 1500000, 1000000])
  const parents = cover.benefits.find(b => b.label === 'Parents and parents-in-law')
  assert.match(parents.note, /up to four people in total/)
  assert.match(parents.note, /principal member’s two parents and the spouse’s two parents/)
})
