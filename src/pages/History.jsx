import { Link } from 'react-router-dom'
import PhotoBand from '../components/PhotoBand.jsx'
import OurMwiriNav from '../components/OurMwiriNav.jsx'
import { useContent } from '../lib/siteContent.js'

function Figure({ img }) {
  return (
    <figure className="overflow-hidden rounded-lg bg-white shadow">
      <img src={img.src} alt={img.alt} loading="lazy" className="h-56 w-full object-cover" />
      <figcaption className="p-3 text-sm text-ink/70">{img.caption}</figcaption>
    </figure>
  )
}

function Heading({ label, title }) {
  return (
    <>
      {label && <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">{label}</p>}
      <h2 className="mt-1 font-display text-2xl font-bold text-brand md:text-3xl">{title}</h2>
    </>
  )
}

export default function History() {
  const { timeline, history: h } = useContent()
  return (
    <>
      <PhotoBand>
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">Our History</h1>
          <p className="mt-2 text-white/80 max-w-2xl">{h.intro}</p>
        </div>
      </PhotoBand>
      <OurMwiriNav />

      {h.chapters.map(c => (
        <section key={c.title} className="max-w-4xl mx-auto px-4 mt-12">
          <Heading label={c.label} title={c.title} />
          <div className="mt-4 space-y-4 leading-relaxed text-ink/80">
            {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {c.images && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{c.images.map(img => <Figure key={img.src} img={img} />)}</div>
          )}
        </section>
      ))}

      <section className="max-w-3xl mx-auto px-4 mt-14">
        <Heading label="Milestones" title="Over a century on the Hill" />
        <ol className="relative mt-6 border-l-2 border-brand/30 ml-3">
          {timeline.map((t, i) => (
            <li key={`${t.year}-${i}`} className="mb-10 ml-6">
              <span className="absolute -left-2.25 w-4 h-4 rounded-full bg-gold border-2 border-white" />
              <p className="text-sm font-semibold text-brand">{t.year}</p>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-ink/70 mt-1">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-6">
        <h3 className="font-display text-xl font-bold text-brand">{h.headmastersTitle}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {h.headmasters.map(m => (
            <li key={m.name} className="rounded-lg bg-white p-4 shadow">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-ink/70">{m.note}</p>
            </li>
          ))}
        </ul>
        {h.headmastersNote && <p className="mt-3 text-sm text-ink/60">{h.headmastersNote}</p>}
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <Heading label="The nine houses" title="Where every Mwirian belongs" />
        <p className="mt-4 max-w-3xl leading-relaxed text-ink/80">{h.housesIntro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {h.houses.map(x => (
            <article key={x.name} className="rounded-lg border-t-4 border-gold bg-white p-5 shadow">
              <h3 className="font-display text-lg font-bold text-brand">{x.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{x.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-14">
        <Heading label="Traditions" title={h.traditions.title} />
        <div className="mt-4 space-y-4 leading-relaxed text-ink/80">
          {h.traditions.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-14">
        <Heading label="Sport" title={h.sport.title} />
        <div className="mt-4 grid items-start gap-6 md:grid-cols-[auto_1fr]">
          <div className="rounded-lg bg-brand-dark p-6 text-center text-white">
            <p className="font-display text-5xl font-bold text-gold">{h.sport.stat}</p>
            <p className="mt-1 max-w-[11rem] text-sm text-white/80">{h.sport.statLabel}</p>
          </div>
          <div className="space-y-4 leading-relaxed text-ink/80">
            {h.sport.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="mt-6 max-w-md"><Figure img={h.sport.image} /></div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-14">
        <Heading label="Renewal" title={h.renewal.title} />
        <div className="mt-4 space-y-4 leading-relaxed text-ink/80">
          {h.renewal.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <h3 className="font-display text-xl font-bold text-brand">Explore more of Mwiri</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/prominent-mwirians" className="rounded-md bg-gold px-5 py-2.5 font-semibold text-brand-dark hover:brightness-110">Prominent Mwirians</Link>
            <Link to="/gallery" className="rounded-md border border-brand/25 px-5 py-2.5 font-semibold text-brand hover:bg-gold/20">Photo gallery</Link>
            <Link to="/archives" className="rounded-md border border-brand/25 px-5 py-2.5 font-semibold text-brand hover:bg-gold/20">Archives</Link>
          </div>
        </div>
        {h.sources && <p className="mt-6 pb-12 text-xs text-ink/50">Sources: {h.sources}</p>}
      </section>
    </>
  )
}
