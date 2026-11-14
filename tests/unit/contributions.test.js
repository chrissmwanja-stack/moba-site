import test from 'node:test'
import assert from 'node:assert/strict'
import { checkContributionFile, checkContributionFiles, contributionType, fileSize, MAX_CONTRIBUTION_FILES, MAX_CONTRIBUTION_MB } from '../../src/lib/contributionFiles.js'

const file = (name, size = 1000, type = '') => ({ name, size, type })

test('pictures, PDFs and Word articles are accepted, by type or by extension', () => {
  assert.equal(contributionType(file('a.jpg', 1, 'image/jpeg')), 'image/jpeg')
  assert.equal(contributionType(file('Scan.PDF')), 'application/pdf')
  assert.equal(contributionType(file('story.docx')), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
})

test('other file types are refused with a plain message', () => {
  for (const name of ['virus.exe', 'page.html', 'old.doc', 'photo.heic', 'noext']) {
    assert.match(checkContributionFile(file(name)), /not a supported type/)
  }
})

test('files over the size limit and empty files are refused', () => {
  assert.match(checkContributionFile(file('big.pdf', MAX_CONTRIBUTION_MB * 1024 * 1024 + 1)), /larger than/)
  assert.match(checkContributionFile(file('empty.pdf', 0)), /empty/)
  assert.equal(checkContributionFile(file('ok.pdf', MAX_CONTRIBUTION_MB * 1024 * 1024)), '')
})

test('no more than the allowed number of files can be attached', () => {
  const ten = Array.from({ length: MAX_CONTRIBUTION_FILES }, (_, i) => file(`p${i}.jpg`))
  assert.equal(checkContributionFiles([], ten), '')
  assert.match(checkContributionFiles(ten, [file('one-more.jpg')]), /up to/)
})

test('file sizes are shown in KB or MB', () => {
  assert.equal(fileSize(500), '1 KB')
  assert.equal(fileSize(2048), '2 KB')
  assert.equal(fileSize(3 * 1048576), '3.0 MB')
})
