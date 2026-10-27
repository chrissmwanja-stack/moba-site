import { supabase } from './supabase.js'

// Member numbers are stored as MWI-1995-HAN-023 and shown as MWI · 1995 · HAN · 023.
export const showNumber = n => (n ? n.replace(/-/g, ' · ') : '')

const today = () => new Date().toISOString().slice(0, 10)
export const isSubscribed = m => Boolean(m?.paid_until && m.paid_until >= today())

export const statusLabel = m => (m.status === 'active' ? (isSubscribed(m) ? 'Subscribed Member' : 'Member') : m.status)

export const longDate = iso =>
  new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// Supabase messages are written for developers; show members something they can act on.
export function friendlyAuthError(error) {
  const msg = (error?.message || '').toLowerCase()
  if (msg.includes('invalid login')) return 'That email and password do not match. Check them and try again, or reset your password.'
  if (msg.includes('not confirmed')) return 'Please confirm your email first: open the message we sent you and tap the link.'
  if (msg.includes('rate limit') || error?.status === 429) return 'Too many attempts. Please wait a few minutes and try again.'
  if (msg.includes('password')) return error.message
  return 'Something went wrong. Please try again.'
}

// The signed-in user's own register row (null if there is none yet).
export async function fetchMyMember(userId) {
  const { data, error } = await supabase.from('members').select('*').eq('user_id', userId).maybeSingle()
  return { member: data, error }
}
