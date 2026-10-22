import { Link } from 'react-router-dom'
import PhotoBand from '../components/PhotoBand.jsx'
import { site, stats, projects, news } from '../data/content.js'

export default function Home() {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  return (
    <>
      <PhotoBand>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold uppercase tracking-widest text-sm font-semibold">Est. {site.founded}</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">{site.fullName}</h1>
            <p className="mt-4 text-xl text-white/80 max-w-xl">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/history" className="bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">Our story</Link>
              <Link to="/gallery" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">View gallery</Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src="/moba-logo-light.webp" alt="MOBA — Mwiri Old Boys Association, 1911" className="h-72 md:h-96 w-auto" />
          </div>
        </div>
      </PhotoBand>

      <section className="max-w-6xl mx-auto px-4 -mt-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-6 text-center border-t-4 border-gold">
              <p className="text-3xl font-bold text-brand">{s.value}</p>
              <p className="text-sm text-ink/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-brand">Upcoming events</h2>
            <Link to="/news" className="text-brand font-medium hover:underline">All news →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            {upcoming.map(n => (
              <article key={n.title + n.date} className="bg-white rounded-lg shadow p-5 border-l-4 border-gold">
                <p className="text-xs text-gold-dark font-semibold">
                  {new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="font-semibold mt-1">{n.title}</h3>
                {n.place && <p className="text-sm text-ink/60">{n.place}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold text-brand">About MOBA</h2>
        <p className="mt-3 text-ink/80 max-w-3xl leading-relaxed">
          Replace this with a short paragraph about the association: who you are, what you stand for,
          and why Old Boys should stay connected.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-brand">Recent projects</h2>
          <Link to="/projects" className="text-brand font-medium hover:underline">All projects →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {projects.slice(0, 3).map(p => (
            <article key={p.title} className="bg-white rounded-lg shadow p-5">
              <p className="text-xs text-gold-dark font-semibold">{p.year}</p>
              <h3 className="font-semibold mt-1">{p.title}</h3>
              <p className="text-sm text-ink/70 mt-2">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
