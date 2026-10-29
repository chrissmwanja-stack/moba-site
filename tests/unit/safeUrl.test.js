import test from 'node:test'
import assert from 'node:assert/strict'
import { safeUrl } from '../../src/lib/safeUrl.js'

test('safe internal, HTTP, email and telephone links are retained and trimmed', () => {
  assert.equal(safeUrl('/about#leadership'), '/about#leadership')
  assert.equal(safeUrl('  https://example.org/page  '), 'https://example.org/page')
  assert.equal(safeUrl('HTTPS://example.org'), 'HTTPS://example.org')
  assert.equal(safeUrl('mailto:info@example.org'), 'mailto:info@example.org')
  assert.equal(safeUrl('tel:+256700000000'), 'tel:+256700000000')
})

test('dangerous, ambiguous and unsupported URLs are rejected', () => {
  const rejected = [
    null, undefined, '', 'javascript:alert(1)', 'data:text/html,hello',
    '//example.org', '/bad\\path', 'ftp://example.org/file', 'relative-page',
  ]
  for (const value of rejected) assert.equal(safeUrl(value), null, String(value))
})
