
import { formatDate } from '../lib/format.js'
import { isNewsletter } from '../lib/news.js'
import { safeUrl } from '../lib/safeUrl.js'

const action =
  'inline-flex items-center justify-center rounded-md border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

// Current newsletters are News & Events items with a PDF. Historical copies stay in Archives.
export default function NewsletterList({ items }) {
  const newsletters = items
    .filter(item => isNewsletter(item) && safeUrl(item.file))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="mx-auto mt-16 max-w-6xl border-t border-brand/15 px-4 pb-4 pt-12 md:mt-20" aria-labelledby="newsletters-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-dark">From MOBA</p>
        <h2 id="newsletters-heading" className="mt-2 font-display text-3xl font-bold text-brand">Current newsletters</h2>
        <p className="mt-2 text-ink/70">Catch up on the latest association news, stories and updates. Read or download our newsletter PDFs.</p>
      </div>

      {newsletters.length === 0 ? (
        <p className="mt-6 rounded-md border border-brand/10 bg-white p-6 text-ink/70">No current newsletters have been published yet. Check back soon.</p>
      ) : (
        <ul className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsletters.map(item => {
            const file = safeUrl(item.file)
            const cover = safeUrl(item.image)
            return (
              <li key={item._id || `${item.title}-${item.date}`} className="flex overflow-hidden rounded-md border border-brand/10 bg-white shadow-sm">
                {cover && (
                  <img src={cover} alt="" loading="lazy" decoding="async" className="hidden w-24 shrink-0 border-r border-brand/10 object-cover sm:block md:hidden lg:block" />
                )}
                <article className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider">
                    <time dateTime={item.date} className="text-gold-dark">{formatDate(item.date)}</time>
                    <span className="rounded bg-brand/5 px-2 py-1 text-brand">PDF</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-brand">{item.title}</h3>
                  {item.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{item.excerpt}</p>}
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <a href={file} target="_blank" rel="noopener noreferrer" className={action}>
                      Read PDF<span className="sr-only">: {item.title}</span>
                    </a>
                    <a href={file} download target="_blank" rel="noopener noreferrer" className={action}>
                      Download<span className="sr-only"> {item.title} PDF</span>
                    </a>
                  </div>
                  {item.size && <p className="mt-3 text-xs text-ink/70">{item.size}</p>}
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
