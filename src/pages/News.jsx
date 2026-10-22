import PageHeader from '../components/PageHeader.jsx'
import { news } from '../data/content.js'

const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function Item({ n }) {
  return (
    <article className="bg-white rounded-lg shadow p-5 flex gap-5">
      <div className="text-center shrink-0 w-16">
        <p className="text-2xl font-bold text-brand leading-none">{new Date(n.date).getDate()}</p>
        <p className="text-xs uppercase text-gold-dark font-semibold">{new Date(n.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
      </div>
      <div>
        <span className="text-xs font-semibold bg-gold/30 text-gold-dark px-2 py-0.5 rounded">{n.type}</span>
        <h3 className="font-semibold text-lg mt-1">{n.title}</h3>
        {n.place && <p className="text-sm text-ink/60">{fmt(n.date)} · {n.place}</p>}
        <p className="text-sm text-ink/70 mt-2">{n.summary}</p>
      </div>
    </article>
  )
}

export default function News() {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = news.filter(n => n.date < today).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader title="News & Events" subtitle="What is happening in the MOBA family." />
      <section className="max-w-3xl mx-auto px-4 mt-12 space-y-10">
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand mb-4">Upcoming</h2>
            <div className="space-y-4">{upcoming.map(n => <Item key={n.title + n.date} n={n} />)}</div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand mb-4">Earlier</h2>
            <div className="space-y-4">{past.map(n => <Item key={n.title + n.date} n={n} />)}</div>
          </div>
        )}
      </section>
    </>
  )
}
