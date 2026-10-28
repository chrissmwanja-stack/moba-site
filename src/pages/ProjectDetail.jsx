import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { projectSpotlights } from '../data/projectSpotlights.js'
import NotFound from './NotFound.jsx'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { projects } = useContent()
  const [selected, setSelected] = useState(0)
  const spotlight = projectSpotlights.find(item => item.id === slug)

  useEffect(() => setSelected(0), [slug])

  if (!spotlight) return <NotFound />
  const image = spotlight.images[selected] || spotlight.images[0]
  const hasDonationOption = spotlight.supportProject && projects.some(project => project.title === spotlight.supportProject && project.status === 'Ongoing')
  const badge = image.badge || (image.concept ? "Artist's impression" : null)

  return (
    <>
      <PageHeader title={spotlight.title} subtitle={spotlight.description} />
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-14">
        <Link to="/projects" className="inline-flex rounded-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          ← All projects and work
        </Link>

        <article className="mt-5 overflow-hidden rounded-lg border-b-4 border-gold bg-brand p-4 text-white shadow-md sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)] lg:gap-8">
            <figure className="min-w-0">
              <div className="relative overflow-hidden rounded-md bg-black/15">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  decoding="async"
                  className={`aspect-[16/9] w-full ${image.fit === 'contain' ? 'bg-white object-contain p-2' : 'object-cover'}`}
                />
                {badge && (
                  <span className="absolute left-3 top-3 rounded-sm bg-gold px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-brand-dark">
                    {badge}
                  </span>
                )}
              </div>
              <figcaption className="mt-3 text-sm text-white/75" aria-live="polite">{image.caption}</figcaption>
            </figure>

            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{spotlight.eyebrow}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/65">{spotlight.tag}</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight">Image gallery</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">{selected + 1} of {spotlight.images.length} views</p>
              {hasDonationOption && (
                <Link to={`/donate?project=${encodeURIComponent(spotlight.supportProject)}`} className="mt-5 inline-flex w-fit rounded-md bg-gold px-5 py-3 text-sm font-bold text-brand-dark hover:brightness-110">
                  Support this project
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label="Choose a project image">
            {spotlight.images.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                aria-label={`Show image: ${photo.caption}`}
                className={`overflow-hidden rounded-md border-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${selected === index ? 'border-gold' : 'border-transparent hover:border-white/60'}`}
              >
                <img
                  src={photo.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`aspect-[16/9] w-full ${photo.fit === 'contain' ? 'bg-white object-contain p-1' : 'object-cover'}`}
                />
                <span className="block min-h-12 bg-white px-2 py-2 text-xs font-medium leading-4 text-brand">{photo.caption}</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
