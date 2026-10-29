import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { branches } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

const decadeOf = y => `${Math.floor(y / 10) * 10}s`

function BranchCard({ b }) {
  return (
    <article className="bg-white rounded-md shadow-sm p-5 border-t border-brand/10 flex flex-col">
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
  const last = year + site.schoolYears - 1 // the class starts S1 in `year` and finishes S6 in `last`
  return (
    <div
      className="bg-white rounded-md shadow-sm p-6 border-l-2 border-gold"
      role="status"
      aria-live="polite"
    >
      <h3 className="text-xl font-bold text-brand">Cohort {year}</h3>
      <p className="text-sm text-ink/70 mt-1">S1 in {year}, S6 in {last}</p>
      <p className="text-sm text-ink/70">Includes classmates who joined later, for example in S5.</p>
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
            in the {year} cohort, or help you start the group.
          </p>
          <Link
            to={`/update-details?cohort=${year}`}
            className="mt-4 inline-block bg-gold text-brand-dark font-semibold px-5 py-2.5 rounded-md hover:brightness-110"
          >
            Register in the {year} cohort
          </Link>
        </>
      )}
    </div>
  )
}

export default function Cohorts() {
  const { site, cohorts } = useContent()
  const thisYear = new Date().getFullYear()
  // Someone who joins in S1 in year Y leaves after S6 in Y + schoolYears - 1.
  // Anyone who joined after `lastCohort` is still at school, so they are not Old Boys yet.
  const lastCohort = thisYear - site.schoolYears + 1
  const newest = Math.max(lastCohort, ...cohorts.map(c => c.year)) // never hide a cohort that has a group

  const byYear = new Map(cohorts.map(c => [c.year, c]))
  const years = Array.from({ length: newest - site.founded + 1 }, (_, i) => newest - i)
  const decades = [...new Set(years.map(decadeOf))]
  const withGroup = [...byYear.keys()].sort((x, y) => y - x)

  const [selected, setSelected] = useState(null)
  const [decade, setDecade] = useState(decadeOf(lastCohort))
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('start') // 'start' = year the class began S1, 'finish' = year it finished S6
  const panelRef = useRef(null)
  const span = site.schoolYears - 1 // S1 year to S6 year

  // A cohort is a class: everyone who finished together, including those who joined later (e.g. in S5).
  // It is named by the year the class started S1. People may know either year, so accept both.
  const toCohort = n => (mode === 'start' ? n : n - span)
  const toInput = (c, m = mode) => String(m === 'start' ? c : c + span)

  // Bring the result into view when a year is chosen (only scrolls if it is off screen)
  useEffect(() => {
    if (selected === null) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [selected])

  function choose(y) {
    setSelected(y)
    setDecade(decadeOf(y))
    setQuery(toInput(y))
  }

  function switchMode(m) {
    setMode(m)
    setQuery(selected !== null ? toInput(selected, m) : '')
  }

  function onJump(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setQuery(v)
    const c = toCohort(Number(v))
    if (v.length === 4 && c >= site.founded && c <= newest) {
      setSelected(c)
      setDecade(decadeOf(c))
    } else {
      setSelected(null)
    }
  }

  const typedCohort = toCohort(Number(query))
  const stillAtSchool = query.length === 4 && typedCohort > newest && typedCohort <= thisYear
  const decadeYears = years.filter(y => decadeOf(y) === decade).sort((x, y) => x - y)
  const decadeHasGroup = d => years.some(y => decadeOf(y) === d && byYear.has(y))

  return (
    <>
      <PageHeader
        title="Branches & Cohorts"
        image="/gallery/archive-team-1947.webp"
        position="50% 40%"
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
          A cohort is a class: the Old Boys who finished S6 together. It is named by the year the class started S1,
          so the 2001 cohort started in 2001 and finished in 2006. If you joined later, for example in S5, you still
          belong to the class you finished with. A gold dot means we know of a group for that cohort.
        </p>

        <div role="group" aria-label="Search by" className="mt-5 inline-flex rounded-md border border-brand/25 bg-white p-0.5">
          {[['start', 'Year my class started S1'], ['finish', 'Year I finished S6']].map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={mode === m}
              className={`rounded px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                mode === m ? 'bg-brand text-white' : 'text-brand hover:bg-gold/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="mt-4 block max-w-xs">
          <span className="mb-1 block text-sm font-semibold text-ink">
            {mode === 'start' ? 'Year your class started S1' : 'Year you finished S6'}
          </span>
          <input
            value={query}
            onChange={onJump}
            inputMode="numeric"
            maxLength={4}
            placeholder={`e.g. ${mode === 'start' ? thisYear - 20 : thisYear - 20 + span}`}
            className="w-full rounded-md border border-brand/60 bg-white px-3 py-2.5 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>

        {stillAtSchool && (
          <p className="mt-3 max-w-xl rounded-md bg-gold/20 border border-gold px-4 py-3 text-sm text-ink" role="status">
            The {typedCohort} cohort is still at Mwiri and finishes S6 in {typedCohort + span}. It will appear here
            once it has left. The most recent cohort listed is {lastCohort}.
          </p>
        )}

        {withGroup.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gold-dark uppercase tracking-wide">Cohorts with a group</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {withGroup.map(y => (
                <li key={y}>
                  <button
                    type="button"
                    onClick={() => choose(y)}
                    aria-pressed={selected === y}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      selected === y ? 'bg-brand text-white border-brand' : 'bg-gold/25 text-brand-dark border-gold hover:bg-gold/40'
                    }`}
                  >
                    {y}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gold-dark uppercase tracking-wide">Or browse cohorts by decade</h3>
          <div role="group" aria-label="Choose a decade" className="mt-2 flex flex-wrap gap-2">
            {decades.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDecade(d)}
                aria-pressed={decade === d}
                className={`relative rounded-md border px-3.5 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  decade === d ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/25 hover:bg-gold/20'
                }`}
              >
                {d}
                {decadeHasGroup(d) && (
                  <span aria-hidden="true" className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold border border-white" />
                )}
              </button>
            ))}
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {decadeYears.map(y => {
              const known = byYear.has(y)
              return (
                <li key={y}>
                  <button
                    type="button"
                    onClick={() => choose(y)}
                    aria-pressed={selected === y}
                    aria-label={`Cohort ${y}${known ? ', group available' : ''}`}
                    className={`relative rounded-md border px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      selected === y ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/25 hover:bg-gold/20'
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

        {/* The result sits right under the year buttons, so it is always on screen after a tap */}
        <div ref={panelRef} className="mt-6 min-h-px scroll-mb-6">
          {selected && <ClassPanel year={selected} group={byYear.get(selected)} />}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="bg-brand-dark text-white rounded-lg p-8 border-l-2 border-gold">
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
