import { useEffect, useRef, useState, useCallback } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { safeUrl } from '../lib/safeUrl.js'

const FIRST_PAGE = 18 // keeps the initial load light
const PAGE_STEP = 24

export default function Gallery() {
  const { photos } = useContent()
  const [index, setIndex] = useState(null) // index into the filtered photos of the open photo
  const [visible, setVisible] = useState(FIRST_PAGE)
  const [category, setCategory] = useState('All')
  const categories = [...new Set(photos.map(p => p.category?.trim() || 'Uncategorised'))]
  const filtered = category === 'All' ? photos : photos.filter(p => (p.category?.trim() || 'Uncategorised') === category)
  const closeRef = useRef(null)
  const lastTile = useRef(null)
  const open = index !== null
  const active = open ? filtered[index] : null

  const close = useCallback(() => {
    setIndex(null)
    lastTile.current?.focus() // hand focus back to the tile that opened the lightbox
  }, [])
  const step = useCallback(d => setIndex(i => filtered.length ? (i + d + filtered.length) % filtered.length : null), [filtered.length])

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

  const shown = filtered.slice(0, visible)

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." />

      <section className="mx-auto mt-8 max-w-6xl px-4 md:mt-10" aria-label="Filter gallery by category">
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map(c => (
            <button key={c} type="button" onClick={() => { setCategory(c); setVisible(FIRST_PAGE); setIndex(null) }} aria-pressed={category === c}
              className={`rounded-sm border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${category === c ? 'border-brand bg-brand text-white' : 'border-brand/20 bg-white text-brand hover:border-brand'}`}>
              {c}<span className="ml-2 opacity-70">{c === 'All' ? photos.length : photos.filter(p => (p.category?.trim() || 'Uncategorised') === c).length}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-brand/60" aria-live="polite">Showing {shown.length} of {filtered.length} photos</p>
      </section>

      <section className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 md:mt-7 md:grid-cols-3" aria-label="Photos">
        {shown.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={e => { lastTile.current = e.currentTarget; setIndex(i) }}
            aria-label={`Open photo: ${p.caption}`}
            className="group relative aspect-4/3 overflow-hidden rounded-md bg-linear-to-br from-brand/10 to-gold/25 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
            <span className="absolute left-3 top-3 rounded-sm bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">{p.category || 'Uncategorised'}</span>
            <span className="absolute inset-x-0 bottom-0 bg-black/65 text-white text-xs p-3 text-left">
              <span className="block font-semibold">{p.caption}</span>
              <span className="block mt-1 opacity-90">{p.year}{p.source ? ` · ${p.source}` : ''}</span>
            </span>
          </button>
        ))}
      </section>

      {visible < filtered.length && (
        <section className="max-w-6xl mx-auto px-4 mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible(v => v + PAGE_STEP)}
            className="bg-gold text-brand-dark font-semibold px-8 py-3 rounded-md hover:brightness-110"
          >
            Show more photos ({filtered.length - visible} more)
          </button>
        </section>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.caption}, photo ${index + 1} of ${filtered.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-white/70">{index + 1} / {filtered.length}</p>
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
              {active.category ? `${active.category} · ` : ''}{active.year}{active.source ? ` · Photo source: ${active.source}` : ''}
              {safeUrl(active.sourceUrl) && (
                <>
                  {' · '}
                  <a href={safeUrl(active.sourceUrl)} target="_blank" rel="noopener noreferrer" className="underline text-gold">
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
