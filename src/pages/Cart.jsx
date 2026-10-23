import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import OrderForm from '../components/OrderForm.jsx'
import { useCart } from '../context/CartContext.jsx'
import { ugx } from '../lib/format.js'

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart()
  const [placed, setPlaced] = useState(null)

  if (placed) {
    return (
      <>
        <PageHeader title="Order received" />
        <section className="max-w-2xl mx-auto px-4 mt-10 text-center">
          <p className="text-lg">Thank you! Your order reference is</p>
          <p className="text-3xl font-bold text-brand mt-2">{placed.ref}</p>
          <p className="mt-4 text-ink/70">
            {placed.fallback
              ? 'Your email app should have opened with the order. Please press Send so we receive it.'
              : 'We have received your order and will call you to confirm delivery. You pay on delivery.'}
          </p>
          <Link to="/store" className="inline-block mt-6 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md">Back to the store</Link>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Your Cart" />
      <section className="max-w-4xl mx-auto px-4 mt-10">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink/70">Your cart is empty.</p>
            <Link to="/store" className="inline-block mt-4 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md">Browse the store</Link>
          </div>
        ) : (
          <div className="space-y-8">
            <ul className="bg-white rounded-lg shadow divide-y">
              {items.map(i => (
                <li key={i.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-ink/70">{ugx(i.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 rounded border">−</button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 rounded border">+</button>
                    <button onClick={() => remove(i.id)} className="text-sm text-red-700 ml-2">Remove</button>
                  </div>
                </li>
              ))}
              <li className="p-4 flex justify-between font-bold">
                <span>Total (pay on delivery)</span><span className="text-brand">{ugx(total)}</span>
              </li>
            </ul>
            <OrderForm items={items} total={total} onSuccess={r => { setPlaced(r); clear() }} />
          </div>
        )}
      </section>
    </>
  )
}
