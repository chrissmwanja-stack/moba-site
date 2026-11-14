import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../lib/siteContent.js'
import { sendMessage } from '../lib/forms.js'
import { supabase } from '../lib/supabase.js'
import { fetchMyMember } from '../lib/members.js'
import { CONTRIBUTION_ACCEPT, MAX_CONTRIBUTION_FILES, MAX_CONTRIBUTION_MB, checkContributionFiles, fileSize, submitContribution } from '../lib/contributions.js'

const topics = ['General enquiry', 'Update my details', 'Memorabilia', 'Projects and donations', 'Events', 'Nominate a prominent Mwirian', 'Share an article or photos', 'Contribute to the archives']
// On these topics members can attach files.
const fileTopics = ['Share an article or photos', 'Contribute to the archives']
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
  const [title, setTitle] = useState('')
  const [files, setFiles] = useState([])
  const [user, setUser] = useState(null)
  const [member, setMember] = useState(null)
  const picker = useRef(null)
  const set = k => e => setForm({ ...form, [k]: e.target.value })
  const wantsFiles = fileTopics.includes(form.topic)
  const canSend = Boolean(user && member?.status === 'active')

  // Signed-in members can attach files; their name and email are filled in from the register.
  useEffect(() => {
    if (!supabase) return undefined
    let live = true
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data?.session?.user
      if (!live || !u) return
      setUser(u)
      const { member: m } = await fetchMyMember(u.id)
      if (!live || !m) return
      setMember(m)
      setForm(f => ({ ...f, name: f.name || m.name || '', email: f.email || m.email || '' }))
    }).catch(() => {})
    return () => { live = false }
  }, [])

  function addFiles(e) {
    const chosen = Array.from(e.target.files || [])
    e.target.value = ''
    const problem = checkContributionFiles(files, chosen)
    if (problem) { setError(problem); return }
    setError('')
    setFiles(current => [...current, ...chosen])
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (wantsFiles && files.length > 0) {
      if (!canSend) { setError('Sign in with your member account to send files, or remove the files to send a message.'); return }
      setBusy(true)
      const sent = await submitContribution({ userId: user.id, title, message: form.message, files })
      setBusy(false)
      if (sent.ok) setDone({ contribution: true })
      else setError(sent.error)
      return
    }
    setBusy(true)
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
      <PageHeader title="Contact Us" subtitle="Questions, updates to your details, or ideas for the association? Write to us." image="/gallery/gate-2025.webp" position="50% 45%" />
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
                {done.contribution ? 'We have received your files. Our team will review them before anything is published on the website.'
                  : done.fallback ? 'Your email app should have opened. Please press Send so we receive your message.'
                               : 'Your message has been sent. We will get back to you soon.'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white rounded-md border border-brand/10 p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className={field} value={form.name} onChange={set('name')} />
                <input required type="email" placeholder="Your email" className={field} value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label htmlFor="contact-topic" className="mb-1 block text-sm font-semibold text-ink">Topic</label>
                <select id="contact-topic" className={field} value={form.topic} onChange={set('topic')}>
                  {topics.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {wantsFiles && (
                <div className="rounded-md border border-brand/20 bg-[#f4f5f7] p-4 space-y-3">
                  <p className="text-sm font-semibold text-ink">Share articles, photos or PDFs (members only)</p>
                  {!user ? (
                    <p className="text-sm text-ink/80">
                      <Link to="/member/login" className="font-semibold text-brand underline">Sign in to your member account</Link> to attach files. You can still send a message without files.
                    </p>
                  ) : member && member.status !== 'active' ? (
                    <p className="text-sm text-ink/80">Your membership is not active yet, so files cannot be attached. You can still send a message.</p>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="contribution-title" className="mb-1 block text-sm font-semibold text-ink">Title of your article or photos</label>
                        <input id="contribution-title" className={field} value={title} onChange={e => setTitle(e.target.value)} maxLength={150}
                          required={files.length > 0} placeholder="For example: Mwiri sports day, 1985" />
                      </div>
                      <div>
                        <input ref={picker} id="contribution-files" type="file" multiple accept={CONTRIBUTION_ACCEPT} onChange={addFiles} className="sr-only" />
                        <button type="button" onClick={() => picker.current?.click()} disabled={files.length >= MAX_CONTRIBUTION_FILES}
                          className="rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-50">
                          Choose files
                        </button>
                        <p className="mt-2 text-xs text-ink/70">JPG, PNG, WebP, PDF or Word (.docx). Up to {MAX_CONTRIBUTION_FILES} files, {MAX_CONTRIBUTION_MB} MB each. Only send what you have the right to share, and tell us who is in the photos and when they were taken.</p>
                      </div>
                      {files.length > 0 && (
                        <ul className="divide-y rounded-md bg-white">
                          {files.map((f, i) => (
                            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                              <span className="min-w-0 truncate">{f.name} <span className="text-ink/60">({fileSize(f.size)})</span></span>
                              <button type="button" onClick={() => setFiles(cur => cur.filter((_, j) => j !== i))} className="shrink-0 font-semibold text-red-700 underline" aria-label={`Remove ${f.name}`}>Remove</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
              <textarea required rows={5} placeholder={wantsFiles ? 'Tell us about what you are sharing: who, when, where' : 'Your message'} className={field} value={form.message} onChange={set('message')} />
              <input type="text" tabIndex={-1} autoComplete="off" value={bot} onChange={e => setBot(e.target.value)} className="hidden" aria-hidden="true" />
              {error && <p className="text-sm bg-gold/20 border border-gold rounded-md p-3">{error}</p>}
              <button disabled={busy} className="bg-brand text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-dark disabled:opacity-60">
                {busy ? (files.length ? 'Uploading…' : 'Sending…') : (wantsFiles && files.length ? 'Send files' : 'Send message')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
