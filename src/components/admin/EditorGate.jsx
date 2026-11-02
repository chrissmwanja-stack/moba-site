import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../PageHeader.jsx'
import PasswordInput from '../PasswordInput.jsx'
import { addEditor, changeMyPin, currentEditor, editorChoices, startEditing, stopEditing } from '../../lib/editors.js'
import { pinProblem } from '../../lib/audit.js'

const field = 'w-full border border-ink/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const primary = 'rounded-md bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50'
const IDLE_MS = 30 * 60 * 1000   // forget who is editing after 30 quiet minutes, so a name is not left on a shared screen
const CHECK_MS = 60 * 1000       // and re-check with the database once a minute (it also ends sessions after 8 hours)

// Everyone shares one admin login, so after signing in each person says who they are. The choice is
// kept by the database for this browser sign-in and stamped on every change in the activity log.
// If the audit migration is not applied yet, this component simply shows the page as before.
export default function EditorGate({ role, children }) {
  const [phase, setPhase] = useState('checking') // checking | off | choose | setup | ready
  const [person, setPerson] = useState(null)
  const [people, setPeople] = useState([])
  const [skipped, setSkipped] = useState(false)
  const lastActive = useRef(Date.now())

  const refresh = useCallback(async () => {
    const now = await currentEditor()
    if (!now.installed) { setPhase('off'); return }
    if (now.person) { setPerson(now.person); setPhase('ready'); return }
    setPerson(null)
    const { people: list, error } = await editorChoices()
    if (error) { setPhase('off'); return }
    setPeople(list)
    // Until the first editor exists nothing is enforced, so editors are let through and admins are invited to set up.
    setPhase(list.length ? 'choose' : role === 'admin' ? 'setup' : 'off')
  }, [role])

  useEffect(() => { refresh() }, [refresh])

  // While editing: end the session after a quiet spell, and notice if the database ended it.
  useEffect(() => {
    if (phase !== 'ready') return undefined
    const touch = () => { lastActive.current = Date.now() }
    const events = ['pointerdown', 'keydown', 'scroll']
    events.forEach(e => window.addEventListener(e, touch, { passive: true }))
    const timer = setInterval(async () => {
      if (Date.now() - lastActive.current > IDLE_MS) { await stopEditing(); refresh() } else refresh()
    }, CHECK_MS)
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => { events.forEach(e => window.removeEventListener(e, touch)); clearInterval(timer); window.removeEventListener('focus', onFocus) }
  }, [phase, refresh])

  async function switchPerson() { await stopEditing(); await refresh() }

  if (phase === 'checking') return <><PageHeader variant="functional" title="MOBA Administration" /><p className="max-w-4xl mx-auto px-4 py-12">Checking who is editing…</p></>
  if (phase === 'choose') return <Choose people={people} onDone={refresh} />
  if (phase === 'setup' && !skipped) return <Setup onDone={refresh} onSkip={() => setSkipped(true)} />
  if (phase !== 'ready') return children
  return <>
    <EditingBar person={person} role={role} onSwitch={switchPerson} />
    {children}
  </>
}

