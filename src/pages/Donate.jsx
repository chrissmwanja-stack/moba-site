import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { ugx } from '../lib/format.js'
import { sendMessage } from '../lib/forms.js'

const field = 'w-full border border-ink/50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const ANYWHERE = 'Wherever it is needed most'

export default function Donate() {
  const { site, projects } = useContent()
  const causes = projects.filter(p => p.status === 'Ongoing')
  const [params] = useSearchParams()
  const asked = params.get('project')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', amount: '', note: '',
    project: causes.some(c => c.title === asked) ? asked : ANYWHERE,
  })
  const [bot, setBot] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const set = k => e => setForm({ ...form, [k]: e.target.value })
  const pick = title => setForm(f => ({ ...f, project: title }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const amount = parseInt(String(form.amount).replace(/\D/g, ''), 10)
    const message = [
      'Donation pledge (no payment taken on the website).',
      `Project: ${form.project}`,
      `Amount: ${amount > 0 ? ugx(amount) : 'not stated'}`,
      `Phone: ${form.phone || 'not given'}`,
      form.note ? `Note: ${form.note}` : '',
    ].filter(Boolean).join('\n')
    const r = await sendMessage({
      subject: 'MOBA website: Donation pledge',
      name: form.name, email: form.email, topic: 'Donation pledge', message, botcheck: bot,
    })
    setBusy(false)
    if (r.ok) setDone(r)
    else setError(r.error)
  }

  return (
    <>
      <PageHeader title="Donate" subtitle="Give to the Mwiri we want. Every gift goes to projects that serve the school and the brotherhood." />

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-xl font-bold text-brand">Where your gift can go</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Choose a project">
          {[{ title: ANYWHERE, summary: 'Let the executive direct your gift to the greatest need.' }, ...causes].map(c => {
            const on = form.project === c.title
            return (
              <button
                key={c.title}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pick(c.title)}
                className={`rounded-lg border-2 bg-white p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? 'border-gold shadow' : 'border-brand/15 hover:border-brand/40'}`}
              >
                <span className="block font-semibold text-brand">{c.title}</span>
                <span className="mt-1 block text-sm text-ink/75">{c.summary}</span>
                {c.goal != null && (
                  <span className="mt-2 block text-sm text-ink/80">
                    {c.raised != null ? <>Raised <strong>{ugx(c.raised)}</strong> of </> : <>Funding needed: </>}
                    <strong>{ugx(c.goal)}</strong>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-sm text-ink/75">See the full story of each on the <Link to="/projects" className="font-medium text-brand underline">Projects</Link> page.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-brand">How to give</h2>
            {site.donate?.length > 0 ? (
              <div className="mt-3 space-y-4">
                {site.donate.map(m => (
                  <div key={m.label} className="rounded-lg border border-brand/15 bg-white p-4">
                    <p className="font-semibold text-brand">{m.label}</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-ink/80">{m.lines.map(l => <li key={l}>{l}</li>)}</ul>
                  </div>
                ))}
                <p className="text-sm text-ink/75">After giving, send us a pledge so we can thank you and record your gift against the right project.</p>
              </div>
            ) : (
              <p className="mt-3 text-ink/80">
                We do not take payments on the website. Tell us what you would like to give and to which project. An officer of the association will contact you with the official account details and send a receipt once your gift arrives.
              </p>
            )}
          </div>
          <p className="text-sm text-ink/75">
            Prefer to give by buying something? See the <Link to="/store" className="font-medium text-brand underline">memorabilia store</Link>. Questions about giving? <Link to="/contact?topic=Projects and donations" className="font-medium text-brand underline">Contact us</Link>.
          </p>
        </div>

        <div className="md:col-span-3">
          {done ? (
            <div role="status" className="rounded-lg border border-gold bg-gold/15 p-6">
              <h2 className="text-xl font-bold text-brand">Thank you</h2>
              <p className="mt-2 text-ink/80">
                {done.fallback ? 'Your email app should have opened. Please press Send so we receive your pledge.'
                               : 'Your pledge has been received. We will be in touch soon with the next steps.'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-brand">Make a pledge</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required aria-label="Your name" placeholder="Your name" className={field} value={form.name} onChange={set('name')} />
                <input required type="email" aria-label="Your email" placeholder="Your email" className={field} value={form.email} onChange={set('email')} />
                <input type="tel" aria-label="Phone (optional)" placeholder="Phone (optional)" className={field} value={form.phone} onChange={set('phone')} />
                <input inputMode="numeric" aria-label="Amount in UGX (optional)" placeholder="Amount in UGX (optional)" className={field} value={form.amount} onChange={set('amount')} />
              </div>
              <label className="block text-sm font-medium text-ink/80">
                Project
                <select className={`${field} mt-1`} value={form.project} onChange={set('project')}>
                  <option>{ANYWHERE}</option>
                  {causes.map(c => <option key={c.title}>{c.title}</option>)}
                </select>
              </label>
              <textarea rows={3} aria-label="Note (optional)" placeholder="Anything you would like us to know (optional)" className={field} value={form.note} onChange={set('note')} />
              <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)} className="hidden" aria-hidden="true" />
              {error && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{error}</p>}
              <button disabled={busy} className="bg-brand text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
                {busy ? 'Sending…' : 'Send my pledge'}
              </button>
              <p className="text-xs text-ink/70">A pledge is a promise, not a payment. Nothing is charged through this website.</p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
