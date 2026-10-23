import { useEffect, useRef, useState, useCallback } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { photos } from '../data/content.js'

const FIRST_PAGE = 18 // keeps the initial load light
const PAGE_STEP = 24

export default function Gallery() {
  const [index, setIndex] = useState(null) // index into `photos` of the open photo, or null
  const [visible, setVisible] = useState(FIRST_PAGE)
  const closeRef = useRef(null)
  const lastTile = useRef(null)
  const open = index !== null
  const active = open ? photos[index] : null

  const close = useCallback(() => {
    setIndex(null)
    lastTile.current?.focus() // hand focus back to the tile that opened the lightbox
  }, [])
  const step = useCallback(d => setIndex(i => (i + d + photos.length) % photos.length), [])

  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden' // stop the page scrolling behind the lightbox
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, step])

  // Swipe left/right on touch screens
  const touchX = useRef(null)
  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
  }

  const shown = photos.slice(0, visible)

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." />

      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" aria-label="Photos">
        {shown.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={e => { lastTile.current = e.currentTarget; setIndex(i) }}
            aria-label={`Open photo: ${p.caption}`}
            className="group relative aspect-4/3 rounded-lg overflow-hidden bg-linear-to-br from-brand/25 to-gold/40 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {p.src ? (
              <img
                src={p.thumb || p.src}
                alt={p.alt || p.caption}
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: p.focus || '50% 50%' }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-brand font-semibold">
                {p.caption}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-black/65 text-white text-xs p-3 text-left">
              <span className="block font-semibold">{p.caption}</span>
              <span className="block mt-1 opacity-90">{p.year}{p.source ? ` · ${p.source}` : ''}</span>
            </span>
          </button>
        ))}
      </section>

      {visible < photos.length && (
        <section className="max-w-6xl mx-auto px-4 mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible(v => v + PAGE_STEP)}
            className="bg-gold text-brand-dark font-semibold px-8 py-3 rounded-md hover:brightness-110"
          >
            Show more photos ({photos.length - visible} more)
          </button>
        </section>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.caption}, photo ${index + 1} of ${photos.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-white/70">{index + 1} / {photos.length}</p>
            <button ref={closeRef} type="button" onClick={close}
              className="rounded-md px-3 py-1.5 font-semibold text-gold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              Close ✕
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <button type="button" aria-label="Previous photo"
              onClick={e => { e.stopPropagation(); step(-1) }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-4">
              ‹
            </button>
            <img
              src={active.src}
              alt={active.alt || active.caption}
              onClick={e => e.stopPropagation()}
              className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
            />
            <button type="button" aria-label="Next photo"
              onClick={e => { e.stopPropagation(); step(1) }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-4">
              ›
            </button>
          </div>

          <div className="px-4 py-4 text-center text-white" onClick={e => e.stopPropagation()}>
            <p className="font-medium">{active.caption}</p>
            <p className="text-sm text-white/60">
              {active.year}{active.source ? ` · Photo source: ${active.source}` : ''}
              {active.sourceUrl && (
                <>
                  {' · '}
                  <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="underline text-gold">
                    View original source
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
