import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import { tiers } from '../data/content.js'
import { ugx } from '../lib/format.js'
import { PAYMENT_API_URL } from '../lib/payments.js'

export default function Membership() {
  const [selected, setSelected] = useState(tiers[0].id)
  const tier = tiers.find(t => t.id === selected)
  const online = Boolean(PAYMENT_API_URL)

  return (
    <>
      <PageHeader
        title="Membership"
        subtitle={online
          ? 'Stay connected and support the association. Choose a plan and pay online.'
          : 'Stay connected and support the association. Choose a plan and send your application; we will reply with payment instructions.'}
      />

      {/* Centred, equal-height cards; the column count follows the number of plans */}
      <section
        aria-label="Membership plans"
        className={`max-w-3xl mx-auto px-4 mt-12 grid gap-6 items-stretch ${tiers.length > 1 ? 'sm:grid-cols-2' : ''}`}
      >
        {tiers.map(t => {
          const on = selected === t.id
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(t.id)}
              className={`flex h-full flex-col text-left bg-white rounded-lg shadow p-6 border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                on ? 'border-gold' : 'border-transparent hover:border-gold/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-lg text-brand">{t.name}</h3>
                {on && <span className="shrink-0 rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold text-brand-dark">Selected</span>}
              </div>
              <p className="mt-2 text-3xl font-bold">{ugx(t.price)}</p>
              <p className="text-sm text-ink/60">{t.period === 'one-off' ? 'one-off payment' : `per ${t.period}`}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80">
                {t.perks.map(p => <li key={p}>✓ {p}</li>)}
              </ul>
            </button>
          )
        })}
      </section>

      <section className="max-w-3xl mx-auto px-4 mt-10 mb-4">
        <p className="mb-3 font-medium">Joining as: <span className="text-brand">{tier.name}</span></p>
        <CheckoutForm
          key={tier.id}
          kind="subscription"
          items={[{ id: tier.id, name: tier.name, price: tier.price, qty: 1 }]}
          total={tier.price}
        />
      </section>
    </>
  )
}
