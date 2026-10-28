import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import { supabase } from '../lib/supabase.js'
import { friendlyAuthError } from '../lib/members.js'

const field = 'w-full border border-ink/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'

// The link in the reset email lands here with a short-lived recovery session.
export default function MemberReset() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) { setChecked(true); return }
    const { data: listener } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') { setReady(true); setChecked(true) }
    })
    // The recovery session may already be established by the time we listen.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setReady(true)
      setChecked(true)
    }, 800)
    return () => { clearTimeout(t); listener.subscription.unsubscribe() }
  }, [])

  async function submit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const password = String(f.get('password'))
    if (password.length < 8) return setError('Use a password of at least 8 characters.')
    if (password !== String(f.get('confirm'))) return setError('The two passwords do not match.')
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) return setError(friendlyAuthError(err))
    navigate('/member', { replace: true })
  }

  return (
    <>
      <PageHeader variant="functional" title="Choose a new password" />
      <section className="max-w-md mx-auto px-4 py-12">
        {checked && !ready ? (
          <p className="bg-white rounded-lg shadow p-6">This reset link has expired or was already used. <Link to="/member/login" className="underline text-brand">Request a new one</Link>.</p>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <label className="block text-sm font-medium">New password<PasswordInput name="password" required minLength={8} autoComplete="new-password" wrapperClassName="mt-1" className={field} /></label>
            <label className="block text-sm font-medium">Confirm new password<PasswordInput name="confirm" required autoComplete="new-password" wrapperClassName="mt-1" className={field} /></label>
            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</p>}
            <button disabled={busy || !ready} className="bg-brand text-white font-semibold px-6 py-3 rounded-md disabled:opacity-60">{busy ? 'Saving…' : 'Save password'}</button>
          </form>
        )}
      </section>
    </>
  )
}
