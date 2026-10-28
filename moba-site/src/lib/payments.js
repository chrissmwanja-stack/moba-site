// Payments need a small server: PesaPal's secret keys must never sit in the browser.
// Set VITE_PAYMENT_API_URL in a .env file once the backend exists. It should expose
// POST /create-order that returns { redirect_url } (the PesaPal checkout page).
export const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL || ''

export async function startCheckout(payload) {
  if (!PAYMENT_API_URL) {
    return { ok: false, error: 'Online payment is not connected yet. Nothing has been charged.' }
  }
  try {
    const res = await fetch(`${PAYMENT_API_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return { ok: false, error: 'Could not start payment. Please try again.' }
    const data = await res.json()
    if (data.redirect_url) {
      window.location.href = data.redirect_url
      return { ok: true }
    }
    return { ok: false, error: 'Unexpected response from the payment service.' }
  } catch {
    return { ok: false, error: 'Could not reach the payment service. Please try again.' }
  }
}
