import { getSite } from './siteContent.js'
import { dbEnabled, insertRow, orNull } from './db.js'
import { notifyAdmin } from './forms.js'

// Orders are emailed to the admin through Web3Forms (no backend of our own).
// Put the access key in a .env.local file:  VITE_WEB3FORMS_KEY=your-key
// Without a key the site falls back to opening the customer's email app.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

export const newOrderRef = () => 'MOBA-' + Date.now().toString(36).toUpperCase().slice(-6)

function buildMessage(o) {
  const lines = o.items.map(i => `- ${i.qty} x ${i.name} @ UGX ${i.price.toLocaleString('en-UG')}`)
  return [
    `Order ${o.ref}`,
    '',
    ...lines,
    `Total: UGX ${o.total.toLocaleString('en-UG')} (PAY ON DELIVERY)`,
    '',
    `Name: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    `Email: ${o.customer.email}`,
    `Cohort: ${o.customer.cohort || '-'}`,
    `Delivery address: ${o.customer.address}`,
    `Notes: ${o.customer.notes || '-'}`,
  ].join('\n')
}

export async function submitOrder(order) {
  if (order.botcheck) return { ok: true } // honeypot filled: bot, pretend success
  const message = buildMessage(order)

  if (dbEnabled) {
    const c = order.customer
    const saved = await insertRow('orders', {
      ref: order.ref,
      name: c.name,
      phone: c.phone,
      email: c.email,
      cohort: orNull(c.cohort),
      address: c.address,
      notes: orNull(c.notes),
      items: order.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total_ugx: order.total,
    })
    if (saved.ok) {
      notifyAdmin({ subject: `New MOBA store order ${order.ref}`, from_name: c.name, name: c.name, email: c.email, message })
      return { ok: true }
    }
    // Not saved: fall through to the email path so the order is not lost.
  }

  if (!KEY) {
    const subject = encodeURIComponent(`New store order ${order.ref}`)
    window.location.href = `mailto:${getSite().orderEmail}?subject=${subject}&body=${encodeURIComponent(message)}`
    return { ok: true, fallback: true }
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject: `New MOBA store order ${order.ref}`,
        from_name: order.customer.name,
        name: order.customer.name,
        email: order.customer.email,
        message,
      }),
    })
    const data = await res.json()
    return data.success ? { ok: true } : { ok: false, error: 'We could not send your order. Please try again.' }
  } catch {
    return { ok: false, error: 'We could not reach the server. Check your connection and try again.' }
  }
}
