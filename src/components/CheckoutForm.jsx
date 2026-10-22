import { useState } from 'react'
import { startCheckout } from '../lib/payments.js'
import { ugx } from '../lib/format.js'

const field = 'w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold'

// kind: 'order' (store) or 'subscription' (membership)
export default function CheckoutForm({ kind, items, total, needsAddress = false, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', cohort: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    const result = await startCheckout({ kind, customer: form, items, total })
    setBusy(false)
    if (!result.ok) setMessage(result.error)
    else onSuccess?.()
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg text-brand">Your details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" className={field} value={form.name} onChange={set('name')} />
        <input required placeholder="Phone (Mobile Money)" className={field} value={form.phone} onChange={set('phone')} />
        <input required type="email" placeholder="Email" className={field} value={form.email} onChange={set('email')} />
        <input required placeholder="Cohort / year left (e.g. 2001)" className={field} value={form.cohort} onChange={set('cohort')} />
      </div>
      {needsAddress && (
        <input required placeholder="Delivery address" className={field} value={form.address} onChange={set('address')} />
      )}
      <p className="text-sm text-ink/60">Pay with MTN MoMo, Airtel Money or card.</p>
      {message && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{message}</p>}
      <button disabled={busy} className="w-full bg-brand text-white font-semibold py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
        {busy ? 'Please wait…' : `Pay ${ugx(total)}`}
      </button>
    </form>
  )
}
