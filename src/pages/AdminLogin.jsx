import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { getRole } from '../lib/contentAdmin.js'

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
    const { role, error: roleError } = await getRole()
    if (roleError || !role) {
      await supabase.auth.signOut()
      setError(roleError ? 'Could not verify admin access. Apply the MOBA admin migration first.' : 'This account is not approved as a MOBA administrator or editor.')
      setBusy(false); return
    }
    navigate(role === 'editor' ? '/admin/content' : '/admin', { replace: true })
  }

  return <>
    <PageHeader eyebrow="Staff access" title="MOBA Admin" subtitle="Sign in with an administrator or editor account." />
    <section className="mx-auto max-w-md px-4 py-14 md:py-16">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-brand/10 bg-white p-6 shadow-sm md:p-8">
        {!isSupabaseConfigured && <p className="text-sm bg-gold/20 p-3 rounded">Supabase configuration is missing.</p>}
        <label className="block text-sm font-medium">Email<input required type="email" autoComplete="username" className={`${field} mt-1`} value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Password<input required type="password" autoComplete="current-password" className={`${field} mt-1`} value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</p>}
        <button disabled={busy || !isSupabaseConfigured} className="rounded-sm bg-gold px-6 py-3 font-semibold text-brand-dark transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="space-x-4"><Link className="text-brand underline" to="/member/login">Member login</Link><Link className="text-brand underline" to="/">Return to MOBA site</Link></p>
      </form>
    </section>
  </>
}
