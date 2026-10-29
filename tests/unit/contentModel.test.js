import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../../src/lib/contentModel.js'
import * as base from '../../src/data/content.js'
import { lifeMembers as baseLifeMembers } from '../../src/data/lifeMembers.js'

test('unmanaged collections use the bundled content', () => {
  const result = build(null)
  assert.equal(result.products, base.products)
  assert.equal(result.news, base.news)
  assert.equal(result.site.name, base.site.name)
})

test('a managed collection uses published database rows instead of bundled items', () => {
  const result = build({
    managed: ['product'],
    rows: [{ id: 'row-1', kind: 'product', key: null, data: { id: 'book', name: 'A book', price: 50000 } }],
  })
  assert.equal(result.products.length, 1)
  assert.equal(result.products[0].id, 'book')
  assert.equal(result.products[0]._id, 'row-1')
  assert.equal(result.products[0].name, 'A book')
})

test('a managed empty collection stays empty instead of resurrecting deleted fallback items', () => {
  const result = build({ managed: ['product', 'news'], rows: [] })
  assert.deepEqual(result.products, [])
  assert.deepEqual(result.news, [])
})

test('published photos use their database row id while preserving image data', () => {
  const result = build({
    managed: ['photo'],
    rows: [{ id: 'photo-row', kind: 'photo', key: null, data: { id: 99, src: '/photo.webp', caption: 'Campus' } }],
  })
  assert.equal(result.photos.length, 1)
  assert.equal(result.photos[0].id, 'photo-row')
  assert.equal(result.photos[0]._id, 'photo-row')
  assert.equal(result.photos[0].src, '/photo.webp')
})

test('site settings merge social defaults and reject an invalid donate shape', () => {
  const result = build({
    managed: ['setting'],
    rows: [{
      id: 'settings-row', kind: 'setting', key: 'site',
      data: { email: 'office@example.org', donate: 'invalid', social: { facebook: 'https://facebook.com/moba' } },
    }],
  })
  assert.equal(result.site.email, 'office@example.org')
  assert.equal(result.site.social.facebook, 'https://facebook.com/moba')
  assert.equal(result.site.social.linkedin, base.site.social.linkedin)
  assert.equal(result.site.donate, base.site.donate)
})

test('unmanaged rosters keep the complete built-in life member and headmaster lists', () => {
  const result = build(null)
  assert.deepEqual(result.lifeMembers, baseLifeMembers.map(name => ({ name })))
  assert.equal(result.history.headmasters, base.history.headmasters)
})

test('managed rosters use published rows while preserving the rest of the history content', () => {
  const result = build({
    managed: ['life_member', 'headmaster'],
    rows: [
      { id: 'life-row', kind: 'life_member', key: null, data: { name: 'Managed Life Member' } },
      { id: 'head-row', kind: 'headmaster', key: null, data: { name: 'Managed Headmaster', note: '2000 to 2001' } },
    ],
  })

  assert.deepEqual(result.lifeMembers, [{ name: 'Managed Life Member', _id: 'life-row' }])
  assert.deepEqual(result.history.headmasters, [{ name: 'Managed Headmaster', note: '2000 to 2001', _id: 'head-row' }])
  assert.equal(result.history.intro, base.history.intro)
})

test('managed empty rosters stay empty instead of restoring built-in entries', () => {
  const result = build({ managed: ['life_member', 'headmaster'], rows: [] })
  assert.deepEqual(result.lifeMembers, [])
  assert.deepEqual(result.history.headmasters, [])
})
