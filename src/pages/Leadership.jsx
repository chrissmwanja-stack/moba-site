import PageHeader from '../components/PageHeader.jsx'
import { leaders } from '../data/content.js'

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')

export default function Leadership() {
  return (
    <>
      <PageHeader title="Our Leadership" subtitle="The executive committee serving MOBA." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leaders.map((l, i) => (
          <article key={i} className="bg-white rounded-lg shadow p-6 text-center">
            {l.photo
              ? <img src={l.photo} alt={l.name} className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-gold" />
              : <div className="w-28 h-28 rounded-full mx-auto bg-brand text-gold text-3xl font-bold flex items-center justify-center border-4 border-gold">{initials(l.name)}</div>}
            <h3 className="font-semibold text-lg mt-4">{l.name}</h3>
            <p className="text-gold-dark font-medium">{l.role}</p>
            <p className="text-sm text-ink/70">Cohort: {l.cohort}</p>
          </article>
        ))}
      </section>
    </>
  )
}
