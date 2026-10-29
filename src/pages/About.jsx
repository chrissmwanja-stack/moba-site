import { Link } from 'react-router-dom'
import PhotoHero from '../components/PhotoHero.jsx'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'
import { safeUrl } from '../lib/safeUrl.js'

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const countWord = n => NUMBER_WORDS[n] || String(n)

// Section links shown under the hero. Each id matches a section further down.
const SECTION_LINKS = [
  ['who-we-are', 'Who we are'],
  ['purpose', 'Purpose & vision'],
  ['pillars', 'Our pillars'],
  ['priorities', 'Priorities 2026 to 2028'],
  ['leadership', 'Leadership'],
  ['committees', 'Committees'],
]

const iconProps = { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const FOUNDATION_ICONS = {
  purpose: (cls) => (
    <svg {...iconProps} width="36" height="36" className={cls}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>
  ),
  vision: (cls) => (
    <svg {...iconProps} width="36" height="36" className={cls}><circle cx="6.5" cy="15" r="3.5" /><circle cx="17.5" cy="15" r="3.5" /><path d="M10 15h4" /><path d="M4 12l2-7h3l1 5" /><path d="M20 12l-2-7h-3l-1 5" /></svg>
  ),
  mission: (cls) => (
    <svg {...iconProps} width="36" height="36" className={cls}><circle cx="12" cy="12" r="3" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /><path d="M4.9 4.9l2.1 2.1" /><path d="M17 17l2.1 2.1" /><path d="M4.9 19.1L7 17" /><path d="M17 7l2.1-2.1" /></svg>
  ),
  promise: (cls) => (
    <svg {...iconProps} width="36" height="36" className={cls}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
  ),
}

const PILLAR_ICONS = [
  <svg key="brotherhood" {...iconProps} width="30" height="30"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M15 14.2c.6-.2 1.3-.2 2-.2 2.8 0 5 2.2 5 5" /></svg>,
  <svg key="heritage" {...iconProps} width="30" height="30"><path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z" /><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z" /></svg>,
  <svg key="service" {...iconProps} width="30" height="30"><path d="M12 10.5s-3.5-2.2-3.5-4.6A2 2 0 0 1 12 4.7a2 2 0 0 1 3.5 1.2c0 2.4-3.5 4.6-3.5 4.6z" /><path d="M2 15h3l4 3h6a2 2 0 0 0 0-4h-4" /><path d="M5 15l3-2h3" /><path d="M15 16l5-3a1.5 1.5 0 0 1 2 2l-6 5H2" /></svg>,
  <svg key="progress" {...iconProps} width="30" height="30"><path d="M4 20v-5" /><path d="M9 20v-8" /><path d="M14 20v-6" /><path d="M19 20V9" /><path d="M4 10l5-4 4 3 7-6" /><path d="M16 3h4v4" /></svg>,
]

function cohortText(l) {
  if (!l.cohortName) return l.cohort ? `Cohort: ${l.cohort}` : null
  const start = Number(l.cohort)
  return Number.isFinite(start) && start > 0 ? `${l.cohortName}, ${start} to ${start + site.schoolYears - 1}` : l.cohortName
}

function Eyebrow({ children, light = false }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.28em] ${light ? 'text-gold' : 'text-brand/65'}`}>{children}</p>
}

function SectionHeading({ id, eyebrow, children, light = false }) {
  return (
    <div>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={`mt-3 font-display text-3xl font-bold leading-tight md:text-4xl ${light ? 'text-white' : 'text-brand'}`}>{children}</h2>
      <div className="mt-5 h-0.75 w-14 bg-gold" aria-hidden="true" />
    </div>
  )
}

export default function About() {
  const { leaders, about, stats, leadersTerm } = useContent()
  const { motto, governance } = about
  const foundation = [
    ['purpose', 'Our purpose', about.purpose, 'bg-brand-dark text-white', 'text-gold', 'bg-gold', 'text-white'],
    ['vision', 'Our vision', about.vision, 'bg-gold text-brand-dark', 'text-brand', 'bg-brand', 'text-brand-dark'],
    ['mission', 'Our mission', about.mission, 'bg-[#f5e6c4] text-brand-dark', 'text-brand', 'bg-gold', 'text-brand-dark'],
    ['promise', 'Our promise', about.promise, 'bg-white text-brand-dark', 'text-brand', 'bg-gold', 'text-brand-dark'],
  ].filter(([, , text]) => text)

  return (
    <>
      <PhotoHero
        crumb="About MOBA"
        eyebrow="About MOBA"
        title={<>A lifelong <span className="text-gold">Mwirian brotherhood</span></>}
        image="/about-hero.webp"
        imageSmall="/about-hero-640.webp"
        position="50% 50%"
      />

      {/* Jump links to the sections below */}
      <nav aria-label="On this page" className="border-b border-brand/10 bg-white">
        <ul className="mx-auto flex max-w-6xl gap-x-8 gap-y-1 overflow-x-auto px-4 text-sm font-semibold text-brand">
          {SECTION_LINKS.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="block py-4 hover:text-gold-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Who we are */}
      <section aria-labelledby="who-we-are" className="mx-auto mt-14 grid max-w-6xl scroll-mt-20 items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading id="who-we-are" eyebrow="Who we are">Our connection to Mwiri does not end when we leave the Hill</SectionHeading>
          <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-ink/80">
            {about.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <img
          src="/about-story.webp"
          srcSet="/about-story-640.webp 640w, /about-story.webp 1080w"
          sizes="(min-width: 1024px) 560px, 100vw"
          alt="Students in white and blue uniform standing under a large tree in front of a Busoga College Mwiri building"
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full rounded-md border-b-4 border-gold object-cover shadow-md"
        />
      </section>

      {stats?.length > 0 && (
        <section aria-label="MOBA in numbers" className="mx-auto mt-10 grid max-w-6xl grid-cols-3 gap-4 px-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-md border-t border-brand/10 bg-white p-4 text-center shadow-sm">
              <p className="font-display text-3xl font-bold text-brand">{s.value}</p>
              <p className="mt-1 text-xs text-ink/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Purpose, vision, mission and promise */}
      <section aria-labelledby="purpose" className="mt-16 scroll-mt-20 bg-[#f6f7f9] py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading id="purpose" eyebrow="Our foundation">Why we exist and where we are headed</SectionHeading>
          <div className="mt-8 grid overflow-hidden rounded-md border border-brand/10 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {foundation.map(([key, title, text, panel, icon, rule, body]) => (
              <article key={key} className={`p-7 ${panel}`}>
                {FOUNDATION_ICONS[key](icon)}
                <div className={`mt-4 h-0.5 w-10 ${rule}`} aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
                <p className={`mt-3 leading-relaxed ${body} opacity-90`}>{text}</p>
              </article>
            ))}
          </div>
          <blockquote className="mt-8 max-w-3xl border-l-4 border-gold pl-5 font-display text-lg italic leading-relaxed text-brand md:text-xl">
            Being Mwirian is a lifelong connection. MOBA seeks to make that connection meaningful by creating opportunities for every generation to belong, participate, contribute and benefit from the strength of the wider Mwirian community.
          </blockquote>
        </div>
      </section>

      {/* Pillars and motto */}
      <section aria-labelledby="pillars" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4">
        <SectionHeading id="pillars" eyebrow="MOBA’s pillars">Four things that hold us together</SectionHeading>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => {
            const dark = i % 2 === 0
            return (
              <article key={v.title}>
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${dark ? 'bg-brand text-gold' : 'bg-gold text-brand'}`}>
                  <span className="[&>svg]:stroke-current">{PILLAR_ICONS[i % PILLAR_ICONS.length]}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-brand">{v.title}</h3>
                {v.tagline && <p className="mt-1 font-display italic text-brand/70">{v.tagline}</p>}
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{v.text}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 rounded-md border-t border-brand/10 bg-white p-8 text-center shadow-sm sm:flex-row sm:text-left">
          <img src="/moba-shield.webp" alt="" className="h-20 w-auto shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">Our motto</p>
            <p className="mt-1 text-2xl font-bold text-brand">{motto.lusoga}</p>
            <p className="text-lg text-ink/80">{motto.english}</p>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">{motto.note}</p>
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section aria-labelledby="priorities" className="relative isolate mt-16 scroll-mt-20 overflow-hidden bg-brand py-16 text-white">
        <span aria-hidden="true" className="pointer-events-none absolute -top-6 right-0 -z-10 select-none font-display text-[9rem] font-bold leading-none text-white/[0.06] md:text-[16rem]">{site.founded}</span>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading id="priorities" eyebrow="Our priorities for 2026 to 2028" light>Reclaiming Mwiri’s greatness</SectionHeading>
          <p className="mt-5 max-w-2xl text-white/85">
            The 2026 to 2028 Executive is focused on reclaiming Mwiri’s greatness through {countWord(about.priorities.length).toLowerCase()} priorities. These connect our enduring purpose with practical action for members and the school.
          </p>
          <div className="mt-10 grid border-l border-t border-white/20 md:grid-cols-2 lg:grid-cols-3">
            {about.priorities.map((p, i) => (
              <article key={p.title} className="flex gap-5 border-b border-r border-white/20 p-6 md:p-7">
                <p className="font-display text-4xl font-bold leading-none text-gold">{String(i + 1).padStart(2, '0')}</p>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">{p.text}</p>
                  {safeUrl(p.link) && <Link to={safeUrl(p.link)} className="mt-4 text-sm font-semibold text-gold hover:underline">{p.linkLabel} →</Link>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="leadership" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="leadership" eyebrow="Our leadership">Executive Committee {(leadersTerm || '2026–2028').replace('–', ' to ')}</SectionHeading>
          <Link to="/leadership" className="font-medium text-brand hover:underline">Read the full profiles →</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {leaders.map(l => (
            <li key={l.name}>
              <Link to="/leadership" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <div className="aspect-[4/5] overflow-hidden border-b-4 border-gold bg-brand">
                  {l.photo
                    ? <img src={l.photo} alt="" loading="lazy" decoding="async" style={{ objectPosition: l.focus || '50% 20%' }} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
                        <img src="/moba-shield.webp" alt="" className="h-16 w-auto" />
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Portrait to come</span>
                      </div>
                    )}
                </div>
                <h3 className="mt-3 font-semibold text-brand group-hover:underline">{l.name}</h3>
                <p className="text-sm font-medium text-gold-dark">{l.role}</p>
                {cohortText(l) && <p className="text-xs text-ink/65">{cohortText(l)}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Committees */}
      <section aria-labelledby="committees" className="mt-16 scroll-mt-20 bg-[#f6f7f9] py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading id="committees" eyebrow="Our committees">{countWord(about.committees.length)} committees, one association</SectionHeading>
          <p className="mt-5 max-w-2xl text-ink/75">
            MOBA’s work is supported by {countWord(about.committees.length).toLowerCase()} committees, each with a mandate to strengthen the association, serve its members and contribute to the continued development of Mwiri.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {about.committees.map((c, i) => (
              <article key={c.name} className="flex gap-4 rounded-md border-t-4 border-brand bg-white p-5 shadow-sm">
                <p className="font-display text-2xl font-bold leading-none text-gold-dark">{i + 1}</p>
                <div>
                  <h3 className="font-semibold text-brand">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{c.text}</p>
                  {c.chair && <p className="mt-3 text-xs text-ink/60">Chair: {c.chair}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we are organised + governance */}
      <section className="mx-auto mt-14 grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        <article className="rounded-md bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brand">Branches and cohorts</h3>
          <p className="mt-2 text-sm text-ink/70">Local branches in Uganda and abroad, and a cohort for every class since the school began.</p>
          <Link to="/cohorts" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">Find your branch or cohort →</Link>
        </article>
        <article className="rounded-md bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brand">How we are run</h3>
          <p className="mt-2 text-sm text-ink/70">{governance.text}</p>
          {safeUrl(governance.constitutionUrl)
            ? <a href={safeUrl(governance.constitutionUrl)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">{governance.constitutionLabel} →</a>
            : <p className="mt-4 text-xs text-ink/60">The constitution will be published here soon.</p>}
        </article>
      </section>

      {/* Get involved */}
      <section className="mx-auto mb-14 mt-14 max-w-6xl px-4">
        <div className="rounded-md border-b-4 border-gold bg-brand-dark p-8 text-center text-white shadow-sm md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Be part of the brotherhood</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">Stay connected to fellow Mwirians, share your expertise and help shape what comes next. Join MOBA, take part in our activities or support a project that matters to you.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/membership" className="rounded-md bg-gold px-6 py-3 font-semibold text-brand-dark hover:brightness-110">Join MOBA</Link>
            <Link to="/projects" className="rounded-md border border-white/40 px-6 py-3 hover:bg-white/10">Support a project</Link>
            <Link to="/contact" className="rounded-md border border-white/40 px-6 py-3 hover:bg-white/10">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
