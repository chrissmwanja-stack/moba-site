import PageHeader from '../components/PageHeader.jsx'
import { products } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'
import { ugx } from '../lib/format.js'

export default function Store() {
  const { add } = useCart()
  return (
    <>
      <PageHeader title="MOBA Store" subtitle="Wear the crest. Memorabilia from the Mwiri Old Boys Association. Order online, pay on delivery." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <article key={p.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="h-48 bg-gradient-to-br from-brand/25 to-gold/40 flex items-center justify-center">
              {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                       : <img src="/moba-shield.webp" alt="" className="h-24 opacity-80" />}
            </div>
            <div className="p-5 flex flex-col flex-1">
              {p.delivery === 'digital' && (
                <span className="self-start text-xs bg-gold/30 text-gold-dark font-semibold px-2 py-1 rounded mb-2">Instant delivery</span>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-ink/70 mt-1 flex-1">{p.blurb}</p>
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