function Choose({ people, onDone }) {
  const [id, setId] = useState(people[0]?.id || '')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const r = await startEditing(id, pin)
    setBusy(false)
    if (!r.ok) { setError(r.message || 'Could not start editing.'); setPin(''); return }
    onDone()
  }

  return <>
    <PageHeader variant="functional" title="Who is editing?" subtitle="Everyone shares one login, so choose your name and enter your own PIN. Your name is saved with every change you make." />
    <section className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-brand/10 bg-white p-6 shadow-sm md:p-8">
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium">Your name</legend>
          {people.map(p => (
            <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-md border-2 px-3 py-2.5 ${id === p.id ? 'border-brand bg-brand/5' : 'border-ink/15 hover:border-brand/50'}`}>
              <input type="radio" name="editor" value={p.id} checked={id === p.id} onChange={() => { setId(p.id); setError('') }} className="accent-brand" />
              <span className="font-semibold">{p.name}</span>
            </label>
          ))}
        </fieldset>
        <label className="block text-sm font-medium">Your PIN
          <PasswordInput required inputMode="numeric" autoComplete="off" wrapperClassName="mt-1" className={field} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
        </label>
        {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy || !id || !pin} className={primary}>{busy ? 'Please wait…' : 'Start editing'}</button>
        <p className="text-sm text-ink/65">Forgot your PIN? Ask another administrator to reset it from the Activity page.</p>
      </form>
    </section>
  </>
}

// First-time set-up: the administrator adds themselves as the first editor.
function Setup({ onDone, onSkip }) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [again, setAgain] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setError('')
    const bad = pinProblem(pin)
    if (bad) return setError(bad)
    if (pin !== again) return setError('The two PINs do not match.')
    setBusy(true)
    const added = await addEditor(name, pin)
    if (!added.ok) { setBusy(false); setError(added.message || 'Could not add the editor.'); return }
    const started = await startEditing(added.person_id, pin)
    setBusy(false)
    if (!started.ok) { setError(started.message || 'The editor was added but could not start.'); return }
    onDone()
  }

  return <>
    <PageHeader variant="functional" title="Set up the activity log" subtitle="Create the first editor. After that, each person who edits the site gets a name and a private PIN." />
    <section className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-brand/10 bg-white p-6 shadow-sm md:p-8">
        <label className="block text-sm font-medium">Your name<input required minLength={2} maxLength={60} className={`${field} mt-1`} value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-sm font-medium">Choose a PIN (6 to 12 digits)
          <PasswordInput required inputMode="numeric" autoComplete="new-password" wrapperClassName="mt-1" className={field} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
        </label>
        <label className="block text-sm font-medium">Type the PIN again
          <PasswordInput required inputMode="numeric" autoComplete="new-password" wrapperClassName="mt-1" className={field} value={again} onChange={e => setAgain(e.target.value.replace(/\D/g, ''))} />
        </label>
        {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={busy} className={primary}>{busy ? 'Please wait…' : 'Create and start editing'}</button>
          <button type="button" onClick={onSkip} className="text-brand underline">Not now</button>
        </div>
        <p className="text-sm text-ink/65">Until the first editor exists, changes are still logged, but as “Nobody chosen yet”. You can add the other editors later on the Activity page.</p>
      </form>
    </section>
  </>
}

function EditingBar({ person, role, onSwitch }) {
  const [open, setOpen] = useState(false)
  return <div className="bg-brand-dark text-sm text-white">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2">
      <span>Editing as <strong>{person.name}</strong></span>
      <button onClick={onSwitch} className="underline hover:text-gold">Not you? Switch</button>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="underline hover:text-gold">Change my PIN</button>
      {role === 'admin' && <Link to="/admin/activity" className="underline hover:text-gold sm:ml-auto">Activity log</Link>}
    </div>
    {open && <ChangePin onClose={() => setOpen(false)} />}
  </div>
}

function ChangePin({ onClose }) {
  const [oldPin, setOldPin] = useState('')
  const [pin, setPin] = useState('')
  const [again, setAgain] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ ok: false, text: '' })

  async function submit(e) {
    e.preventDefault()
    const bad = pinProblem(pin)
    if (bad) return setMsg({ ok: false, text: bad })
    if (pin !== again) return setMsg({ ok: false, text: 'The two new PINs do not match.' })
    setBusy(true)
    const r = await changeMyPin(oldPin, pin)
    setBusy(false)
    if (!r.ok) return setMsg({ ok: false, text: r.message || 'Could not change the PIN.' })
    setMsg({ ok: true, text: 'Your PIN was changed.' }); setOldPin(''); setPin(''); setAgain('')
  }

  const small = 'w-36 rounded-md border border-white/30 bg-white px-2 py-1.5 text-ink focus:outline-none focus:ring-2 focus:ring-gold'
  return <form onSubmit={submit} className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-4 pb-3">
    <label className="text-xs">Current PIN<input required type="password" inputMode="numeric" autoComplete="off" className={`${small} mt-1 block`} value={oldPin} onChange={e => setOldPin(e.target.value.replace(/\D/g, ''))} /></label>
    <label className="text-xs">New PIN<input required type="password" inputMode="numeric" autoComplete="new-password" className={`${small} mt-1 block`} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} /></label>
    <label className="text-xs">New PIN again<input required type="password" inputMode="numeric" autoComplete="new-password" className={`${small} mt-1 block`} value={again} onChange={e => setAgain(e.target.value.replace(/\D/g, ''))} /></label>
    <button disabled={busy} className="rounded-md bg-gold px-4 py-1.5 font-semibold text-brand-dark disabled:opacity-50">{busy ? 'Saving…' : 'Save PIN'}</button>
    <button type="button" onClick={onClose} className="underline">Close</button>
    {msg.text && <p role={msg.ok ? 'status' : 'alert'} className={`w-full text-sm ${msg.ok ? 'text-green-200' : 'text-red-200'}`}>{msg.text}</p>}
  </form>
}
