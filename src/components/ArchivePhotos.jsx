import { useCallback, useEffect, useRef, useState } from 'react'
import { useContent } from '../lib/siteContent.js'

// The "From the archive" photographs, shown on the Archives page.
// They are the gallery photos whose category is "From the archive", so they stay in one place and can still be
// edited from the admin photo list. Dated photos come first, oldest to newest.
const CATEGORY = 'from the archive'

export default function ArchivePhotos() {
  const { photos } = useContent()
  const list = photos
    .filter(p => p.src && (p.category || '').trim().toLowerCase() === CATEGORY)
    .sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999))

  const [index, setIndex] = useState(null)
  const closeRef = useRef(null)
  const lastTile = useRef(null)
  const touchX = useRef(null)
  const open = index !== null
  const active = open ? list[index] : null

  const close = useCallback(() => {
    setIndex(null)
    lastTile.current?.focus()
  }, [])
  const step = useCallback(d => setIndex(i => (list.length ? (i + d + list.length) % list.length : null)), [list.length])

  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, step])

  if (list.length === 0) return null

  const onTouchEnd = e => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
  }

  return (
    <section className="mt-14 bg-brand-dark text-white" aria-labelledby="archive-photos-title">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">From the archive</p>
        <h2 id="archive-photos-title" className="mt-2 font-display text-3xl font-bold md:text-4xl">Generations on the Hill</h2>
        <div className="mt-3 h-0.5 w-16 bg-gold" />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.id ?? p.src}>
              <button
                type="button"
                onClick={e => { lastTile.current = e.currentTarget; setIndex(i) }}
                aria-label={`Open photo: ${p.caption}`}
                className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="block aspect-4/3 overflow-hidden rounded-md border-b-2 border-gold bg-white/5">
                  <img
                    src={p.thumb || p.src}
                    alt={p.alt || p.caption}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{ objectPosition: p.focus || '50% 50%' }}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block text-sm italic text-white/85">{p.caption}</span>
                {p.year && <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-gold">{p.year}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.caption}, photo ${index + 1} of ${list.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-white/70">{index + 1} / {list.length}</p>
            <button ref={closeRef} type="button" onClick={close}
              className="rounded-md px-3 py-1.5 font-semibold text-gold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              Close ✕
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <button type="button" aria-label="Previous photo" onClick={e => { e.stopPropagation(); step(-1) }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-4">
              ‹
            </button>
            <img src={active.src} alt={active.alt || active.caption} onClick={e => e.stopPropagation()}
              className="max-h-full max-w-full rounded-md object-contain shadow-2xl" />
            <button type="button" aria-label="Next photo" onClick={e => { e.stopPropagation(); step(1) }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-4">
              ›
            </button>
          </div>
          <div className="px-4 py-4 text-center text-white" onClick={e => e.stopPropagation()}>
            <p className="font-medium">{active.caption}</p>
            {(active.year || active.source) && (
              <p className="text-sm text-white/60">{active.year}{active.year && active.source ? ' · ' : ''}{active.source ? `Photo source: ${active.source}` : ''}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
