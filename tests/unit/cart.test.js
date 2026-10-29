import test from 'node:test'
import assert from 'node:assert/strict'
import { addCartItem, cartCount, cartTotal } from '../../src/lib/cart.js'

const product = { id: 'tie', name: 'MOBA Tie', variant: 'Navy', price: 50000, delivery: 'physical' }

test('an empty cart has zero items and zero total', () => {
  assert.equal(cartCount([]), 0)
  assert.equal(cartTotal([]), 0)
})

test('adding a product preserves its identity, description, price and delivery type', () => {
  const items = addCartItem([], product)
  assert.equal(items.length, 1)
  assert.deepEqual(items[0], {
    id: 'tie', name: 'MOBA Tie (Navy)', price: 50000, delivery: 'physical', qty: 1,
  })
  assert.equal(cartCount(items), 1)
  assert.equal(cartTotal(items), 50000)
})

test('adding the same product increments quantity and updates the total without duplicating the row', () => {
  const original = addCartItem([], product)
  const items = addCartItem(original, product)
  assert.equal(items.length, 1)
  assert.equal(items[0].qty, 2)
  assert.equal(cartCount(items), 2)
  assert.equal(cartTotal(items), 100000)
  assert.equal(original[0].qty, 1, 'the original cart is not mutated')
})

test('different products remain separate cart lines', () => {
  let items = addCartItem([], product)
  items = addCartItem(items, { id: 'book', name: 'A Lamp on a Hill', price: 50000, delivery: 'physical' })
  assert.equal(items.length, 2)
  assert.equal(cartCount(items), 2)
  assert.equal(cartTotal(items), 100000)
})

test('sizes create separate lines while the same size increments quantity', () => {
  const blazer = { id: 'blazer', name: 'MOBA Blazer', variant: 'Navy', price: 50000, delivery: 'physical' }
  let items = addCartItem([], blazer, 'M')
  items = addCartItem(items, blazer, 'XL')
  items = addCartItem(items, blazer, 'M')
  assert.deepEqual(items.map(i => [i.id, i.qty]), [['blazer:M', 2], ['blazer:XL', 1]])
  assert.equal(items[0].name, 'MOBA Blazer (Navy), size M')
  assert.equal(items[1].name, 'MOBA Blazer (Navy), size XL')
  assert.equal(cartCount(items), 3)
  assert.equal(cartTotal(items), 150000)
})
