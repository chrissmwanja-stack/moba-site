import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import NewsCard from '../components/NewsCard.jsx'
import { news, newsCategories } from '../data/content.js'

const chip =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold '

export default function News() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('category')
  const category = newsCategories.includes(requested) ? requested : 'All'

  const choose = c => (c === 'All' ? setParams({}) : setParams({ category: c }))

  const today = new Date().toISOString().slice(0, 10)
  const shown = category === 'All' ? news : news.filter(n => n.category === category)
  const upcoming = shown.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = shown.filter(n => n.date < today).sort((a, b) => b.date.localeCompare(a.date))
  const countOf = c => (c === 'All' ? news.length : news.filter(n => n.category === c).length)
  // Only offer categories that have at least one item, so visitors never land on an empty list.
  const offered = newsCategories.filter(c => countOf(c) > 0)

  return (
    <>
      <PageHeader title="News & Events" subtitle="What is happening in the MOBA family." />
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {['All', ...offered].map(c => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => choose(c)}
                aria-pressed={active}
                className={
                  chip +
                  (active
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-brand border-brand/25 hover:bg-gold/20')
                }
              >
                {c} <span className={active ? 'text-white/70' : 'text-ink/50'}>({countOf(c)})</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-8 space-y-12" aria-live="polite">
        {shown.length === 0 && (
          <p className="text-ink/70">Nothing in this category yet. Check back soon.</p>
        )}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand mb-4">Upcoming</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map(n => <NewsCard key={n.title + n.date} item={n} />)}
            </div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand mb-4">Earlier</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map(n => <NewsCard key={n.title + n.date} item={n} />)}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
