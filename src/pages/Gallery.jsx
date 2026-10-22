import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { photos } from '../data/content.js'

export default function Gallery() {
  const [active, setActive] = useState(null)
  const [visible, setVisible] = useState(18) // first page only — keeps the initial load light

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [active])

  const shown = photos.slice(0, visible)

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {shown.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            aria-label={`Open photo: ${p.caption}`}
            className="group relative aspect-4/3 rounded-lg overflow-hidden bg-linear-to-br from-brand/25 to-gold/40 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {p.src ? (
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                decoding="async"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
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
            onClick={() => setVisible(v => v + 24)}
            className="bg-gold text-brand-dark font-semibold px-8 py-3 rounded-md hover:brightness-110"
          >
            Show more photos ({photos.length - visible} more)
          </button>
        </section>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            className="max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="aspect-4/3 max-h-[70vh] bg-linear-to-br from-brand/25 to-gold/40">
              {active.src && (
                <img
                  src={active.src}
                  alt={active.caption}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <p className="font-semibold">{active.caption}</p>
                <p className="text-sm text-gray-600">{active.year}{active.source ? ` · Photo source: ${active.source}` : ''}</p>
                {active.sourceUrl && (
                  <a
                    href={active.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-sm underline text-brand"
                  >
                    View original source
                  </a>
                )}
              </div>
              <button type="button" onClick={() => setActive(null)} autoFocus className="self-start sm:self-auto text-brand font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
