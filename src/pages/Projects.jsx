import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { ugx } from '../lib/format.js'
import { campusGallery, projectSpotlights } from '../data/projectSpotlights.js'

export default function Projects() {
  const { projects } = useContent()
  const spotlightTitles = new Set(projectSpotlights.map(s => s.projectTitle))
  const otherProjects = projects.filter(p => !spotlightTitles.has(p.title))

  return (
    <>
      <PageHeader title="Projects" subtitle="Ideas, investment and impact for Mwiri and the brotherhood." />

      <section className="mx-auto mt-10 max-w-6xl space-y-8 px-4 lg:mt-12" aria-labelledby="spotlights-heading">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">A closer look</p>
          <h2 id="spotlights-heading" className="mt-1 font-display text-3xl font-bold text-brand">Project spotlights</h2>
          <p className="mt-2 max-w-3xl text-ink/70">Explore the designs, places and people behind selected MOBA projects.</p>
        </div>
        {projectSpotlights.map(spotlight => (
          <ProjectSpotlight key={spotlight.id} spotlight={spotlight} projects={projects} />
        ))}
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4" aria-labelledby="mwiri-today-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">The Hill today</p>
            <h2 id="mwiri-today-heading" className="mt-1 font-display text-3xl font-bold text-brand">Mwiri today</h2>
            <p className="mt-2 text-ink/70">A few views of the campus, its buildings and grounds.</p>
          </div>
          <Link to="/gallery" className="font-semibold text-brand underline hover:text-brand-dark">Browse the photo gallery →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {campusGallery.slice(0, 8).map(photo => (
            <figure key={photo.src} className="overflow-hidden rounded-md bg-brand/5">
              <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-3 py-2 text-sm font-medium text-brand">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 pb-14" aria-labelledby="other-projects-heading">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">More from MOBA</p>
          <h2 id="other-projects-heading" className="mt-1 font-display text-3xl font-bold text-brand">Other projects and work</h2>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map(p => (
            <article key={p.title} className="overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex aspect-[2/1] items-center justify-center bg-gradient-to-br from-brand/10 to-gold/25">
                {p.image
                  ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                  : <img src="/moba-shield.webp" alt="" className="h-20 w-auto opacity-80" />}
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gold-dark">{p.year}</span>
                  <span className="text-ink/70">{p.status}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-brand">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.summary}</p>
                {p.progress != null && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-ink/70"><span>Progress</span><span>{p.progress}%</span></div>
                    <div className="mt-1 h-2 rounded-full bg-brand/15" role="progressbar" aria-label={`${p.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.progress}>
                      <div className="h-2 rounded-full bg-gold" style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }} />
                    </div>
                  </div>
                )}
                {p.goal != null && (
                  <p className="mt-3 text-sm text-ink/80">
                    {p.raised != null ? <>Raised <strong>{ugx(p.raised)}</strong> of </> : <>Funding needed: </>}
                    <strong>{ugx(p.goal)}</strong>
                  </p>
                )}
                {p.status === 'Ongoing' && (
                  <Link to={`/donate?project=${encodeURIComponent(p.title)}`} className="mt-4 inline-block text-sm font-semibold text-brand underline hover:text-brand-dark">
                    Support this project →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function ProjectSpotlight({ spotlight, projects }) {
  const [selected, setSelected] = useState(0)
  const image = spotlight.images[selected]
  const hasDonationOption = spotlight.supportProject && projects.some(p => p.title === spotlight.supportProject && p.status === 'Ongoing')

  return (
    <article id={spotlight.id} className="overflow-hidden rounded-lg border-b-4 border-gold bg-brand p-4 text-white shadow-md sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(16rem,0.75fr)] lg:gap-8">
        <div className="relative overflow-hidden rounded-md bg-black/15">
          <img src={image.src} alt={image.alt} className={`aspect-[16/9] w-full ${image.fit === 'contain' ? 'bg-white object-contain p-2' : 'object-cover'}`} loading="lazy" decoding="async" />
          {(image.concept || spotlight.tag === "Artist's impressions" || spotlight.tag === 'Concept design') && (
            <span className="absolute left-3 top-3 rounded-sm bg-gold px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-brand-dark">
              {image.badge || (image.concept ? "Artist's impression" : spotlight.tag)}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{spotlight.eyebrow}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/65">{spotlight.tag}</p>
          <h3 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{spotlight.title}</h3>
          <span className="mt-4 h-1 w-12 bg-gold" aria-hidden="true" />
          <p className="mt-4 text-sm leading-7 text-white/85">{spotlight.description}</p>
          {hasDonationOption && (
            <Link to={`/donate?project=${encodeURIComponent(spotlight.supportProject)}`} className="mt-5 inline-flex w-fit rounded-md bg-gold px-5 py-3 text-sm font-bold text-brand-dark hover:brightness-110">
              Support this project
            </Link>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-white/70" aria-live="polite">{image.caption}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {spotlight.images.map((photo, i) => (
          <button key={photo.src} type="button" onClick={() => setSelected(i)} aria-pressed={selected === i} aria-label={`Show image: ${photo.caption}`}
            className={`overflow-hidden rounded-md border-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${selected === i ? 'border-gold' : 'border-transparent hover:border-white/60'}`}>
            <img src={photo.src} alt="" loading="lazy" decoding="async" className={`aspect-[16/9] w-full ${photo.fit === 'contain' ? 'bg-white object-contain p-1' : 'object-cover'}`} />
            <span className="block min-h-12 bg-white px-2 py-2 text-xs font-medium leading-4 text-brand">{photo.caption}</span>
          </button>
        ))}
      </div>
    </article>
  )
}
