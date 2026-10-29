import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('')
const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hasBio = l => Array.isArray(l.bio) && l.bio.length > 0

function cohortText(l) {
  if (!l.cohortName) return l.cohort ? `Cohort: ${l.cohort}` : null
  const start = Number(l.cohort)
  return Number.isFinite(start) && start > 0
    ? `${l.cohortName}, ${start} to ${start + site.schoolYears - 1}`
    : l.cohortName
}

function houseText(l) {
  if (!l.houses?.length) return null
  return `${l.houses.length > 1 ? 'Houses' : 'House'}: ${l.houses.join(' and ')}`
}

function Avatar({ l, size, decorative = false }) {
  return l.photo
    ? <img src={l.photo} alt={decorative ? '' : l.name} style={{ objectPosition: l.focus || '50% 50%' }} className={`${size} rounded-full border-4 border-gold object-cover`} />
    : <div aria-hidden="true" className={`${size} rounded-full border-4 border-gold bg-brand font-bold text-gold flex items-center justify-center`}>{initials(l.name)}</div>
}

function LeaderCard({ l, active, onOpen }) {
  const profile = hasBio(l)
  const cohort = cohortText(l)
  return (
    <article
      id={`card-${slugOf(l.name)}`}
      className={`group relative ${profile ? 'focus-within:ring-2 focus-within:ring-brand' : ''} ${active ? 'ring-2 ring-gold ring-offset-4' : ''}`}
    >
      <div className="aspect-4/5 overflow-hidden border-b-4 border-gold bg-brand">
        {l.photo
          ? <img src={l.photo} alt="" loading="lazy" decoding="async" style={{ objectPosition: l.focus || '50% 20%' }} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
          : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
              <img src="/moba-shield.webp" alt="" className="h-16 w-auto" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Portrait to come</span>
            </div>
          )}
      </div>
      <h3 className="mt-3 font-semibold text-brand group-hover:underline">{l.name}</h3>
      <p className="text-sm font-medium text-gold-dark">{l.role}</p>
      {cohort && <p className="text-xs text-ink/65">{cohort}</p>}
      {profile && (
        // The ::after covers the whole card, so a tap anywhere on it opens the profile.
        <button
          type="button"
          onClick={() => onOpen(l)}
          aria-current={active ? 'true' : undefined}
          className="mt-2 text-sm font-medium text-brand hover:underline focus:outline-none after:absolute after:inset-0"
        >
          Read profile<span className="sr-only"> of {l.name}</span>
        </button>
      )}
    </article>
  )
}

function ProfilePanel({ l, onPrev, onNext, onClose, panelRef, headingRef }) {
  const house = houseText(l)
  const cohort = cohortText(l)
  return (
    <section ref={panelRef} aria-labelledby="profile-heading" className="mt-10 scroll-mt-24">
      <div className="rounded-md border-t border-brand/10 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="mx-auto shrink-0 md:mx-0"><Avatar l={l} size="w-40 h-40 text-5xl" /></div>
          <div className="min-w-0">
            <h2
              id="profile-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-bold text-brand focus:outline-none md:text-3xl"
            >
              {l.name}
            </h2>
            <p className="font-medium text-gold-dark">{l.role}</p>
            {cohort && <p className="mt-1 text-sm text-ink/70">{cohort}</p>}
            {house && <p className="text-sm text-ink/70">{house}</p>}
            <div className="mt-4 max-w-prose space-y-3 leading-relaxed text-ink/80">
              {l.bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-brand/10 pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-md border border-brand/30 px-4 py-2 font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Previous profile
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-brand/30 px-4 py-2 font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Next profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gold px-5 py-2 font-semibold text-brand-dark hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </section>
  )
}

// Full executive directory embedded in About MOBA. Content remains database-driven.
export default function LeadershipDirectory() {
  const { leaders, leadersTerm } = useContent()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const panelRef = useRef(null)
  const headingRef = useRef(null)
  const previous = useRef(null)

  // Only people with a biography have a profile to open; every leader still has a card.
  const profiles = useMemo(() => leaders.filter(hasBio), [leaders])

  // /about#sam-hooper opens a shareable profile and browser Back closes it.
  let slug = hash.slice(1)
  try { slug = decodeURIComponent(slug) } catch { /* keep the raw value */ }
  const selected = profiles.find(l => slugOf(l.name) === slug) || null
  const index = selected ? profiles.indexOf(selected) : -1
  const selectedSlug = selected ? slugOf(selected.name) : null
  const sectionRequested = hash === '#leadership'

  const open = l => navigate({ pathname, hash: slugOf(l.name) })
  const close = () => navigate({ pathname, hash: 'leadership' })
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
    } else if (sectionRequested) {
      sectionRef.current?.scrollIntoView({ block: 'start', behavior })
    }
    previous.current = selectedSlug
  }, [selectedSlug, sectionRequested])

  useEffect(() => {
    if (!selectedSlug) return
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section id="leadership" ref={sectionRef} aria-labelledby="leadership-heading" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">Our leadership</p>
        <h2 id="leadership-heading" className="mt-3 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">
          Executive Committee {(leadersTerm || '2026–2028').replace('–', ' to ')}
        </h2>
        <div className="mt-5 h-0.75 w-14 bg-gold" aria-hidden="true" />
        <p className="mt-5 leading-relaxed text-ink/75">Select a member to read their profile.</p>
      </div>

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

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {leaders.map(l => (
          <LeaderCard key={l.name} l={l} active={slugOf(l.name) === selectedSlug} onOpen={open} />
        ))}
      </div>
    </section>
  )
}
