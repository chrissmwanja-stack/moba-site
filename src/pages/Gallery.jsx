import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { campusGallery } from '../data/projectSpotlights.js'
import { safeUrl } from '../lib/safeUrl.js'

const FIRST_PAGE = 18 // photos shown when an album is opened
const PAGE_STEP = 24
const PREVIEW = 6 // photos shown per album on the overview

// Albums appear in this order; any category added in the admin is listed after them.
const ALBUM_ORDER = ['Reunions', 'AGM & meetings', 'Projects & campus', 'Mwiri today', 'From the archive']
const ALBUM_INFO = {
  'Reunions': 'The Reunion at Mwiri, 19 September 2026.',
  'AGM & meetings': 'Annual general meetings and gatherings of members.',
  'Projects & campus': 'MOBA projects and improvements at Busoga College Mwiri.',
  'Mwiri today': 'The Hill as it looks today: buildings, gardens and grounds.',
  'From the archive': 'Old photographs from the school’s history.',
}
const categoryOf = p => p.category?.trim() || 'Uncategorised'

function Tile({ photo, eager, onOpen }) {
  return (
    <button
      type="button"
      onClick={e => onOpen(e.currentTarget)}
      aria-label={`Open photo: ${photo.caption}`}
      className="group relative aspect-4/3 overflow-hidden rounded-md bg-linear-to-br from-brand/10 to-gold/25 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {photo.src ? (
        <img
          src={photo.thumb || photo.src}
          alt={photo.alt || photo.caption}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: photo.focus || '50% 50%' }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-brand font-semibold">
          {photo.caption}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-black/65 text-white text-xs p-3 text-left">
        <span className="block font-semibold">{photo.caption}</span>
        {(photo.year || photo.source) && <span className="block mt-1 opacity-90">{[photo.year, photo.source].filter(Boolean).join(' · ')}</span>}
      </span>
    </button>
  )
}

