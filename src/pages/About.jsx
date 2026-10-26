import { Link } from 'react-router-dom'
import PhotoBand from '../components/PhotoBand.jsx'
import { site, stats, about, leaders } from '../data/content.js'

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')

function SectionHeading({ children, id }) {
  return <h2 id={id} className="text-2xl font-bold text-brand">{children}</h2>
}

export default function About() {
  // The first two entries in `leaders` are the President and Vice President
  const topLeaders = leaders.slice(0, 2)
  const { motto, governance } = about

  return (
    <>
      <PhotoBand>
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold">Est. {site.founded}</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">About MOBA</h1>
          <p className="mt-2 text-white/80 max-w-2xl">{site.fullName}: our purpose, our priorities and the people who lead us.</p>
        </div>
      </PhotoBand>

      {/* Who we are + quick numbers */}
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading>Who we are</SectionHeading>
          <div className="mt-3 space-y-4 text-ink/80 leading-relaxed max-w-3xl">
            {about.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 self-start">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-gold">
              <p className="text-2xl font-bold text-brand">{s.value}</p>
              <p className="text-xs sm:text-sm text-ink/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Purpose, vision, mission and promise */}
      <section className="max-w-6xl mx-auto px-4 mt-14" aria-label="Purpose, vision, mission and promise">
        <div className="grid gap-6 md:grid-cols-2">
          {[['Our purpose', about.purpose], ['Our vision', about.vision], ['Our mission', about.mission], ['Our promise', about.promise]]
            .filter(([, text]) => text)
            .map(([title, text]) => (
              <article key={title} className="bg-brand-dark text-white rounded-lg shadow p-6 border-l-4 border-gold">
                <h3 className="text-gold font-semibold uppercase tracking-widest text-sm">{title}</h3>
                <p className="mt-3 leading-relaxed">{text}</p>
              </article>
            ))}
        </div>
      </section>

      {/* Priorities */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <SectionHeading>Our priorities</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          {about.priorities.map((p, i) => (
            <article key={p.title} className="bg-white rounded-lg shadow p-6 flex flex-col">
              <p className="text-xs font-semibold text-gold-dark">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-semibold text-lg mt-1">{p.title}</h3>
              <p className="text-sm text-ink/70 mt-2 flex-1">{p.text}</p>
              {p.link && <Link to={p.link} className="text-brand font-medium text-sm mt-4 hover:underline">{p.linkLabel} →</Link>}
            </article>
          ))}
        </div>
      </section>

      {/* Motto and values */}
      <section className="max-w-6xl mx-auto px-4 mt-14 grid gap-10 lg:grid-cols-2 items-start">
        <div className="bg-white rounded-lg shadow p-8 text-center border-t-4 border-gold">
          <img src="/moba-shield.webp" alt="" className="h-20 w-auto mx-auto" />
          <p className="text-xs uppercase tracking-widest font-semibold text-gold-dark mt-4">Our motto</p>
          <p className="text-2xl font-bold text-brand mt-2">{motto.lusoga}</p>
          <p className="text-lg text-ink/80 mt-1">{motto.english}</p>
          <p className="text-sm text-ink/70 mt-4 max-w-md mx-auto">{motto.note}</p>
        </div>
        <div>
          <SectionHeading>What we stand for</SectionHeading>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {about.values.map(v => (
              <div key={v.title} className="border-l-4 border-gold pl-4">
                <dt className="font-semibold text-brand">{v.title}{v.tagline && <span className="block text-xs font-semibold text-gold-dark">{v.tagline}</span>}</dt>
                <dd className="text-sm text-ink/70 mt-1">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Leadership preview */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="flex items-end justify-between">
          <SectionHeading>Leadership</SectionHeading>
          <Link to="/leadership" className="text-brand font-medium hover:underline">Full executive committee →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mt-6">
          {topLeaders.map(l => (
            <article key={l.name} className="bg-white rounded-lg shadow p-6 flex items-center gap-5">
              {l.photo
                ? <img src={l.photo} alt={l.name} className="w-20 h-20 shrink-0 rounded-full object-cover border-4 border-gold" />
                : <div className="w-20 h-20 shrink-0 rounded-full bg-brand text-gold text-2xl font-bold flex items-center justify-center border-4 border-gold">{initials(l.name)}</div>}
              <div>
                <h3 className="font-semibold">{l.name}</h3>
                <p className="text-gold-dark font-medium text-sm">{l.role}</p>
                <p className="text-xs text-ink/70">Cohort: {l.cohort}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Committees */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <SectionHeading>Committees</SectionHeading>
        <p className="mt-2 text-ink/70 max-w-2xl">The executive is supported by committees that carry the association’s work between meetings.</p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {about.committees.map(c => (
            <article key={c.name} className="bg-white rounded-lg shadow p-5 border-t-4 border-brand">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-ink/70 mt-2">{c.text}</p>
              {c.chair && <p className="text-xs text-ink/60 mt-3">Chair: {c.chair}</p>}
            </article>
          ))}
        </div>
      </section>

      {/* How we are organised + governance */}
      <section className="max-w-6xl mx-auto px-4 mt-14 grid gap-6 md:grid-cols-2">
        <article className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg text-brand">Branches and cohorts</h3>
          <p className="text-sm text-ink/70 mt-2">Local branches in Uganda and abroad, and a cohort for every class since the school began.</p>
          <Link to="/cohorts" className="text-brand font-medium text-sm mt-4 inline-block hover:underline">Find your branch or cohort →</Link>
        </article>
        <article className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg text-brand">How we are run</h3>
          <p className="text-sm text-ink/70 mt-2">{governance.text}</p>
          {governance.constitutionUrl
            ? <a href={governance.constitutionUrl} target="_blank" rel="noreferrer" className="text-brand font-medium text-sm mt-4 inline-block hover:underline">{governance.constitutionLabel} →</a>
            : <p className="text-xs text-ink/60 mt-4">The constitution will be published here soon.</p>}
        </article>
      </section>

      {/* Get involved */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="bg-brand-dark text-white rounded-lg shadow p-8 md:p-10 border-b-4 border-gold text-center">
          <h2 className="text-2xl font-bold">Be part of it</h2>
          <p className="mt-2 text-white/80 max-w-xl mx-auto">Join the association, support a project, or just get in touch. Every Old Boy has a place here.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/membership" className="bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">Become a member</Link>
            <Link to="/projects" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">Support a project</Link>
            <Link to="/contact" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
