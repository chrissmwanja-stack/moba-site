import { Link } from 'react-router-dom'
import HomeNewsCard from '../components/HomeNewsCard.jsx'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'
import { newsPath } from '../lib/news.js'

function SectionIntro({ eyebrow, title, link, linkText = 'Explore more' }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand md:text-5xl">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="mb-1 font-semibold text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand">
          {linkText} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )
}

function EventCard({ item }) {
  const date = item.date ? new Date(`${item.date}T12:00:00`) : null
  return (
    <Link to={newsPath(item)} className="group block h-full rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
      <article className="flex h-full min-h-48 gap-5 p-5 md:p-6">
        {date && (
          <div className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-sm bg-brand text-white">
            <span className="font-display text-2xl font-bold leading-none">{date.getDate()}</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{date.toLocaleString('en-GB', { month: 'short' })}</span>
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">{item.category || 'MOBA event'}</p>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-brand md:text-2xl">{item.title}</h3>
          {item.place && <p className="mt-2 text-sm text-brand/65">{item.place}</p>}
          <span className="mt-auto pt-4 text-sm font-semibold text-brand underline underline-offset-4 decoration-brand/40 group-hover:decoration-brand">Event details →</span>
        </div>
      </article>
    </Link>
  )
}

export default function Home() {
  const { projects, news, photos, about, stats } = useContent()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = news.filter(n => n.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const latest = news.filter(n => n.date < today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const featured = photos.filter(p => p.featured)
  const strip = (featured.length >= 3 ? featured : photos).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-brand md:min-h-[600px]">
        <img src="/mwiri-hero.webp" alt="Busoga College Mwiri main block under jacaranda trees" fetchPriority="high" decoding="async"
          className="absolute right-0 top-0 -z-20 h-full w-full object-cover md:w-[70%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand/85 md:hidden" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block"
          style={{ backgroundImage: 'linear-gradient(90deg, #0a2a5e 0%, #0a2a5e 34%, rgba(10,42,94,0.82) 50%, rgba(10,42,94,0.15) 80%, rgba(10,42,94,0) 100%)' }} />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="flex max-w-[620px] flex-col gap-6 text-white">
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-gold">{site.fullName}</p>
            <h1 className="font-display text-[40px] font-bold leading-[1.08] md:text-6xl">One Heritage.<br />Many Generations.<br /><span className="text-gold">A Stronger Mwiri.</span></h1>
            <div className="h-[3px] w-16 bg-gold" aria-hidden="true" />
            <p className="text-lg leading-relaxed text-white/90">{about.promise}</p>
            <div className="mt-1 flex flex-wrap gap-3.5">
              <Link to="/membership" className="rounded-sm bg-gold px-7 py-4 text-[15px] font-semibold text-brand-dark hover:brightness-110">Join MOBA</Link>
              <Link to="/history" className="rounded-sm border border-white/70 px-7 py-4 text-[15px] font-semibold text-white hover:bg-white/10">Explore Our Mwiri</Link>
            </div>
          </div>
        </div>
      </section>

      {/* At-a-glance stats */}
      {stats.length > 0 && (
        <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4">
          <div className="grid overflow-hidden rounded-md bg-white shadow-lg sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-5 py-6 text-center ${i ? 'border-t border-brand/10 sm:border-l sm:border-t-0' : ''}`}>
                <p className="font-display text-3xl font-bold text-brand md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section className="mt-16 bg-[#f4f5f7] py-14 md:mt-20 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionIntro eyebrow="Save the date" title="Next on the calendar" link="/news" linkText="View all events" />
            <div className={`mt-8 grid items-stretch gap-5 md:mt-10 ${upcoming.length === 1 ? 'max-w-2xl' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
              {upcoming.map(n => <EventCard key={n.title + n.date} item={n} />)}
            </div>
          </div>
        </section>
      )}

      {/* Latest news */}
      {latest.length > 0 && (
        <section className="mt-16 bg-[#f4f5f7] py-14 md:mt-20 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionIntro eyebrow="Latest news" title="From the Hill and beyond" link="/news" linkText="View all news" />
            <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 md:mt-10">
              {latest.map(n => <HomeNewsCard key={n.title + n.date} item={n} />)}
            </div>
          </div>
        </section>
      )}

      {/* About MOBA */}
      <section className="mt-16 py-6 md:mt-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">Who we are</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand md:text-5xl">A brotherhood built to last.</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-brand/75">{about.summary}</p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand">Discover MOBA <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {strip.length > 0 && (
        <section className="mt-16 bg-[#f4f5f7] py-14 md:mt-20 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionIntro eyebrow="In pictures" title="Life on the Hill" link="/gallery" linkText="Explore the gallery" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
              {strip.map((p, i) => (
                <Link key={p.id} to="/gallery" className={`group relative aspect-[4/3] overflow-hidden rounded-md bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${i === 2 ? 'hidden md:block' : ''}`}>
                  <img src={p.thumb || p.src} alt={p.alt || p.caption} loading="lazy" decoding="async" style={{ objectPosition: p.focus || '50% 40%' }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12 text-sm font-medium text-white">{p.caption} · {p.event || p.year}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-16 py-6 md:mt-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionIntro eyebrow="Building Mwiri together" title="Progress with purpose" link="/projects" linkText="View all projects" />
            <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 xl:grid-cols-3">
              {projects.slice(0, 3).map(p => (
                <article key={p.title} className="overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-[2/1] overflow-hidden bg-gradient-to-br from-brand/10 to-gold/25">
                    {p.image ? <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-lg italic text-brand/50">MOBA project</div>}
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">{p.year}{p.status && ` · ${p.status}`}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-brand">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand/70">{p.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get involved */}
      <section className="mx-auto mt-16 max-w-6xl px-4 pb-16 md:mt-20 md:pb-20">
        <div className="overflow-hidden rounded-md bg-brand-dark px-6 py-12 text-center text-white md:px-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Your place is here</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">Keep the brotherhood moving forward.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">Join the association, enrol for funeral cover, support a project, or keep your details up to date.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/membership" className="rounded-sm bg-gold px-6 py-3 font-semibold text-brand-dark hover:brightness-110">Become a member</Link>
            <Link to="/projects" className="rounded-sm border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">Support a project</Link>
            <Link to="/update-details" className="rounded-sm border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">Update your details</Link>
          </div>
        </div>
      </section>
    </>
  )
}
