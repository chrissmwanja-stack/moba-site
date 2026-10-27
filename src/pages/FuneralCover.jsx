import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { site, funeralCover as cover } from '../data/content.js'
import { sendForm } from '../lib/forms.js'
import { orNull } from '../lib/db.js'
import { ugx } from '../lib/format.js'

const field =
  'w-full rounded-md border border-brand/60 bg-white px-3 py-2.5 text-brand-dark ' +
  'placeholder:text-brand-dark/65 focus:border-brand focus:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-brand'

const blankDependant = { name: '', relationship: '', born: '' }

function Field({ label, hint, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-dark">
        {label}
        {required && <span className="text-gold-dark"> (required)</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-brand-dark/70">{hint}</span>}
      {error && <p role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </label>
  )
}

export default function FuneralCover() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', cohort: '', kinName: '', kinPhone: '', consent: false,
  })
  const [dependants, setDependants] = useState([])
  const [bot, setBot] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [fallback, setFallback] = useState(false)

  const set = k => e => setForm({ ...form, [k]: e.target.value })
  const setDep = (i, k) => e =>
    setDependants(d => d.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))
  const addDep = () => setDependants(d => (d.length < cover.maxDependants ? [...d, { ...blankDependant }] : d))
  const removeDep = i => setDependants(d => d.filter((_, j) => j !== i))

  const premiumText = cover.premium
    ? `${ugx(cover.premium)} per ${cover.period}`
    : 'Announced on enrolment'

  async function onSubmit(e) {
    e.preventDefault()
    if (bot) { setStatus('done'); return } // honeypot filled: bot, pretend success

    const next = {}
    if (!form.name.trim()) next.name = 'Enter your full name.'
    if (!form.phone.trim()) next.phone = 'Enter the phone number you use for Mobile Money.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter an email address we can reach you on.'
    if (!form.kinName.trim()) next.kinName = 'Enter your next of kin.'
    if (!form.kinPhone.trim()) next.kinPhone = 'Enter your next of kin’s phone number.'
    if (!form.consent) next.consent = 'Please confirm you agree before sending.'

    const filled = dependants.filter(d => d.name.trim() || d.relationship.trim() || d.born.trim())
    if (filled.some(d => !d.name.trim() || !d.relationship.trim())) {
      next.dependants = 'Each dependant needs a name and a relationship, or remove the row.'
    }
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    const res = await sendForm({
      subject: `${cover.name} enrolment: ${form.name}`,
      fromName: form.name,
      fallbackEmail: cover.contactEmail || site.email,
      save: {
        table: 'funeral_enrolments',
        row: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          cohort: orNull(form.cohort),
          kin_name: form.kinName.trim(),
          kin_phone: form.kinPhone.trim(),
          dependants: filled.map(d => ({ name: d.name.trim(), relationship: d.relationship.trim(), born: d.born.trim() })),
          consent: true,
        },
      },
      fields: {
        Type: `${cover.name} enrolment`,
        Contribution: premiumText,
        'Full name': form.name,
        Phone: form.phone,
        Email: form.email,
        Cohort: form.cohort || '-',
        'Next of kin': `${form.kinName} (${form.kinPhone})`,
        'Dependants to cover': filled.length
          ? filled.map((d, i) => `${i + 1}. ${d.name} - ${d.relationship}${d.born ? `, born ${d.born}` : ''}`).join(' | ')
          : 'None',
        'Agreed to privacy notice': 'Yes',
      },
    })
    setFallback(Boolean(res.fallback))
    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold text-brand">Thank you. We have your enrolment.</h1>
        <p className="mt-4 text-lg text-brand-dark/80">
          {fallback
            ? 'Your email app should have opened with your enrolment. Please press Send so we receive it. '
            : 'The scheme secretary will confirm your details and send you payment instructions. '}
          Your cover is not active until your payment has been confirmed.
        </p>
        <Link to="/membership" className="mt-8 inline-block font-semibold text-gold-dark underline">
          Back to membership
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={cover.name}
        subtitle="Enrol yourself and the family members you want covered. No payment is taken on this page: we will send you Mobile Money payment instructions."
      />

      <section className="max-w-3xl mx-auto px-4 mt-10" aria-label="Scheme summary">
        <dl className="bg-white rounded-lg shadow p-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink/70">Contribution</dt>
            <dd className="text-xl font-bold text-brand">{premiumText}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/70">How you pay</dt>
            <dd className="font-medium">{cover.paymentNote}</dd>
          </div>
          {cover.payout && (
            <div>
              <dt className="text-sm text-ink/70">Payout</dt>
              <dd className="font-medium">{cover.payout}</dd>
            </div>
          )}
          {cover.waitingPeriod && (
            <div>
              <dt className="text-sm text-ink/70">Waiting period</dt>
              <dd className="font-medium">{cover.waitingPeriod}</dd>
            </div>
          )}
        </dl>
      </section>

      <form onSubmit={onSubmit} noValidate className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* honeypot: hidden from people, bots fill it */}
        <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)} className="hidden" aria-hidden="true" />

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-brand mb-2">About you</legend>
          <Field label="Full name" required error={errors.name}>
            <input autoComplete="name" className={field} value={form.name} onChange={set('name')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone (Mobile Money)" required error={errors.phone} hint="Include the country code, for example +256.">
              <input type="tel" autoComplete="tel" className={field} value={form.phone} onChange={set('phone')} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" autoComplete="email" className={field} value={form.email} onChange={set('email')} />
            </Field>
          </div>
          <Field label="Cohort" hint="The year your class started S1, for example 2001.">
            <input inputMode="numeric" maxLength={4} className={field} value={form.cohort} onChange={set('cohort')} />
          </Field>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-brand mb-2">Next of kin</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required error={errors.kinName}>
              <input className={field} value={form.kinName} onChange={set('kinName')} />
            </Field>
            <Field label="Phone" required error={errors.kinPhone}>
              <input type="tel" className={field} value={form.kinPhone} onChange={set('kinPhone')} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-brand mb-2">Dependants to cover (optional)</legend>
          <p className="text-sm text-brand-dark/70">
            You can add up to {cover.maxDependants}, for example a spouse, children or parents.
          </p>
          {dependants.map((d, i) => (
            <div key={i} className="rounded-md border border-brand/20 bg-white p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <input aria-label={`Dependant ${i + 1} name`} placeholder="Full name" className={field} value={d.name} onChange={setDep(i, 'name')} />
                <input aria-label={`Dependant ${i + 1} relationship`} placeholder="Relationship (e.g. Spouse)" className={field} value={d.relationship} onChange={setDep(i, 'relationship')} />
                <input aria-label={`Dependant ${i + 1} year of birth`} inputMode="numeric" maxLength={4} placeholder="Year of birth" className={field} value={d.born} onChange={setDep(i, 'born')} />
              </div>
              <button type="button" onClick={() => removeDep(i)} className="text-sm font-semibold text-gold-dark underline">
                Remove dependant {i + 1}
              </button>
            </div>
          ))}
          {errors.dependants && <p role="alert" className="text-sm text-red-700">{errors.dependants}</p>}
          {dependants.length < cover.maxDependants && (
            <button type="button" onClick={addDep} className="rounded-md border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand hover:text-white">
              + Add a dependant
            </button>
          )}
        </fieldset>

        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 accent-brand" />
            <span className="text-brand-dark">
              I confirm the details above are correct, and that MOBA may keep them, including the
              details of the people I have listed, to run the scheme, as described in the{' '}
              <Link to="/privacy" className="font-semibold text-gold-dark underline">privacy notice</Link>.
            </span>
          </label>
          {errors.consent && <p role="alert" className="mt-1 text-sm text-red-700">{errors.consent}</p>}
        </div>

        {status === 'error' && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
            We could not send your enrolment. Check your connection and try again, or write to us from the{' '}
            <Link to="/contact" className="font-semibold underline">Contact page</Link>.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send enrolment'}
        </button>
      </form>
    </>
  )
}
