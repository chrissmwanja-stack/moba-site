import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { sendMessage } from '../lib/forms.js'

const topics = ['General enquiry', 'Update my details', 'Memorabilia', 'Projects and donations', 'Events', 'Nominate a prominent Mwirian', 'Contribute to the archives']
const field = 'w-full border border-ink/50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'

export default function Contact() {
  const { site } = useContent()
  // Links such as /contact?topic=Events open the form with that topic already chosen.
  const [params] = useSearchParams()
  const asked = params.get('topic')
  const [form, setForm] = useState({ name: '', email: '', topic: topics.includes(asked) ? asked : 'General enquiry', message: '' })
  const [bot, setBot] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await sendMessage({
      subject: `MOBA website: ${form.topic}`,
      name: form.name, email: form.email, topic: form.topic, message: form.message, botcheck: bot,
    })
    setBusy(false)
    if (r.ok) setDone(r)
    else setError(r.error)
  }

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Questions, updates to your details, or ideas for the association? Write to us." />
      <section className="max-w-5xl mx-auto px-4 mt-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-5 rounded-md bg-[#f4f5f7] p-6 md:p-7">
          <div>
            <p className="text-sm font-semibold text-gold-dark">Email</p>
            <p>{site.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold-dark">Postal address</p>
            <p>{site.fullName}</p>
            <p>{site.address}</p>
          </div>
          {site.phone && (
            <div>
              <p className="text-sm font-semibold text-gold-dark">Phone</p>
              <p>{site.phone}</p>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {done ? (
            <div className="bg-white rounded-md shadow-sm p-8 text-center">
              <p className="text-xl font-semibold text-brand">Thank you!</p>
              <p className="mt-2 text-ink/70">
                {done.fallback ? 'Your email app should have opened. Please press Send so we receive your message.'
                               : 'Your message has been sent. We will get back to you soon.'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white rounded-md border border-brand/10 p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className={field} value={form.name} onChange={set('name')} />
                <input required type="email" placeholder="Your email" className={field} value={form.email} onChange={set('email')} />
              </div>
              <select className={field} value={form.topic} onChange={set('topic')}>
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
              <textarea required rows={5} placeholder="Your message" className={field} value={form.message} onChange={set('message')} />
              <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)} className="hidden" aria-hidden="true" />
              {error && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{error}</p>}
              <button disabled={busy} className="bg-brand text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
                {busy ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
