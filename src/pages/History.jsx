import PhotoBand from '../components/PhotoBand.jsx'
import { timeline } from '../data/content.js'

export default function History() {
  return (
    <>
      <PhotoBand>
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl font-bold">Our History</h1>
          <p className="mt-2 text-white/80 max-w-2xl">The milestones that made MOBA what it is today.</p>
        </div>
      </PhotoBand>
      <section className="max-w-3xl mx-auto px-4 mt-12">
        <ol className="relative border-l-2 border-brand/30 ml-3">
          {timeline.map(t => (
            <li key={t.year} className="mb-10 ml-6">
              <span className="absolute -left-2.25 w-4 h-4 rounded-full bg-gold border-2 border-white" />
              <p className="text-sm font-semibold text-brand">{t.year}</p>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-ink/70 mt-1">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
