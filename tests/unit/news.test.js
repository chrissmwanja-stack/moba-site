import test from 'node:test'
import assert from 'node:assert/strict'
import { bodyParagraphs, newsPath, newsSlug, slugify } from '../../src/lib/news.js'
import { formatDate, ugx } from '../../src/lib/format.js'

test('news slugs are stable, readable and prefixed with the event date by default', () => {
  assert.equal(slugify('  Old Boys Reunion & AGM! '), 'old-boys-reunion-agm')
  const item = { date: '2026-11-14', title: 'Old Boys Reunion' }
  assert.equal(newsSlug(item), '2026-11-14-old-boys-reunion')
  assert.equal(newsPath(item), '/news/2026-11-14-old-boys-reunion')
})

test('an explicit news slug overrides the generated value', () => {
  assert.equal(newsSlug({ date: '2026-11-14', title: 'Ignored', slug: 'reunion' }), 'reunion')
})

test('article bodies accept arrays or blank-line-separated text', () => {
  assert.deepEqual(bodyParagraphs(['One', 'Two']), ['One', 'Two'])
  assert.deepEqual(bodyParagraphs('First paragraph.\n\nSecond paragraph.\n\n\nThird.'), [
    'First paragraph.', 'Second paragraph.', 'Third.',
  ])
  assert.deepEqual(bodyParagraphs(null), [])
})

test('calendar dates are formatted in UTC and currency uses the site convention', () => {
  assert.equal(formatDate('2026-11-14', 'long'), '14 November 2026')
  assert.equal(ugx(50000), 'UGX 50,000')
})
