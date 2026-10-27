import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')
const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hasBio = l => Array.isArray(l.bio) && l.bio.length > 0

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

function Avatar({ l, size, decorative = false }) {
  return l.photo
    ? <img src={l.photo} alt={decorative ? '' : l.name} style={{ objectPosition: l.focus || '50% 50%' }} className={`${size} rounded-full object-cover border-4 border-gold`} />
    : <div aria-hidden="true" className={`${size} rounded-full bg-brand text-gold font-bold flex items-center justify-center border-4 border-gold`}>{initials(l.name)}</div>
}

function LeaderCard({ l, active, onOpen }) {
  const house = houseText(l)
  const profile = hasBio(l)
  return (
    <article
      id={`card-${slugOf(l.name)}`}
      className={`relative bg-white rounded-md shadow-sm p-6 text-center ${
        profile ? 'hover:shadow-md focus-within:ring-2 focus-within:ring-brand' : ''
      } ${active ? 'ring-2 ring-gold' : ''}`}
    >
      <div className="mx-auto w-fit"><Avatar l={l} size="w-28 h-28 text-3xl" decorative /></div>
      <h3 className="font-semibold text-lg mt-4">{l.name}</h3>
      <p className="text-gold-dark font-medium">{l.role}</p>
      <p className="text-sm text-ink/70">Cohort: {cohortText(l)}</p>
      {house && <p className="text-sm text-ink/70">{house}</p>}
      {profile && (
        // The ::after covers the whole card, so a tap anywhere on it opens the profile.
        <button
          type="button"
          onClick={() => onOpen(l)}
          aria-current={active ? 'true' : undefined}
          className="mt-4 text-sm font-medium text-brand hover:underline focus:outline-none after:absolute after:inset-0"
        >
          Read profile<span className="sr-only"> of {l.name}</span>
        </button>
      )}
    </article>
  )
}

function ProfilePanel({ l, onPrev, onNext, onClose, panelRef, headingRef }) {
  const house = houseText(l)
  return (
    <section ref={panelRef} aria-labelledby="profile-heading" className="max-w-6xl mx-auto px-4 mt-10 scroll-mt-24">
      <div className="bg-white rounded-md shadow-sm border-t border-brand/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="shrink-0 mx-auto md:mx-0"><Avatar l={l} size="w-40 h-40 text-5xl" /></div>
          <div className="min-w-0">
            <h2
              id="profile-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl md:text-3xl font-bold text-brand focus:outline-none"
            >
              {l.name}
            </h2>
            <p className="text-gold-dark font-medium">{l.role}</p>
            <p className="text-sm text-ink/70 mt-1">Cohort: {cohortText(l)}</p>
            {house && <p className="text-sm text-ink/70">{house}</p>}
            <div className="mt-4 space-y-3 text-ink/80 leading-relaxed max-w-prose">
              {l.bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-brand/10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="border border-brand/30 text-brand font-medium px-4 py-2 rounded-md hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Previous profile
          </button>
          <button
            type="button"
            onClick={onNext}
            className="border border-brand/30 text-brand font-medium px-4 py-2 rounded-md hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Next profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="sm:ml-auto bg-gold text-brand-dark font-semibold px-5 py-2 rounded-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Close
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Leadership() {
  const { leaders, leadersTerm } = useContent()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const headingRef = useRef(null)
  const previous = useRef(null) // slug of the profile that was open, so Close can return to its card

  // Only people with a bio have a profile to open.
  const profiles = useMemo(() => leaders.filter(hasBio), [leaders])

  // The address bar is the single source of truth (/leadership#sam-hooper), so a profile can be
  // shared as a link, and the browser Back button closes it.
  let slug = hash.slice(1)
  try { slug = decodeURIComponent(slug) } catch { /* keep the raw value */ }
  const selected = profiles.find(l => slugOf(l.name) === slug) || null
  const index = selected ? profiles.indexOf(selected) : -1
  const selectedSlug = selected ? slugOf(selected.name) : null

  const open = l => navigate({ pathname, hash: slugOf(l.name) })
  const close = () => navigate({ pathname, hash: '' })
  const step = d => open(profiles[(index + d + profiles.length) % profiles.length])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const behavior = reduce ? 'auto' : 'smooth'
    if (selectedSlug) {
      panelRef.current?.scrollIntoView({ block: 'start', behavior })
      headingRef.current?.focus({ preventScroll: true })
    } else if (previous.current) {
      const card = document.getElementById(`card-${previous.current}`)
      card?.scrollIntoView({ block: 'center', behavior })
      card?.querySelector('button')?.focus({ preventScroll: true })
    }
    previous.current = selectedSlug
  }, [selectedSlug])

  useEffect(() => {
    if (!selectedSlug) return
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <PageHeader title="Our Leadership" subtitle={`The executive committee serving MOBA ${leadersTerm}.`} />

      {selected && (
        <ProfilePanel
          l={selected}
          panelRef={panelRef}
          headingRef={headingRef}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClose={close}
        />
      )}

      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leaders.map(l => (
          <LeaderCard key={l.name} l={l} active={slugOf(l.name) === selectedSlug} onOpen={open} />
        ))}
      </section>
    </>
  )
}