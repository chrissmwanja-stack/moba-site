import { useState } from 'react'
import { submitOrder, newOrderRef } from '../lib/orders.js'
import { ugx } from '../lib/format.js'

const field = 'w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold'

export default function OrderForm({ items, total, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', cohort: '', address: '', notes: '' })
  const [bot, setBot] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const order = { ref: newOrderRef(), items, total, customer: form, botcheck: bot }
    const result = await submitOrder(order)
    setBusy(false)
    if (result.ok) onSuccess({ ref: order.ref, fallback: !!result.fallback })
    else setError(result.error)
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg text-brand">Delivery details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" className={field} value={form.name} onChange={set('name')} />
        <input required placeholder="Phone (we'll call to confirm)" className={field} value={form.phone} onChange={set('phone')} />
        <input required type="email" placeholder="Email" className={field} value={form.email} onChange={set('email')} />
        <input placeholder="Cohort / year left (optional)" className={field} value={form.cohort} onChange={set('cohort')} />
      </div>
      <input required placeholder="Delivery address / area" className={field} value={form.address} onChange={set('address')} />
      <textarea placeholder="Notes (sizes, colours, preferred delivery time)" rows={3} className={field} value={form.notes} onChange={set('notes')} />
      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)}
        className="hidden" aria-hidden="true" />
      <p className="text-sm text-ink/70">No online payment. You pay <strong>on delivery</strong>.</p>
      {error && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{error}</p>}
      <button disabled={busy} className="w-full bg-brand text-white font-semibold py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
        {busy ? 'Sending…' : `Place order · ${ugx(total)} on delivery`}
      </button>
    </form>
  )
}
