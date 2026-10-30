import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContent } from '../lib/siteContent.js'
import { archiveStory, archiveWhen, findArchive, isPhotoOnly } from '../lib/archives.js'
import { safeUrl } from '../lib/safeUrl.js'

const button =
  'rounded-md border border-brand/30 px-4 py-2 font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

// The page for one archive record: its picture, its story, and a link to the document if there is one.
export default function ArchiveRecord() {
  const { archives, settled } = useContent()
  const { slug } = useParams()
  const record = findArchive(archives, slug)
  const [copied, setCopied] = useState(false)

  // Content may still be arriving from the server; do not claim the record is missing until it has.
  if (!record && !settled) return <div className="min-h-[50vh]" aria-busy="true" />

  if (!record) {
    return (
      <section className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-brand">Record not found</h1>
        <p className="mt-2 text-ink/70">That archive record does not exist or has moved.</p>
        <Link to="/archives" className="inline-block mt-6 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">
          See all archives
        </Link>
      </section>
    )
  }

  const paragraphs = archiveStory(record)
  const photoOnly = isPhotoOnly(record)
  const picture = safeUrl(record.cover)
  const file = safeUrl(record.file)
  const url = typeof window === 'undefined' ? '' : window.location.href
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${record.title} ${url}`)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy this link', window.location.href)
    }
  }

  return (
    <>
      <section className="bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link to="/archives" className="text-sm font-medium text-gold hover:underline">← Archives</Link>
          <p className="mt-5 text-sm font-semibold text-gold">
            {record.category} · {archiveWhen(record)}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">{record.title}</h1>
          {record.author && <p className="mt-3 text-lg text-white/90">By {record.author}</p>}
          {record.source && <p className="mt-3 text-white/80">Supplied by {record.source}</p>}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 mt-10">
        {picture && (
          <img
            src={picture}
            alt={photoOnly ? record.title : `Cover of ${record.title}`}
            className={`rounded-lg shadow ${photoOnly ? 'w-full' : 'w-full max-w-sm'}`}
          />
        )}
        {record.summary && <p className="mt-8 text-xl leading-relaxed text-ink/90">{record.summary}</p>}
        {paragraphs.length > 0 && (
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/80 max-w-prose">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        {file && (
          <div className="mt-8 rounded-md border border-brand/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gold-dark">Document</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Open the document<span className="sr-only"> ({record.title})</span>
              </a>
              {record.size && <span className="text-sm text-ink/70">{record.size}</span>}
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-brand/10 flex flex-wrap items-center gap-3">
          <span className="text-sm text-ink/70">Share this</span>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={button}>WhatsApp</a>
          <button type="button" onClick={copyLink} className={button}>
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <span role="status" className="sr-only">{copied ? 'Link copied' : ''}</span>
        </div>
      </article>

      <section className="max-w-3xl mx-auto px-4 mt-10 mb-4">
        <Link to="/archives" className="font-medium text-brand underline">Back to all archives</Link>
      </section>
    </>
  )
}
