import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import { tiers } from '../data/content.js'
import { ugx } from '../lib/format.js'

export default function Membership() {
  const [selected, setSelected] = useState(tiers[0].id)
  const tier = tiers.find(t => t.id === selected)

  return (
    <>
      <PageHeader title="Membership" subtitle="Stay connected and support the association. Choose a plan and pay online." />
      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className={`text-left bg-white rounded-lg shadow p-6 border-2 transition ${selected === t.id ? 'border-gold' : 'border-transparent hover:border-gold/50'}`}>
            <h3 className="font-semibold text-lg text-brand">{t.name}</h3>
            <p className="mt-2 text-3xl font-bold">{ugx(t.price)}<span className="text-sm font-normal text-ink/60"> / {t.period}</span></p>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              {t.perks.map(p => <li key={p}>✓ {p}</li>)}
            </ul>
          </button>
        ))}
      </section>
      <section className="max-w-2xl mx-auto px-4 mt-10">
        <p className="mb-3 font-medium">Joining as: <span className="text-brand">{tier.name}</span></p>
        <CheckoutForm kind="subscription"
          items={[{ id: tier.id, name: tier.name, price: tier.price, qty: 1 }]}
          total={tier.price} />
      </section>
    </>
  )
}
