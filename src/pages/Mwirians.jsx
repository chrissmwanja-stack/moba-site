import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { site, mwirianFields } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

const chip =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand '

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')

// A cohort is named by the year its class started S1; S6 is schoolYears - 1 years later.
function cohortText(p) {
  if (!p.cohort) return null
  if (!p.cohortName) return `Cohort ${p.cohort}`
  const start = Number(p.cohort)
  return `${p.cohortName} (${start}–${start + site.schoolYears - 1})`
}

function Portrait({ p }) {
  const cls = 'aspect-[4/5] w-full border-b-4 border-gold'
  return p.photo
    ? <img src={p.photo} alt="" loading="lazy" className={`${cls} object-cover object-top`} />
    : <div aria-hidden="true" className={`${cls} flex items-center justify-center bg-brand text-6xl font-bold text-gold`}>{initials(p.name)}</div>
}

function Card({ p }) {
  const cohort = cohortText(p)
  const houses = p.houses?.length ? `${p.houses.length > 1 ? 'Houses' : 'House'}: ${p.houses.join(' and ')}` : null
  const hasBio = Array.isArray(p.bio) && p.bio.length > 0
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
      <Portrait p={p} />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-brand">{p.deceased ? 'Late ' : ''}{p.name}</h3>
        <p className="mt-1 text-sm font-semibold text-gold-dark">{p.field}</p>
        <p className="mt-2 text-sm text-ink/80">{p.knownFor}</p>
        {(cohort || houses) && (
          <p className="mt-2 text-sm text-ink/70">{[cohort, houses].filter(Boolean).join(' · ')}</p>
        )}
        {hasBio && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              Read more<span className="sr-only"> about {p.name}</span>
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
              {p.bio.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </details>
        )}
      </div>
    </article>
  )
}

export default function Mwirians() {
  const { prominentMwirians } = useContent()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const requested = params.get('field')
  const field = mwirianFields.includes(requested) ? requested : 'All'
  const choose = f => (f === 'All' ? setParams({}) : setParams({ field: f }))

  const countOf = f => (f === 'All' ? prominentMwirians.length : prominentMwirians.filter(p => p.field === f).length)
  const offered = mwirianFields.filter(f => countOf(f) > 0)

  const q = query.trim().toLowerCase()
  const shown = useMemo(
    () =>
      prominentMwirians
        .filter(p => field === 'All' || p.field === field)
        .filter(p => !q || `${p.name} ${p.field} ${p.knownFor} ${p.cohortName || ''} ${p.cohort || ''}`.toLowerCase().includes(q))
        // Featured first, then earliest cohort first, then by name.
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || Number(a.cohort || 9999) - Number(b.cohort || 9999) || a.name.localeCompare(b.name)),
    [prominentMwirians, field, q],
  )

  return (
    <>
      <PageHeader
        title="Prominent Mwirians"
        subtitle="Old Boys whose service and achievements have made the hill proud."
      />

      {prominentMwirians.length === 0 ? (
        <section className="max-w-3xl mx-auto px-4 mt-12">
          <div className="rounded-md border border-brand/10 bg-white p-8 text-center">
            <img src="/moba-shield.webp" alt="" className="mx-auto h-16 w-auto" />
            <h2 className="mt-4 text-xl font-bold text-brand">We are compiling this roll of honour</h2>
            <p className="mt-2 text-ink/75">
              Mwiri has produced leaders in public service, law, medicine, business, sport, the arts and the church.
              Their profiles will appear here as they are confirmed.
            </p>
            <p className="mt-4">
              <Link to="/contact?topic=Nominate a prominent Mwirian" className="inline-block rounded-md bg-gold px-6 py-3 font-semibold text-brand-dark hover:brightness-110">
                Nominate a Mwirian
              </Link>
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="max-w-6xl mx-auto px-4 mt-10 space-y-4">
            <div role="group" aria-label="Filter by field" className="flex flex-wrap gap-2">
              {['All', ...offered].map(f => {
                const active = f === field
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => choose(f)}
                    aria-pressed={active}
                    className={chip + (active ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/25 hover:bg-gold/20')}
                  >
                    {f} <span className={active ? 'text-white/70' : 'text-ink/70'}>({countOf(f)})</span>
                  </button>
                )
              })}
            </div>
            <div>
              <label htmlFor="mwirian-search" className="sr-only">Search prominent Mwirians</label>
              <input
                id="mwirian-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or cohort"
                className="w-full max-w-md rounded-md border border-ink/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 mt-8" aria-live="polite">
            {shown.length === 0 && <p className="text-ink/70">Nobody matches your search. Try a different name or field.</p>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map(p => <Card key={p.name} p={p} />)}
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 mt-12">
            <p className="text-sm text-ink/75">
              Know a Mwirian who belongs here? <Link to="/contact?topic=Nominate a prominent Mwirian" className="font-medium text-brand underline">Nominate them</Link>.
            </p>
          </section>
        </>
      )}
    </>
  )
}
