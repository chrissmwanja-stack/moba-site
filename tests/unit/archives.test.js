import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { archiveStory, archiveWhen, archiveYear, archiveYears, isPhotoOnly, sortArchives, archiveSearchText, yearHeading } from '../../src/lib/archives.js'
import { SECTIONS, fromForm, problems, toForm } from '../../src/lib/contentSchemas.js'
import { archiveCategories } from '../../src/data/content.js'
import { MAX_PDF_MB } from '../../src/lib/uploadLimits.js'

const section = SECTIONS.find(s => s.kind === 'archive')

test('records without a usable year are undated and listed last', () => {
  assert.equal(archiveYear({ year: 1988 }), 1988)
  assert.equal(archiveYear({ year: '1988' }), 1988)
  assert.equal(archiveYear({}), null)
  assert.equal(archiveYear({ year: '' }), null)
  assert.equal(archiveYear({ year: 'unknown' }), null)
  const sorted = sortArchives([{ title: 'B' }, { title: 'A', year: 1950 }, { title: 'C', year: 1988 }, { title: 'A2' }])
  assert.deepEqual(sorted.map(a => a.title), ['C', 'A', 'A2', 'B'])
  assert.deepEqual(archiveYears(sorted), [1988, 1950, null])
  assert.equal(yearHeading(null), 'Undated')
  assert.equal(yearHeading(1988), '1988')
})

test('the period is shown in place of the year and is searchable', () => {
  assert.equal(archiveWhen({ year: 1988, period: '1988/89' }), '1988/89')
  assert.equal(archiveWhen({ year: 1988 }), 1988)
  assert.equal(archiveWhen({}), 'Undated')
  assert.match(archiveSearchText({ title: 'Mpala Magazine', year: 1988, period: '1988/89', category: 'Mpala Magazine' }), /1988\/89/)
})

test('the archive form allows undated records, a period and a cover picture', () => {
  const keys = section.fields.map(f => f.key)
  assert.ok(keys.includes('period'))
  assert.ok(keys.includes('cover'))
  assert.equal(section.fields.find(f => f.key === 'year').required, undefined)
  const data = fromForm(section, { title: 'Mpala Magazine 1988/89', year: '', period: '1988/89', category: 'Mpala Magazine', file: 'https://example.org/m.pdf', cover: '', size: '10.2 MB', summary: '', source: '' })
  assert.equal(data.year, undefined)
  assert.equal(data.period, '1988/89')
  assert.deepEqual(problems(section, data), [])
  assert.equal(toForm(section, data).year, '')
})

test('archive categories include the new record types and keep the old ones', () => {
  for (const c of ['Mpala Magazine', 'Photographs', 'Registers & rolls', 'House records', 'Other', 'Minutes', 'Programmes & magazines']) {
    assert.ok(archiveCategories.includes(c), c)
  }
})

test('the PDF limit in code matches the storage bucket limit set by the latest migration', () => {
  const sql = readFileSync(new URL('../../supabase/migrations/202610300001_archive_pdf_limit.sql', import.meta.url), 'utf8')
  assert.match(sql, new RegExp(`file_size_limit = ${MAX_PDF_MB * 1024 * 1024}\\b`))
})

test('a photograph-only record needs a picture but no document', () => {
  const photo = fromForm(section, { title: 'Prefects Council', year: '1947', category: 'Photographs', summary: 'The prefects council of 1947', cover: 'https://example.org/p.webp', coverThumb: 'https://example.org/p-640.webp', file: '', period: '', size: '', source: 'MOBA PR' })
  assert.equal(photo.file, undefined)
  assert.equal(photo.coverThumb, 'https://example.org/p-640.webp')
  assert.deepEqual(problems(section, photo), [])
  assert.equal(isPhotoOnly(photo), true)
  assert.equal(isPhotoOnly({ file: '/a.pdf', cover: '/c.webp' }), false)
  assert.equal(isPhotoOnly({ file: '/a.pdf' }), false)
})

test('a record with neither a document nor a picture cannot be published', () => {
  const empty = fromForm(section, { title: 'Nothing attached', year: '1950', category: 'Other', file: '', cover: '' })
  assert.deepEqual(problems(section, empty), ['Add a document (PDF) or a picture.'])
  assert.deepEqual(problems(section, fromForm(section, { title: 'Minutes', category: 'Minutes', file: 'https://example.org/m.pdf' })), [])
})

test('a record can carry a written story, which is searchable and optional', () => {
  assert.equal(section.fields.find(f => f.key === 'story').type, 'paragraphs')
  assert.equal(section.fields.find(f => f.key === 'story').required, undefined)
  const form = { title: 'Prefects Council', year: '1947', category: 'Photographs', cover: 'https://example.org/p.webp', file: '', story: 'First paragraph.\n\nSecond paragraph about Mr Kasule.' }
  const data = fromForm(section, form)
  assert.deepEqual(data.story, ['First paragraph.', 'Second paragraph about Mr Kasule.'])
  assert.deepEqual(problems(section, data), [])
  assert.equal(toForm(section, data).story, 'First paragraph.\n\nSecond paragraph about Mr Kasule.')
  assert.deepEqual(archiveStory(data), data.story)
  assert.deepEqual(archiveStory({ story: 'One.\n\nTwo.' }), ['One.', 'Two.'])
  assert.deepEqual(archiveStory({}), [])
  assert.match(archiveSearchText(data), /kasule/)
  assert.equal(fromForm(section, { ...form, story: '' }).story, undefined)
})
