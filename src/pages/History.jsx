import PageHeader from '../components/PageHeader.jsx'
import { timeline } from '../data/content.js'

export default function History() {
  return (
    <>
      <PageHeader title="Our History" subtitle="The milestones that made MOBA what it is today." />
      <section className="max-w-3xl mx-auto px-4 mt-12">
        <ol className="relative border-l-2 border-brand/30 ml-3">
          {timeline.map(t => (
            <li key={t.year} className="mb-10 ml-6">
              <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-gold border-2 border-white" />
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
