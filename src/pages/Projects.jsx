import PageHeader from '../components/PageHeader.jsx'
import { projects } from '../data/content.js'

export default function Projects() {
  return (
    <>
      <PageHeader title="Projects" subtitle="What we have built and supported over the years." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <article key={p.title} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-brand/25 to-gold/40 flex items-center justify-center">
              {p.image
                ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                : <img src="/moba-shield.webp" alt="" className="h-20 w-auto opacity-80" />}
            </div>
            <div className="p-5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gold-dark">{p.year}</span>
                <span className="text-ink/50">{p.status}</span>
              </div>
              <h3 className="font-semibold text-lg mt-1">{p.title}</h3>
              <p className="text-sm text-ink/70 mt-2">{p.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
