import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { photos } from '../data/content.js'

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <>
      <PageHeader title="Photo Gallery" subtitle="Moments from reunions, projects and events." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-4 grid-cols-2 md:grid-cols-3">
        {photos.map(p => (
          <button key={p.id} onClick={() => setActive(p)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-brand/25 to-gold/40">
            {p.src && <img src={p.src} alt={p.caption} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />}
            <span className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2 text-left">
              {p.caption} · {p.year}
            </span>
          </button>
        ))}
      </section>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="max-w-3xl w-full bg-white rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-[4/3] bg-gradient-to-br from-brand/25 to-gold/40">
              {active.src && <img src={active.src} alt={active.caption} className="w-full h-full object-contain" />}
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="font-medium">{active.caption} · {active.year}</p>
              <button onClick={() => setActive(null)} className="text-brand font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
