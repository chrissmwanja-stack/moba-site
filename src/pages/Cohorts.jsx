import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { site, branches, cohorts } from '../data/content.js'

const decadeOf = y => `${Math.floor(y / 10) * 10}s`

function BranchCard({ b }) {
  return (
    <article className="bg-white rounded-lg shadow p-5 border-t-4 border-gold flex flex-col">
      <p className="text-xs font-semibold text-gold-dark uppercase tracking-wide">{b.region}</p>
      <h3 className="text-lg font-bold text-brand mt-1">{b.name}</h3>
      <p className="text-sm text-ink/70 mt-2">{b.meets}</p>
      <p className="text-sm text-ink/70">Contact: {b.contact}</p>
      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        {b.email && (
          <a href={`mailto:${b.email}`} className="text-sm font-medium text-brand hover:underline">Email</a>
        )}
        {b.whatsapp && (
          <a href={b.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand hover:underline">
            Join WhatsApp group
          </a>
        )}
        {!b.email && !b.whatsapp && (
          <Link to="/contact" className="text-sm font-medium text-brand hover:underline">Ask how to join</Link>
        )}
      </div>
    </article>
  )
}

function ClassPanel({ year, group }) {
  const span = `${year} to ${year + site.schoolYears - 1}` // S1 in the joining year, S6 in the last
  return (
    <div
      className="bg-white rounded-lg shadow p-6 border-l-4 border-gold"
      role="status"
      aria-live="polite"
    >
      <h3 className="text-xl font-bold text-brand">Joined {year}</h3>
      <p className="text-sm text-ink/60 mt-1">Usually at Mwiri {span}</p>
      {group ? (
        <>
          <p className="mt-2 text-ink/70">Contact: {group.contact}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {group.whatsapp && (
              <a href={group.whatsapp} target="_blank" rel="noopener noreferrer"
                 className="bg-gold text-brand-dark font-semibold px-5 py-2.5 rounded-md hover:brightness-110">
                Join the WhatsApp group
              </a>
            )}
            {group.email && (
              <a href={`mailto:${group.email}`} className="font-medium text-brand hover:underline self-center">
                Email the coordinator
              </a>
            )}
            {!group.whatsapp && !group.email && (
              <Link to={`/contact`} className="font-medium text-brand hover:underline">
                Contact us to reach this cohort
              </Link>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-ink/70 max-w-xl">
            We do not have a group for this class yet. Add your details and we will connect you with others
            who joined in {year}, or help you start the group.
          </p>
          <Link
            to={`/update-details?joined=${year}`}
            className="mt-4 inline-block bg-gold text-brand-dark font-semibold px-5 py-2.5 rounded-md hover:brightness-110"
          >
            Register as joined {year}
          </Link>
        </>
      )}
    </div>
  )
}

export default function Cohorts() {
  const thisYear = new Date().getFullYear()
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const byYear = new Map(cohorts.map(c => [c.year, c]))
  const years = Array.from({ length: thisYear - site.founded + 1 }, (_, i) => thisYear - i)
  const decades = [...new Set(years.map(decadeOf))]

  function onJump(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setQuery(v)
    const n = Number(v)
    if (v.length === 4 && n >= site.founded && n <= thisYear) setSelected(n)
  }

  return (
    <>
      <PageHeader
        title="Branches & Cohorts"
        subtitle="Find Old Boys near you, or from your year, and stay in touch."
      />

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-brand">Branches</h2>
        <p className="mt-2 text-ink/70 max-w-2xl">
          Local chapters bring Old Boys together where they live and work.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {branches.map(b => <BranchCard key={b.name} b={b} />)}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <h2 className="text-2xl font-bold text-brand">Find your cohort</h2>
        <p className="mt-2 text-ink/70 max-w-2xl">
          Cohorts are named by the year you joined Mwiri. Choose your joining year. A gold dot means we know of a group for that cohort.
        </p>

        <label className="mt-5 block max-w-xs">
          <span className="mb-1 block text-sm font-semibold text-ink">Jump to your joining year</span>
          <input
            value={query}
            onChange={onJump}
            inputMode="numeric"
            maxLength={4}
            placeholder={`e.g. ${thisYear - 20}`}
            className="w-full rounded-md border border-brand/25 bg-white px-3 py-2.5 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>

        <div className="mt-6 min-h-[1px]">
          {selected && <ClassPanel year={selected} group={byYear.get(selected)} />}
        </div>

        <div className="mt-8 space-y-6">
          {decades.map(d => (
            <div key={d}>
              <h3 className="text-sm font-semibold text-gold-dark uppercase tracking-wide">{d}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {years.filter(y => decadeOf(y) === d).sort((a, b) => a - b).map(y => {
                  const active = selected === y
                  const known = byYear.has(y)
                  return (
                    <li key={y}>
                      <button
                        type="button"
                        onClick={() => { setSelected(y); setQuery(String(y)) }}
                        aria-pressed={active}
                        aria-label={`Joined ${y}${known ? ', group available' : ''}`}
                        className={`relative rounded-md border px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                          active
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-brand border-brand/25 hover:bg-gold/20'
                        }`}
                      >
                        {y}
                        {known && (
                          <span aria-hidden="true" className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold border border-white" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="bg-brand-dark text-white rounded-lg p-8 border-l-4 border-gold">
          <h2 className="text-xl font-bold">Do not see your branch or cohort?</h2>
          <p className="mt-2 text-white/80 max-w-2xl">
            Tell us where you are and the year you joined, and we will connect you or help you start the group.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/update-details" className="bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">
              Update your details
            </Link>
            <Link to="/contact" className="border border-white/40 px-6 py-3 rounded-md hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
