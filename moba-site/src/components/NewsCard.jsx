import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format.js'
import { newsPath, bodyParagraphs } from '../lib/news.js'

export function readingMinutes(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function NewsCard({ item }) {
  const { title, date, excerpt, body, image, category, series, minutes, place, to } = item
  const paragraphs = bodyParagraphs(body)
  const mins = minutes ?? (paragraphs.length ? readingMinutes(paragraphs.join(' ')) : null)
  return (
    <Link to={to ?? newsPath(item)} className="group block h-full overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
      <article className="flex h-full flex-col">
        <div className="aspect-[2/1] overflow-hidden bg-[#e7e9ed]">
          {image
            ? <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            : <div className="flex h-full items-center justify-center px-6 text-center"><span className="font-display text-lg italic text-brand/50">MOBA stories from the Hill</span></div>}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          {(category || series) && <p className="flex flex-wrap gap-x-2 text-sm font-semibold text-gold-dark">{category && <span>{category}</span>}{series && <span className="text-brand/55">{series}</span>}</p>}
          <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-brand md:text-2xl">{title}</h3>
          {place && <p className="mt-1 text-sm text-brand/60">{place}</p>}
          {excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand/70">{excerpt}</p>}
          <div className="mt-auto flex items-end justify-between gap-3 pt-5 text-sm text-brand/55">
            <span>{date && <time dateTime={date}>{formatDate(date)}</time>}{date && mins ? ' · ' : ''}{mins ? `${mins} min read` : ''}</span>
            <span className="shrink-0 font-semibold text-brand underline underline-offset-4 decoration-brand/40 group-hover:decoration-brand">Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
