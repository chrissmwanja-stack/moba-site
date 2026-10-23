import { useEffect, useRef, useState, useCallback } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { photos } from '../data/content.js'

export default function Gallery() {
  const [index, setIndex] = useState(null) // index of the open photo, or null
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
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden' // stop the page scrolling behind the lightbox
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
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

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." />

      <section className="max-w-6xl mx-auto px-4 mt-12" aria-label="Photos">
        {photos.length === 0 ? (
          <p className="text-ink/70">Photos coming soon.</p>
        ) : (
          // Columns keep every photo at its natural shape, so portraits are not chopped into landscape boxes.
          <div className="columns-2 md:columns-3 gap-4">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={e => { lastTile.current = e.currentTarget; setIndex(i) }}
                aria-label={`Open photo: ${p.caption}, ${p.year}`}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <img
                  src={p.thumb || p.src}
                  alt={p.alt || p.caption}
                  width={p.w}
                  height={p.h}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="block h-auto w-full transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-left text-xs text-white">
                  {p.caption} · {p.event || p.year}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

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
            {photos.length > 1 && (
              <button type="button" aria-label="Previous photo"
                onClick={e => { e.stopPropagation(); step(-1) }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-4">
                ‹
              </button>
            )}
            <img
              src={active.src}
              alt={active.alt || active.caption}
              onClick={e => e.stopPropagation()}
              className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
            />
            {photos.length > 1 && (
              <button type="button" aria-label="Next photo"
                onClick={e => { e.stopPropagation(); step(1) }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3.5 py-2 text-2xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-4">
                ›
              </button>
            )}
          </div>

          <p className="px-4 py-4 text-center text-white" onClick={e => e.stopPropagation()}>
            <span className="font-medium">{active.caption}</span>
            <span className="text-white/60"> · {active.event || active.year}</span>
          </p>
        </div>
      )}
    </>
  )
}
