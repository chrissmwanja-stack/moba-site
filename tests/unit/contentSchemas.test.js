import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as base from '../../src/data/content.js'
import { lifeMembers } from '../../src/data/lifeMembers.js'
import { SECTIONS, fromForm, problems } from '../../src/lib/contentSchemas.js'

const lifeSection = SECTIONS.find(section => section.kind === 'life_member')
const headmasterSection = SECTIONS.find(section => section.kind === 'headmaster')
const newsSection = SECTIONS.find(section => section.kind === 'news')

test('life member and headmaster admin sections import every built-in entry in order', () => {
  assert.equal(lifeSection.reorder, true)
  assert.equal(headmasterSection.reorder, true)
  assert.deepEqual(lifeSection.sample(), lifeMembers.map(name => ({ name })))
  assert.deepEqual(headmasterSection.sample(), base.history.headmasters)
})

test('roster forms trim names and require public display details before publishing', () => {
  assert.deepEqual(fromForm(lifeSection, { name: '  A Mwirian  ' }), { name: 'A Mwirian' })
  assert.deepEqual(fromForm(headmasterSection, { name: '  A Headmaster  ', note: '  2000 to 2001  ' }), { name: 'A Headmaster', note: '2000 to 2001' })
  assert.deepEqual(problems(lifeSection, {}), ['Full name is required.'])
  assert.deepEqual(problems(headmasterSection, { name: 'A Headmaster' }), ['Years / note is required.'])
})

test('current newsletter items require a PDF and use the News & events editor', () => {
  const item = { title: 'November newsletter', date: '2026-11-06', category: 'Newsletter', excerpt: 'The latest MOBA updates.' }
  assert.ok(base.newsCategories.includes('Newsletter'))
  assert.ok(problems(newsSection, item).includes('Add the newsletter PDF.'))
  assert.deepEqual(problems(newsSection, { ...item, file: '/newsletters/november.pdf' }), [])
})

test('the roster migration enables both new content kinds', () => {
  const sql = readFileSync(new URL('../../supabase/migrations/202610290001_editable_rosters.sql', import.meta.url), 'utf8')
  assert.match(sql, /'life_member'/)
  assert.match(sql, /'headmaster'/)
  assert.match(sql, /drop constraint if exists site_content_kind_check/)
})
