import PageHeader from '../components/PageHeader.jsx'
import NewsCard from '../components/NewsCard.jsx'
import { news } from '../data/content.js'

export default function News() {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = news.filter(n => n.date < today).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader title="News & Events" subtitle="What is happening in the MOBA family." />
      <section className="max-w-6xl mx-auto px-4 mt-12 space-y-12">
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
