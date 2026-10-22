import { site } from '../data/content.js'

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
    `Cohort / year left: ${o.customer.cohort || '-'}`,
    `Delivery address: ${o.customer.address}`,
    `Notes: ${o.customer.notes || '-'}`,
  ].join('\n')
}

export async function submitOrder(order) {
  if (order.botcheck) return { ok: true } // honeypot filled: bot, pretend success
  const message = buildMessage(order)

  if (!KEY) {
    const subject = encodeURIComponent(`New store order ${order.ref}`)
    window.location.href = `mailto:${site.orderEmail}?subject=${subject}&body=${encodeURIComponent(message)}`
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
