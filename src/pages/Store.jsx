import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { useCart } from '../context/CartContext.jsx'
import { ugx } from '../lib/format.js'

export default function Store() {
  const { add, count } = useCart()
  const { products } = useContent()
  const [category, setCategory] = useState('All')
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
        {shown.map(p => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-brand/10 to-gold/25 flex items-center justify-center relative">
              {p.image ? <img src={p.image} alt={p.variant ? `${p.name}, ${p.variant}` : p.name} loading="lazy" className="h-full w-full object-contain bg-white" />
                       : <img src="/moba-shield.webp" alt="" className="h-24 opacity-80" />}
              {p.preview && (
                <span className="absolute top-2 left-2 text-xs bg-brand-dark/80 text-white font-semibold px-2 py-1 rounded">Preview design</span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              {p.delivery === 'digital' && (
                <span className="self-start text-xs bg-gold/30 text-gold-dark font-semibold px-2 py-1 rounded mb-2">Instant delivery</span>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-ink/70 mt-1 flex-1">{p.variant || p.blurb}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-brand">{ugx(p.price)}</span>
                <button onClick={() => add(p)} className="bg-gold text-brand-dark font-semibold px-4 py-2 rounded-md hover:brightness-110">
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
