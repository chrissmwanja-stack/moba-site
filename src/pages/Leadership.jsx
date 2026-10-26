import { useId, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { site, leaders, leadersTerm } from '../data/content.js'

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')

// A cohort is named by the year its class started S1; S6 is schoolYears - 1 years later.
function cohortText(l) {
  if (!l.cohortName) return l.cohort
  const start = Number(l.cohort)
  return `${l.cohortName} (${start}–${start + site.schoolYears - 1})`
}

function houseText(l) {
  if (!l.houses?.length) return null
  return `${l.houses.length > 1 ? 'Houses' : 'House'}: ${l.houses.join(' and ')}`
}

function LeaderCard({ l }) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()
  const hasBio = Array.isArray(l.bio) && l.bio.length > 0
  const house = houseText(l)

  return (
    <article className="bg-white rounded-lg shadow p-6 text-center">
      {l.photo
        ? <img src={l.photo} alt={l.name} className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-gold" />
        : <div className="w-28 h-28 rounded-full mx-auto bg-brand text-gold text-3xl font-bold flex items-center justify-center border-4 border-gold">{initials(l.name)}</div>}
      <h3 className="font-semibold text-lg mt-4">{l.name}</h3>
      <p className="text-gold-dark font-medium">{l.role}</p>
      <p className="text-sm text-ink/70">Cohort: {cohortText(l)}</p>
      {house && <p className="text-sm text-ink/70">{house}</p>}

      {hasBio && (
        <div className="mt-4 pt-4 border-t border-brand/10 text-left">
          <div id={bodyId} className="text-sm text-ink/80 leading-relaxed space-y-3">
            <p className={open ? '' : 'line-clamp-4'}>{l.bio[0]}</p>
            {open && l.bio.slice(1).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls={bodyId}
            className="mt-3 text-sm font-medium text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {open ? 'Show less' : 'Read full profile'}
          </button>
        </div>
      )}
    </article>
  )
}

export default function Leadership() {
  return (
    <>
      <PageHeader title="Our Leadership" subtitle={`The executive committee serving MOBA ${leadersTerm}.`} />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {leaders.map(l => <LeaderCard key={l.name} l={l} />)}
      </section>
    </>
  )
}