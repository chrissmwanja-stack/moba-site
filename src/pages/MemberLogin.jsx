import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import { houses } from '../data/content.js'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { friendlyAuthError } from '../lib/members.js'
import { orNull, toYear } from '../lib/db.js'

const field = 'w-full border border-ink/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const MIN_PASSWORD = 8

function Field({ label, hint, children }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1">{children}</div>
      {hint && <span className="block text-xs font-normal text-ink/60 mt-1">{hint}</span>}
    </label>
  )
}

export default function MemberLogin() {
  const [mode, setMode] = useState('signin') // signin | signup | forgot
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()

  // Already signed in: go straight to the account page.
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate('/member', { replace: true }) })
  }, [navigate])

  const switchTo = m => { setMode(m); setError(''); setNotice('') }

  async function submit(e) {
    e.preventDefault()
    if (!supabase) return setError('Sign-in is not available right now. Please try again later.')
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email')).trim()
    const password = String(f.get('password') || '')
    setBusy(true); setError(''); setNotice('')

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      setBusy(false)
      if (err) return setError(friendlyAuthError(err))
      navigate('/member', { replace: true })
      return
    }

    if (mode === 'forgot') {
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/member/reset` })
      setBusy(false)
      // Same message whether or not the email exists, so nobody can probe who is a member.
      return setNotice('If that email has an account, we have sent a link to choose a new password.')
    }

    // signup
    if (password.length < MIN_PASSWORD) { setBusy(false); return setError(`Use a password of at least ${MIN_PASSWORD} characters.`) }
    if (password !== String(f.get('confirm'))) { setBusy(false); return setError('The two passwords do not match.') }
    const cohort = toYear(f.get('cohort'))
    if (!cohort) { setBusy(false); return setError('Enter your cohort as a 4-digit year, for example 2001.') }
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/member`,
        data: {
          name: String(f.get('name')).trim(),
          phone: orNull(f.get('phone')),
          cohort: String(cohort),
          house: orNull(f.get('house')),
        },
      },
    })
    setBusy(false)
    if (err) return setError(friendlyAuthError(err))
    if (data.session) return navigate('/member', { replace: true }) // email confirmation switched off
    setNotice('Almost done. We have sent a confirmation link to your email. Open it, then sign in. The secretary will then verify your details and activate your card.')
    setMode('signin')
  }

  const title = { signin: 'Member login', signup: 'Create your member account', forgot: 'Reset your password' }[mode]

  return (
    <>
      <PageHeader eyebrow="Member portal"
        title={title}
        image="/gallery/mwiri-today/campus-main-entrance.webp"
        position="50% 55%"
        subtitle={mode === 'signup'
          ? 'Register once. After the secretary verifies your details you get your permanent MOBA number and digital card.'
          : 'Sign in to see your MOBA membership card.'}
      />
      <section className="mx-auto max-w-md px-4 py-14 md:py-16">
        {/* Staff sign-in lives here, off to the side, so the public header stays uncluttered */}
        <p className="mb-2 text-right text-sm"><Link to="/admin/login" className="font-medium text-brand/80 hover:text-brand hover:underline">Admin sign-in →</Link></p>
        {notice && <p role="status" className="mb-4 text-sm bg-gold/20 border border-gold p-3 rounded">{notice}</p>}
        <form onSubmit={submit} className="space-y-5 rounded-md border border-brand/10 bg-white p-6 shadow-sm md:p-8" key={mode}>
          {!isSupabaseConfigured && <p className="text-sm bg-gold/20 p-3 rounded">Sign-in is not available right now.</p>}

          {mode === 'signup' && <>
            <Field label="Full name"><input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} /></Field>
            <Field label="Phone (optional)"><input name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} /></Field>
            <Field label="Your cohort (year your class started S1)" hint="If your class started S1 in 2001 and finished S6 in 2006, your cohort is 2001.">
              <input name="cohort" required inputMode="numeric" maxLength={4} placeholder="e.g. 2001" className={field} />
            </Field>
            <Field label="Your house" hint="Used for your MOBA number. If you were in more than one, choose your first. Not sure? Leave it and the secretary will ask.">
              <select name="house" defaultValue="" className={field}>
                <option value="">Not sure / not listed</option>
                {houses.map(h => <option key={h}>{h}</option>)}
              </select>
            </Field>
          </>}

          <Field label="Email"><input name="email" required type="email" autoComplete={mode === 'signup' ? 'email' : 'username'} className={field} /></Field>

          {mode !== 'forgot' && (
            <Field label="Password" hint={mode === 'signup' ? `At least ${MIN_PASSWORD} characters.` : undefined}>
              <PasswordInput name="password" required minLength={mode === 'signup' ? MIN_PASSWORD : undefined}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={field} />
            </Field>
          )}
          {mode === 'signup' && (
            <Field label="Confirm password"><PasswordInput name="confirm" required autoComplete="new-password" className={field} /></Field>
          )}

          {mode === 'signup' && (
            <p className="text-xs text-ink/70">By creating an account you agree that MOBA keeps these details on the member register. See our <Link to="/privacy" className="underline text-brand">privacy notice</Link>.</p>
          )}

          {error && <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</p>}

          <button disabled={busy || !isSupabaseConfigured} className="w-full rounded-sm bg-gold px-6 py-3 font-semibold text-brand-dark transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto">
            {busy ? 'Please wait…' : { signin: 'Sign in', signup: 'Create account', forgot: 'Send reset link' }[mode]}
          </button>

          <div className="text-sm space-y-1 pt-1">
            {mode === 'signin' && <>
              <p><button type="button" onClick={() => switchTo('forgot')} className="text-brand underline">Forgot your password?</button></p>
              <p>New to the site? <button type="button" onClick={() => switchTo('signup')} className="text-brand underline font-medium">Create a member account</button></p>
            </>}
            {mode !== 'signin' && <p><button type="button" onClick={() => switchTo('signin')} className="text-brand underline">Back to sign in</button></p>}
          </div>
        </form>
      </section>
    </>
  )
}
