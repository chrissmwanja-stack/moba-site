import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { useCart } from '../context/CartContext.jsx'
import { ugx } from '../lib/format.js'

// Small bookmark icon used on Pre-order items.
function BookIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}

export default function Store() {
  const { add, count } = useCart()
  const { products } = useContent()
  const [category, setCategory] = useState('All')
  const [picked, setPicked] = useState({}) // product id -> chosen size
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
  const shown = category === 'All' ? products : products.filter(p => p.category === category)

  return (
    <>
      <PageHeader title="MOBA Store" subtitle="Wear the crest. Memorabilia from the Mwiri Old Boys Association. Order online, pay on delivery." image="/gallery/mwiri-today/campus-crane-sculpture.webp" position="50% 40%" />

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <p className="mb-6 text-sm text-ink/75">Prefer to give directly? <Link to="/donate" className="font-medium text-brand underline">Donate to a MOBA project</Link>.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${category === c ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/30 hover:border-brand'}`}>
              {c}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink/70 mt-3" aria-live="polite">{shown.length} {shown.length === 1 ? 'item' : 'items'}</p>
      </div>

      {count > 0 && (
        <Link to="/cart" className="fixed bottom-4 right-4 z-30 rounded-full bg-gold px-5 py-3 font-semibold text-brand-dark shadow-lg hover:brightness-110">
          View cart ({count}) →
        </Link>
      )}

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(p => {
          const sizes = String(p.sizes || '').split(',').map(s => s.trim()).filter(Boolean)
          const size = picked[p.id]
          const comingSoon = p.availability === 'coming-soon'
          const preorder = p.availability === 'preorder'
          const unavailable = p.soldOut || comingSoon
          const needsSize = sizes.length > 0 && !size
          return (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-brand/10 to-gold/25 flex items-center justify-center relative">
              {p.image ? <img src={p.image} alt={p.variant ? `${p.name}, ${p.variant}` : p.name} loading="lazy" className="h-full w-full object-contain bg-white" />
                       : <img src="/moba-shield.webp" alt="" className="h-24 opacity-80" />}
              {p.preview && (
                <span className="absolute top-2 left-2 text-xs bg-brand-dark/80 text-white font-semibold px-2 py-1 rounded">Preview design</span>
              )}
              {comingSoon && (
                <span className="absolute top-2 right-2 text-xs bg-brand-dark text-white font-semibold px-2 py-1 rounded">Coming soon</span>
              )}
              {preorder && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs bg-gold text-brand-dark font-semibold px-2 py-1 rounded">
                  <BookIcon /> Pre-order
                </span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              {p.delivery === 'digital' && (
                <span className="self-start text-xs bg-gold/30 text-gold-dark font-semibold px-2 py-1 rounded mb-2">Instant delivery</span>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-ink/70 mt-1 flex-1">{p.variant || p.blurb}</p>
              {(comingSoon || preorder) && (
                <p className="mt-2 text-sm font-medium text-brand">
                  {p.expected || (comingSoon ? 'Coming soon' : 'Pre-order now. Pay on delivery when it arrives.')}
                </p>
              )}
              {sizes.length > 0 && !unavailable && (
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Choose a size for ${p.name}`}>
                  {sizes.map(s => (
                    <button key={s} onClick={() => setPicked(cur => ({ ...cur, [p.id]: s }))} aria-pressed={size === s}
                      className={`min-w-10 px-3 py-1 rounded border text-sm font-semibold ${size === s ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/30 hover:border-brand'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-brand">{comingSoon && !(p.price > 0) ? 'Price to be announced' : ugx(p.price)}</span>
                <button onClick={() => add(p, size)} disabled={unavailable || needsSize}
                  className="inline-flex items-center gap-2 bg-gold text-brand-dark font-semibold px-4 py-2 rounded-md hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 disabled:cursor-not-allowed">
                  {preorder && !unavailable && !needsSize && <BookIcon />}
                  {p.soldOut ? 'Sold out' : comingSoon ? 'Coming soon' : needsSize ? 'Choose a size' : preorder ? 'Pre-order' : 'Add to cart'}
                </button>
              </div>
            </div>
          </article>
          )
        })}
      </section>
    </>
  )
}
