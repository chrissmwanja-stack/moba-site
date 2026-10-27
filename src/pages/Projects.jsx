import PageHeader from '../components/PageHeader.jsx'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/siteContent.js'
import { ugx } from '../lib/format.js'

export default function Projects() {
  const { projects } = useContent()
  return (
    <>
      <PageHeader title="Projects" subtitle="What we have built and supported over the years." />
      <section className="mx-auto mt-10 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {projects.map(p => (
          <article key={p.title} className="overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[2/1] overflow-hidden bg-gradient-to-br from-brand/10 to-gold/25 flex items-center justify-center">
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
              <p className="text-sm text-ink/70 mt-2">{p.summary}</p>
              {p.progress != null && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-ink/70">
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
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
      </section>
    </>
  )
}