export default function Gallery() {
  const { photos: contentPhotos } = useContent()
  const photos = useMemo(() => {
    const known = new Set(contentPhotos.map(p => p.src).filter(Boolean))
    const newCampusPhotos = campusGallery
      .filter(photo => !known.has(photo.src))
      .map((photo, i) => ({ ...photo, id: `mwiri-today-${i}`, category: 'Mwiri today', source: 'MOBA' }))
    return [...contentPhotos, ...newCampusPhotos]
  }, [contentPhotos])
  const [params, setParams] = useSearchParams()
  const groups = useMemo(() => {
    const map = new Map()
    photos.forEach(p => {
      const name = categoryOf(p)
      if (!map.has(name)) map.set(name, [])
      map.get(name).push(p)
    })
    const rank = name => { const i = ALBUM_ORDER.indexOf(name); return i === -1 ? ALBUM_ORDER.length : i }
    return [...map.entries()]
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => rank(a.name) - rank(b.name)) // unknown albums keep their original order (stable sort)
  }, [photos])
  const albumParam = params.get('album')
  const album = groups.find(g => g.name === albumParam) || null // null = overview of all albums
  const [visible, setVisible] = useState(FIRST_PAGE)
  const [lightbox, setLightbox] = useState(null) // { name, index } within that album
  const list = lightbox ? groups.find(g => g.name === lightbox.name)?.items || [] : []
  const index = lightbox ? lightbox.index : null
  const filtered = list
  const topRef = useRef(null)
  const firstRender = useRef(true)
  const closeRef = useRef(null)
  const lastTile = useRef(null)
  const open = lightbox !== null && !!list[index]
  const active = open ? list[index] : null

  const chooseAlbum = name => {
    setVisible(FIRST_PAGE)
    setLightbox(null)
    setParams(name ? { album: name } : {})
  }
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    topRef.current?.scrollIntoView({ block: 'start' }) // bring the chosen album into view
  }, [albumParam])
  const openPhoto = (name, i, el) => { lastTile.current = el; setLightbox({ name, index: i }) }

  const close = useCallback(() => {
    setLightbox(null)
    lastTile.current?.focus() // hand focus back to the tile that opened the lightbox
  }, [])
  const count = list.length
  const step = useCallback(d => setLightbox(l => (l && count ? { ...l, index: (l.index + d + count) % count } : null)), [count])

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

  const albumItems = album ? album.items : []
  const shown = albumItems.slice(0, visible)
  const chip = on => `rounded-sm border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? 'border-brand bg-brand text-white' : 'border-brand/20 bg-white text-brand hover:border-brand'}`
  const grid = 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." image="/gallery/agm-2026-4.webp" position="50% 40%" />

      <section ref={topRef} className="mx-auto mt-8 max-w-6xl scroll-mt-4 px-4 md:mt-10" aria-label="Choose an album">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => chooseAlbum(null)} aria-pressed={!album} className={chip(!album)}>
            All albums<span className="ml-2 opacity-70">{groups.length}</span>
          </button>
          {groups.map(g => (
            <button key={g.name} type="button" onClick={() => chooseAlbum(g.name)} aria-pressed={album?.name === g.name} className={chip(album?.name === g.name)}>
              {g.name}<span className="ml-2 opacity-70">{g.items.length}</span>
            </button>
          ))}
        </div>
      </section>

      {album ? (
        <>
          <section className="mx-auto mt-8 max-w-6xl px-4" aria-label={album.name}>
            <button type="button" onClick={() => chooseAlbum(null)} className="text-sm font-semibold text-brand underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              ← All albums
            </button>
            <h2 className="mt-3 text-2xl font-bold text-brand">{album.name}</h2>
            {ALBUM_INFO[album.name] && <p className="mt-1 text-brand/80">{ALBUM_INFO[album.name]}</p>}
            <p className="mt-2 text-sm text-brand/70" aria-live="polite">Showing {shown.length} of {albumItems.length} photos</p>
          </section>

          <section className={`mx-auto mt-5 max-w-6xl px-4 ${grid}`} aria-label={`${album.name} photos`}>
            {shown.map((p, i) => <Tile key={p.id} photo={p} eager={i < 3} onOpen={el => openPhoto(album.name, i, el)} />)}
          </section>

          {visible < albumItems.length && (
            <section className="max-w-6xl mx-auto px-4 mt-10 text-center">
              <button type="button" onClick={() => setVisible(v => v + PAGE_STEP)}
                className="bg-gold text-brand-dark font-semibold px-8 py-3 rounded-md hover:brightness-110">
                Show more photos ({albumItems.length - visible} more)
              </button>
            </section>
          )}
        </>
      ) : (
        groups.map((g, gi) => {
          const preview = g.items.slice(0, PREVIEW)
          return (
            <section key={g.name} className="mx-auto mt-10 max-w-6xl px-4" aria-labelledby={`album-${gi}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-gold/60 pb-2">
                <div>
                  <h2 id={`album-${gi}`} className="text-2xl font-bold text-brand">{g.name}</h2>
                  {ALBUM_INFO[g.name] && <p className="mt-1 text-sm text-brand/80">{ALBUM_INFO[g.name]}</p>}
                </div>
                <p className="text-sm font-semibold text-brand/70">{g.items.length} {g.items.length === 1 ? 'photo' : 'photos'}</p>
              </div>
              <div className={`mt-5 ${grid}`}>
                {preview.map((p, i) => <Tile key={p.id} photo={p} eager={gi === 0 && i < 3} onOpen={el => openPhoto(g.name, i, el)} />)}
              </div>
              {g.items.length > PREVIEW && (
                <div className="mt-5 text-center">
                  <button type="button" onClick={() => chooseAlbum(g.name)}
                    className="rounded-md bg-gold px-8 py-3 font-semibold text-brand-dark hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    View all {g.items.length} photos in {g.name}
                  </button>
                </div>
              )}
            </section>
          )
        })
      )}
      <div className="h-12" />

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
              {[active.category, active.year, active.source && `Photo source: ${active.source}`].filter(Boolean).join(' · ')}
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
