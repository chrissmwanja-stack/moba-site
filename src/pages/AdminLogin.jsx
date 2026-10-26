import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const field = 'w-full border border-ink/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    if (!supabase) return setError('Supabase is not configured. Add the VITE_SUPABASE variables and restart the site.')
    setBusy(true); setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setBusy(false); return }
    const { data, error: roleError } = await supabase.rpc('moba_is_admin')
    if (roleError || !data) {
      await supabase.auth.signOut()
      setError(roleError ? 'Could not verify admin access. Apply the MOBA admin migration first.' : 'This account is not approved as a MOBA administrator.')
      setBusy(false); return
    }
    navigate('/admin', { replace: true })
  }

  return <>
    <PageHeader title="MOBA Admin" subtitle="Sign in with an administrator account." />
    <section className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {!isSupabaseConfigured && <p className="text-sm bg-gold/20 p-3 rounded">Supabase configuration is missing.</p>}
        <label className="block text-sm font-medium">Email<input required type="email" autoComplete="username" className={`${field} mt-1`} value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Password<input required type="password" autoComplete="current-password" className={`${field} mt-1`} value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</p>}
        <button disabled={busy || !isSupabaseConfigured} className="bg-brand text-white font-semibold px-6 py-3 rounded-md disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p><Link className="text-brand underline" to="/">Return to MOBA site</Link></p>
      </form>
    </section>
  </>
}
