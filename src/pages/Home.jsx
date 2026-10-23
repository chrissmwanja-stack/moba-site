import { Link } from 'react-router-dom'
import PhotoBand from '../components/PhotoBand.jsx'
import { site, stats, projects, news, photos, about } from '../data/content.js'
import { formatDate } from '../lib/format.js'

export default function Home() {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  // Match the column count to the number of events so a short list does not leave a gap
  const cols = { 1: 'md:grid-cols-1 max-w-md', 2: 'md:grid-cols-2 max-w-3xl', 3: 'md:grid-cols-3' }[upcoming.length] || 'md:grid-cols-3'
  const featured = photos.filter(p => p.featured)
  const strip = (featured.length >= 3 ? featured : photos).slice(0, 3)
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
              <p className="text-sm text-ink/70 mt-1">{s.label}</p>
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
          <div className={`grid gap-4 mt-6 ${cols}`}>
            {upcoming.map(n => (
              <article key={n.title + n.date} className="bg-white rounded-lg shadow p-5 border-l-4 border-gold">
                <p className="text-xs text-gold-dark font-semibold">
                  {formatDate(n.date, 'long')}
                </p>
                <h3 className="font-semibold mt-1">{n.title}</h3>
                {n.place && <p className="text-sm text-ink/70">{n.place}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold text-brand">About MOBA</h2>
        <p className="mt-3 text-ink/80 max-w-3xl leading-relaxed">{about.summary}</p>
        <Link to="/about" className="inline-block mt-3 text-brand font-medium hover:underline">More about MOBA →</Link>
      </section>

      {strip.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-brand">From the gallery</h2>
            <Link to="/gallery" className="text-brand font-medium hover:underline">All photos →</Link>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mt-6">
            {strip.map((p, i) => (
              <Link key={p.id} to="/gallery"
                className={`group relative aspect-4/3 overflow-hidden rounded-lg bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${i === 2 ? 'hidden md:block' : ''}`}>
                <img src={p.thumb || p.src} alt={p.alt || p.caption} loading="lazy" decoding="async"
                  style={{ objectPosition: p.focus || '50% 40%' }}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-xs text-white">
                  {p.caption} · {p.event || p.year}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
