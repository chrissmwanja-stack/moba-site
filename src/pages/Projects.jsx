import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { ugx } from '../lib/format.js'
import { campusGallery, projectSpotlights } from '../data/projectSpotlights.js'

export default function Projects() {
  const { projects } = useContent()
  const spotlightByTitle = new Map(projectSpotlights.map(spotlight => [normalize(spotlight.projectTitle), spotlight]))
  const listedTitles = new Set(projects.map(project => normalize(project.title)))
  const cards = [
    ...projects.map(project => ({ ...project, spotlight: spotlightByTitle.get(normalize(project.title)) })),
    // Include image-led spotlights that do not yet have a project record, without inventing year or status.
    ...projectSpotlights
      .filter(spotlight => !listedTitles.has(normalize(spotlight.projectTitle)))
      .map(spotlight => ({
        title: spotlight.projectTitle,
        summary: spotlight.description,
        status: spotlight.tag,
        year: null,
        spotlightOnly: true,
        spotlight,
      })),
  ]

  return (
    <>
      <PageHeader title="Projects" subtitle="Explore MOBA projects and work. Open a spotlighted project to see its story and images." />

      <section className="mx-auto mt-10 max-w-6xl px-4 lg:mt-12" aria-labelledby="projects-list-heading">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">Projects &amp; work</p>
          <h2 id="projects-list-heading" className="mt-1 font-display text-3xl font-bold text-brand">Explore our projects</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink/70">Spotlight pages are available for selected projects; more can be added as their stories and images are ready.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(project => <ProjectCard key={project.title} project={project} />)}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 pb-14" aria-labelledby="mwiri-today-heading">
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
              <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" className="aspect-4/3 w-full object-cover" />
              <figcaption className="px-3 py-2 text-sm font-medium text-brand">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

function ProjectCard({ project }) {
  const spotlight = project.spotlight
  const cover = spotlight?.images?.[0]
  const imageSrc = project.image || cover?.src
  const content = (
    <>
      <div className="relative flex aspect-2/1 items-center justify-center overflow-hidden bg-linear-to-br from-brand/10 to-gold/25">
        {imageSrc
          ? <img src={imageSrc} alt={cover?.alt || project.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
          : <img src="/moba-shield.webp" alt="" className="h-20 w-auto opacity-80" />}
        {cover?.concept && (
          <span className="absolute left-3 top-3 rounded-sm bg-gold px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-dark">
            {cover.badge || "Artist's impression"}
          </span>
        )}
      </div>
      <div className="p-5 md:p-6">
        <div className="flex justify-between gap-3 text-xs">
          {project.year != null ? <span className="font-semibold text-gold-dark">{project.year}</span> : <span />}
          <span className="text-right text-ink/70">{project.status}</span>
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-brand">{project.title}</h3>
        <p className="mt-2 text-sm text-ink/70">{project.summary}</p>
        {project.progress != null && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-ink/70"><span>Progress</span><span>{project.progress}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-brand/15" role="progressbar" aria-label={`${project.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={project.progress}>
              <div className="h-2 rounded-full bg-gold" style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} />
            </div>
          </div>
        )}
        {project.goal != null && (
          <p className="mt-3 text-sm text-ink/80">
            {project.raised != null ? <>Raised <strong>{ugx(project.raised)}</strong> of </> : <>Funding needed: </>}
            <strong>{ugx(project.goal)}</strong>
          </p>
        )}
        {spotlight && <span className="mt-4 inline-flex font-semibold text-brand underline underline-offset-2">View project spotlight →</span>}
      </div>
    </>
  )

  return (
    <article className="overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {spotlight
        ? <Link to={`/projects/${spotlight.id}`} className="group block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">{content}</Link>
        : <div>{content}</div>}
      {project.status === 'Ongoing' && !project.spotlightOnly && (
        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <Link to={`/donate?project=${encodeURIComponent(project.title)}`} className="text-sm font-semibold text-brand underline hover:text-brand-dark">
            Support this project →
          </Link>
        </div>
      )}
    </article>
  )
}

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase()
}
