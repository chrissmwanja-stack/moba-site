import test from 'node:test'
import assert from 'node:assert/strict'
import { fitPdfToUploadLimit } from '../../src/lib/compressPdf.js'

test('PDFs already within the upload limit are returned unchanged', async () => {
  const file = new File(['%PDF-1.4\n'], 'newsletter.pdf', { type: 'application/pdf' })
  const result = await fitPdfToUploadLimit(file)
  assert.equal(result.file, file)
  assert.equal(result.compressed, false)
})
