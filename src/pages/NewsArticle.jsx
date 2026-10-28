import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NewsCard, { readingMinutes } from '../components/NewsCard.jsx'
import { useContent } from '../lib/siteContent.js'
import { formatDate } from '../lib/format.js'
import { newsSlug, bodyParagraphs } from '../lib/news.js'
import { safeUrl } from '../lib/safeUrl.js'

const button =
  'rounded-md border border-brand/30 px-4 py-2 font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export default function NewsArticle() {
  const { news } = useContent()
  const { slug } = useParams()
  const item = news.find(n => newsSlug(n) === slug)
  const [copied, setCopied] = useState(false)

  if (!item) {
    return (
      <section className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-brand">Article not found</h1>
        <p className="mt-2 text-ink/70">That news item does not exist or has moved.</p>
        <Link to="/news" className="inline-block mt-6 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">
          See all news and events
        </Link>
      </section>
    )
  }

  const { title, date, category, series, place, excerpt, image, link, minutes } = item
  const paragraphs = bodyParagraphs(item.body)
  const mins = minutes ?? (paragraphs.length ? readingMinutes(paragraphs.join(' ')) : null)
  const upcoming = date >= new Date().toISOString().slice(0, 10)
  const more = news.filter(n => n !== item).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

  const url = typeof window === 'undefined' ? '' : window.location.href
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`

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
          <Link to="/news" className="text-sm font-medium text-gold hover:underline">← News & Events</Link>
          {(category || series) && (
            <p className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-gold">
              {category && <span>{category}</span>}
              {series && <span className="rounded-full bg-gold/25 px-2 text-white">{series}</span>}
              {upcoming && <span className="rounded-full bg-gold px-2 text-brand-dark">Upcoming</span>}
            </p>
          )}
          <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
          <p className="mt-3 text-white/80">
            <time dateTime={date}>{formatDate(date, 'long')}</time>
            {place ? `, ${place}` : ''}
            {mins ? `, ${mins} min read` : ''}
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 mt-10">
        {image && (
          <img src={image} alt={item.imageAlt || ''} className="w-full aspect-video object-cover rounded-lg shadow" />
        )}
        {excerpt && <p className="mt-8 text-xl leading-relaxed text-ink/90">{excerpt}</p>}
        {paragraphs.length > 0 && (
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/80 max-w-prose">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
        {link && safeUrl(link.to) && (
          <Link
            to={safeUrl(link.to)}
            className="inline-block mt-8 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {link.label}
          </Link>
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

      {more.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-14">
          <h2 className="text-xl font-bold text-brand mb-4">More news and events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map(n => <NewsCard key={n.title + n.date} item={n} />)}
          </div>
        </section>
      )}
    </>
  )
}
