import { site } from '../data/content.js'
import { dbEnabled, insertRow } from './db.js'

// Same Web3Forms key as the store orders (VITE_WEB3FORMS_KEY in .env.local).
// Without a key the site opens the visitor's email app instead.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

// Tells the admin by email that something was saved. Best effort: the data is already in the database.
function notifyAdmin(payload) {
  if (!KEY) return
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: KEY, ...payload }),
    keepalive: true,
  }).catch(() => {})
}
export { notifyAdmin }

export async function sendMessage({ subject, name, email, message, topic, botcheck }) {
  if (botcheck) return { ok: true } // honeypot filled: bot
  if (dbEnabled) {
    const saved = await insertRow('contact_messages', { name, email, topic: topic || 'General enquiry', message })
    if (saved.ok) {
      notifyAdmin({ subject, from_name: name, name, email, message })
      return { ok: true }
    }
    // Not saved: fall through to email so the message is not lost.
  }
  if (!KEY) {
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}`
    return { ok: true, fallback: true }
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: KEY, subject, from_name: name, name, email, message }),
    })
    const data = await res.json()
    return data.success ? { ok: true } : { ok: false, error: 'We could not send your message. Please try again.' }
  } catch {
    return { ok: false, error: 'We could not reach the server. Check your connection and try again.' }
  }
}

// Multi-field form sender (used by the Update your details page).
// save: { table, row } stores the submission in Supabase first; if that fails, email is the fallback.
export async function sendForm({ subject, fromName, fields, fallbackEmail, save }) {
  if (save && dbEnabled) {
    const saved = await insertRow(save.table, save.row)
    if (saved.ok) {
      notifyAdmin({ subject, from_name: fromName, ...fields })
      return { ok: true, fallback: false }
    }
  }
  if (!KEY) {
    const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n')
    window.location.href = `mailto:${fallbackEmail || site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { ok: true, fallback: true }
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: KEY, subject, from_name: fromName, ...fields }),
    })
    const data = await res.json()
    return { ok: Boolean(data.success), fallback: false }
  } catch {
    return { ok: false, fallback: false }
  }
}
