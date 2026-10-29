import { useState } from 'react'
import { startCheckout, PAYMENT_API_URL } from '../lib/payments.js'
import { sendForm } from '../lib/forms.js'
import { orNull } from '../lib/db.js'
import { ugx } from '../lib/format.js'
import PaymentInstructions from './PaymentInstructions.jsx'

const field = 'w-full border border-ink/50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'

// kind: 'order' (store) or 'subscription' (membership)
// With a payment backend (VITE_PAYMENT_API_URL) this sends people to pay online.
// Without one it sends the details to the association as an application instead of a dead-end error.
export default function CheckoutForm({ kind, items, total, needsAddress = false, onSuccess }) {
  // Membership uses MOBA's published manual payment methods; checkout integrations remain for other purchases.
  const online = kind !== 'subscription' && Boolean(PAYMENT_API_URL)
  const [form, setForm] = useState({ name: '', phone: '', email: '', cohort: '', address: '', payment_method: '', payment_reference: '', payment_phone: '' })
  const [bot, setBot] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(null)

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (bot) { setDone({ fallback: false }); return } // honeypot filled: bot, pretend success
    setBusy(true)
    setMessage('')

    if (online) {
      const result = await startCheckout({ kind, customer: form, items, total })
      setBusy(false)
      if (!result.ok) setMessage(result.error)
      else onSuccess?.()
      return
    }

    const plan = items.map(i => i.name).join(', ')
    const result = await sendForm({
      subject: `MOBA membership application: ${plan}`,
      fromName: form.name,
      save: kind === 'subscription' && items.length === 1 ? {
        table: 'membership_applications',
        row: {
          plan_id: items[0].id,
          plan_name: items[0].name,
          amount_ugx: total,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          cohort: orNull(form.cohort),
          payment_method: orNull(form.payment_method),
          payment_reference: orNull(form.payment_reference),
          payment_phone: orNull(form.payment_phone),
        },
      } : undefined,
      fields: {
        Type: 'Membership application',
        Plan: plan,
        Amount: ugx(total),
        Name: form.name,
        Phone: form.phone,
        Email: form.email,
        Cohort: form.cohort,
        ...(kind === 'subscription' ? {
          'Payment method': form.payment_method,
          'Payment reference / transaction ID': form.payment_reference,
          'Payer phone (if different)': form.payment_phone,
        } : {}),
        ...(needsAddress ? { Address: form.address } : {}),
      },
    })
    setBusy(false)
    if (result.ok) { setDone(result); onSuccess?.() }
    else setMessage('We could not send your application. Please try again, or write to us from the Contact page.')
  }

  if (done) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-xl font-semibold text-brand">Thank you!</p>
        <p className="mt-2 text-ink/70">
          {done.fallback
            ? 'Your email app should have opened with your application. Please press Send so we receive it.'
            : kind === 'subscription'
              ? 'We have received your application and payment reference. MOBA will verify the payment and contact you to confirm your membership.'
              : 'We have received your application and will contact you with payment instructions.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg text-brand">Your details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" autoComplete="name" className={field} value={form.name} onChange={set('name')} />
        <input required type="tel" placeholder="Phone (Mobile Money)" autoComplete="tel" className={field} value={form.phone} onChange={set('phone')} />
        <input required type="email" placeholder="Email" autoComplete="email" className={field} value={form.email} onChange={set('email')} />
        <input required placeholder="Cohort (e.g. 2001)" className={field} value={form.cohort} onChange={set('cohort')} />
      </div>
      {kind === 'subscription' && <PaymentInstructions amount={total} />}
      {kind === 'subscription' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink">How did you pay?
            <select required className={field + ' mt-1 bg-white'} value={form.payment_method} onChange={set('payment_method')}>
              <option value="">Choose payment method</option>
              <option value="MTN MoMoPay">MTN MoMoPay</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Bank transfer">Bank transfer</option>
            </select>
          </label>
          <label className="text-sm font-medium text-ink">Transaction reference / ID
            <input required maxLength={100} placeholder="From your payment confirmation" className={field + ' mt-1'} value={form.payment_reference} onChange={set('payment_reference')} />
          </label>
          <label className="text-sm font-medium text-ink sm:col-span-2">Payer phone number <span className="font-normal text-ink/65">(if different from your contact number)</span>
            <input type="tel" maxLength={30} placeholder="Number used to make the payment" className={field + ' mt-1'} value={form.payment_phone} onChange={set('payment_phone')} />
          </label>
        </div>
      )}
      {needsAddress && (
        <input required placeholder="Delivery address" className={field} value={form.address} onChange={set('address')} />
      )}
      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)} className="hidden" aria-hidden="true" />
      <p className="text-sm text-ink/70">
        {online
          ? 'Pay with MTN MoMo, Airtel Money or card.'
          : kind === 'subscription'
            ? 'Submitting this form sends your membership application and payment reference to MOBA for manual verification.'
            : 'No payment is taken on this page. We will contact you with payment instructions.'}
      </p>
      {message && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{message}</p>}
      <button disabled={busy} className="w-full bg-brand text-white font-semibold py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
        {busy ? 'Please wait…' : online ? `Pay ${ugx(total)}` : kind === 'subscription' ? `Submit application & payment details · ${ugx(total)}` : `Send application · ${ugx(total)}`}
      </button>
    </form>
  )
}
