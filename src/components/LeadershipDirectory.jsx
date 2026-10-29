import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

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

function ProfileDialog({ l, term, onPrev, onNext, onClose }) {
  const dialogRef = useRef(null)
  const house = houseText(l)
  const cohort = cohortText(l)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  // Native modal dialogs make the page inert; this also wraps Tab explicitly
  // so keyboard focus cannot move out of the profile to the browser chrome.
  const trapFocus = e => {
    if (e.key !== 'Tab') return
    const focusable = Array.from(dialogRef.current.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter(element => element.getClientRects().length > 0)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first) return

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="profile-heading"
      aria-describedby="profile-biography"
      onCancel={e => { e.preventDefault(); onClose() }}
      onKeyDown={trapFocus}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-brand-dark/80"
    >
      <div className="relative border-t-[5px] border-gold bg-white md:grid md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)]">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <div className="relative h-80 bg-brand sm:h-96 md:h-auto md:min-h-[600px]">
          {l.photo
            ? <img src={l.photo} alt={l.name} style={{ objectPosition: l.focus || '50% 50%' }} className="absolute inset-0 h-full w-full object-cover" />
            : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <img src="/moba-shield.webp" alt="" className="h-24 w-auto" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Portrait to come</span>
              </div>
            )}
        </div>

        <div className="flex min-w-0 flex-col gap-4 p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand/65">
            MOBA Executive {(term || '2026–2028').replace('–', ' to ')}
          </p>
          <h2 id="profile-heading" className="pr-10 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">
            {l.name}
          </h2>
          <p className="font-semibold text-brand/70">{l.role}</p>

          {(cohort || house) && (
            <div className="flex flex-wrap gap-2.5">
              {cohort && (
                <span className="rounded-sm bg-[#f5e6c4] px-3 py-2 text-[13px] font-semibold text-brand-dark">
                  {cohort.startsWith('Cohort:') ? cohort : `Cohort: ${cohort}`}
                </span>
              )}
              {house && <span className="rounded-sm bg-[#e6e8ec] px-3 py-2 text-[13px] font-semibold text-brand-dark">{house}</span>}
            </div>
          )}

          <div className="h-0.75 w-12 bg-gold" aria-hidden="true" />
          <div id="profile-biography" className="space-y-4 text-[15px] leading-7 text-ink/80">
            {l.bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous profile"
              className="rounded-md border border-brand/30 px-4 py-2 text-sm font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next profile"
              className="rounded-md border border-brand/30 px-4 py-2 text-sm font-medium text-brand hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

// Full executive directory embedded in About MOBA. Content remains database-driven.
export default function LeadershipDirectory() {
  const { leaders, leadersTerm } = useContent()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
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
    if (selectedSlug) {
      previous.current = selectedSlug
      return
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const behavior = reduce ? 'auto' : 'smooth'
    if (previous.current) {
      const card = document.getElementById(`card-${previous.current}`)
      card?.querySelector('button')?.focus({ preventScroll: true })
    } else if (sectionRequested) {
      sectionRef.current?.scrollIntoView({ block: 'start', behavior })
    }
    previous.current = null
  }, [selectedSlug, sectionRequested])

  return (
    <>
      <section id="leadership" ref={sectionRef} aria-labelledby="leadership-heading" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">Our leadership</p>
          <h2 id="leadership-heading" className="mt-3 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">
            Executive Committee {(leadersTerm || '2026–2028').replace('–', ' to ')}
          </h2>
          <div className="mt-5 h-0.75 w-14 bg-gold" aria-hidden="true" />
          <p className="mt-5 leading-relaxed text-ink/75">Select a member to read their profile.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {leaders.map(l => (
            <LeaderCard key={l.name} l={l} active={slugOf(l.name) === selectedSlug} onOpen={open} />
          ))}
        </div>
      </section>

      {selected && (
        <ProfileDialog
          l={selected}
          term={leadersTerm}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClose={close}
        />
      )}
    </>
  )
}
