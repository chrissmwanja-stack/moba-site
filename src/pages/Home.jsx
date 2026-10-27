import { Link } from 'react-router-dom'
import NewsCard from '../components/NewsCard.jsx'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'
import { formatDate } from '../lib/format.js'
import { newsPath } from '../lib/news.js'

export default function Home() {
  const { projects, news, photos, about, stats } = useContent()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const latest = news.filter(n => n.date < today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  // Match the column count to the number of events so a short list does not leave a gap
  const cols = { 1: 'md:grid-cols-1 max-w-md', 2: 'md:grid-cols-2 max-w-3xl', 3: 'md:grid-cols-3' }[upcoming.length] || 'md:grid-cols-3'
  const featured = photos.filter(p => p.featured)
  const strip = (featured.length >= 3 ? featured : photos).slice(0, 3)
  return (
    <>
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-brand md:min-h-[600px]">
        <img
          src="/mwiri-hero.webp"
          alt="Busoga College Mwiri main block under jacaranda trees"
          fetchpriority="high"
          decoding="async"
          className="absolute right-0 top-0 -z-20 h-full w-full object-cover md:w-[70%]"
        />
        {/* Navy wash: solid behind the text, fading to clear photo on the right (heavier on phones for legibility) */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand/85 md:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden md:block"
          style={{ backgroundImage: 'linear-gradient(90deg, #0a2a5e 0%, #0a2a5e 34%, rgba(10,42,94,0.82) 50%, rgba(10,42,94,0.15) 80%, rgba(10,42,94,0) 100%)' }}
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="flex max-w-[620px] flex-col gap-6 text-white">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-gold">{site.fullName}</p>
            <h1 className="font-display text-[40px] font-bold leading-[1.08] md:text-6xl">
              One Heritage.<br />Many Generations.<br /><span className="text-gold">A Stronger Mwiri.</span>
            </h1>
            <div className="h-[3px] w-16 bg-gold" aria-hidden="true" />
            <p className="text-lg leading-relaxed text-white/90">{about.promise}</p>
            <div className="mt-1 flex flex-wrap gap-3.5">
              <Link to="/membership" className="rounded bg-gold px-7 py-4 text-[15px] font-semibold text-brand-dark hover:brightness-110">Join MOBA</Link>
              <Link to="/history" className="rounded border-[1.5px] border-white px-7 py-4 text-[15px] font-semibold text-white hover:bg-white/10">Explore Our Mwiri</Link>
            </div>
          </div>
        </div>
      </section>

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
              <article key={n.title + n.date} className="relative bg-white rounded-lg shadow p-5 border-l-4 border-gold hover:shadow-md focus-within:ring-2 focus-within:ring-brand">
                <p className="text-xs text-gold-dark font-semibold">
                  {formatDate(n.date, 'long')}
                </p>
                <h3 className="font-semibold mt-1">
                  <Link to={newsPath(n)} className="hover:underline focus:outline-none after:absolute after:inset-0">{n.title}</Link>
                </h3>
                {n.place && <p className="text-sm text-ink/70">{n.place}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-brand">Latest news</h2>
            <Link to="/news" className="text-brand font-medium hover:underline">All news →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            {latest.map(n => <NewsCard key={n.title + n.date} item={n} />)}
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

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-brand-dark text-white rounded-lg shadow p-8 md:p-10 border-b-4 border-gold text-center">
          <h2 className="text-2xl font-bold">Get involved</h2>
          <p className="mt-2 text-white/80 max-w-xl mx-auto">Join the association, enrol for funeral cover, support a project, or keep your details up to date.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/membership" className="bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">Become a member</Link>
            <Link to="/projects" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">Support a project</Link>
            <Link to="/update-details" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">Update your details</Link>
          </div>
        </div>
      </section>
    </>
  )
}
