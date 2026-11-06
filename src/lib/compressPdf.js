import { MAX_PDF_MB } from './uploadLimits.js'

const MAX_BYTES = MAX_PDF_MB * 1024 * 1024
const mb = bytes => (bytes / (1024 * 1024)).toFixed(1)

// Small PDFs keep their original text, links and metadata. PDF.js and jsPDF are downloaded by
// the editor only when an oversized PDF actually needs browser-side image compression.
export async function fitPdfToUploadLimit(file, onProgress = () => {}) {
  if (file.size <= MAX_BYTES) return { file, compressed: false }

  onProgress('Loading PDF compressor…')
  const [pdfjs, { jsPDF }, worker] = await Promise.all([
    import('pdfjs-dist/build/pdf.mjs'),
    import('jspdf'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default

  let pdf
  try {
    pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  } catch {
    throw new Error('This PDF could not be opened for compression. Try removing its password or use another PDF.')
  }

  try {
    // A second, smaller pass handles especially large scans without making ordinary documents
    // unnecessarily blurry. Pages are rendered as JPEG images, so text is no longer selectable.
    for (const [pass, maxSide, quality] of [[1, 1400, 0.72], [2, 1000, 0.55]]) {
      let output = null
      for (let number = 1; number <= pdf.numPages; number += 1) {
        onProgress(`Compressing PDF${pass === 2 ? ' more strongly' : ''}… page ${number} of ${pdf.numPages}`)
        const page = await pdf.getPage(number)
        const original = page.getViewport({ scale: 1 })
        const scale = Math.min(2, maxSide / Math.max(original.width, original.height))
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.ceil(viewport.width))
        canvas.height = Math.max(1, Math.ceil(viewport.height))
        const context = canvas.getContext('2d', { alpha: false })
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvasContext: context, viewport, background: '#ffffff' }).promise

        const width = original.width
        const height = original.height
        const orientation = width > height ? 'landscape' : 'portrait'
        if (!output) output = new jsPDF({ orientation, unit: 'pt', format: [width, height], compress: true })
        else output.addPage([width, height], orientation)
        output.addImage(canvas.toDataURL('image/jpeg', quality), 'JPEG', 0, 0, width, height, undefined, 'FAST')

        page.cleanup()
        canvas.width = 0
        canvas.height = 0
      }

      const blob = output.output('blob')
      if (blob.size <= MAX_BYTES) {
        const name = file.name.replace(/\.pdf$/i, '') + '-compressed.pdf'
        return { file: new File([blob], name, { type: 'application/pdf' }), compressed: true }
      }
      if (pass === 2) throw new Error(`The compressed PDF is still ${mb(blob.size)} MB. Split it into smaller PDFs and upload them separately.`)
    }
  } finally {
    await pdf.destroy()
  }

  throw new Error('The PDF could not be compressed. Please try another file.')
}
