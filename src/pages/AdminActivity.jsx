import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import EditorGate from '../components/admin/EditorGate.jsx'
import { supabase } from '../lib/supabase.js'
import { getRole } from '../lib/contentAdmin.js'
import { when } from '../lib/adminTables.js'
import { AREAS, actionLabel, actionTone, canRestore, contentDiff, pinProblem, tableLabel } from '../lib/audit.js'
import * as editors from '../lib/editors.js'

const PAGE = 50
const input = 'rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const btn = 'rounded-md px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50'
const primary = `${btn} bg-brand text-white hover:bg-brand-dark`
const outline = `${btn} border-2 border-brand text-brand hover:bg-brand hover:text-white`
const small = 'rounded-md border border-brand/40 px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'
const TONE = { danger: 'bg-red-100 text-red-800', notice: 'bg-gold/30 text-brand-dark', plain: 'bg-ink/10 text-ink' }

export default function AdminActivity() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('activity')

  // Same check as the other admin pages: a session AND a place on the administrator list.
  useEffect(() => {
    let live = true
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/admin/login', { replace: true }); return }
      const { role } = await getRole()
      if (!live) return
      if (role === 'editor') { navigate('/admin/content', { replace: true }); return }
      if (role !== 'admin') { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }); return }
      setUser(session.user)
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate('/admin/login', { replace: true }) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [navigate])

  async function signOut() { await editors.stopEditing(); await supabase.auth.signOut(); navigate('/admin/login', { replace: true }) }

  if (!user) return <><PageHeader variant="functional" title="Activity log" /><p className="mx-auto max-w-4xl px-4 py-12">Checking administrator access…</p></>

  return <EditorGate role="admin">
    <PageHeader variant="functional" title="Activity log" subtitle="Who changed what on the site, and when." />
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-xl border border-brand/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label="Activity log sections" className="flex flex-wrap gap-2">
            {[['activity', 'Activity'], ['editors', 'Editors']].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className={`rounded-md border-2 px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${tab === id ? 'border-brand bg-brand text-white' : 'border-brand/30 bg-white text-brand hover:border-brand'}`}>{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="text-brand underline">Submissions &amp; members</Link>
            <Link to="/admin/content" className="text-brand underline">Website content</Link>
            <button onClick={signOut} className={primary}>Sign out</button>
          </div>
        </div>
        <div className="mt-6">{tab === 'activity' ? <Activity /> : <Editors />}</div>
      </div>
    </section>
  </EditorGate>
}

function Activity() {
  const [areaId, setAreaId] = useState('all')
  const [person, setPerson] = useState('')
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState([])
  const [done, setDone] = useState(false)
  const [state, setState] = useState('loading')
  const [notice, setNotice] = useState('')
  const [open, setOpen] = useState(null)   // { id, data | null, error }
  const [message, setMessage] = useState('')
  const area = AREAS.find(a => a.id === areaId)

  const load = useCallback(async (append, before) => {
    setState('loading')
    const { data, error } = await editors.loadActivity({ area, person, search: search.trim(), before, size: PAGE })
    if (error) {
      setState('error')
      setNotice(/moba_audit_log|schema cache|does not exist/i.test(error.message)
        ? 'The activity log is not set up yet. Run supabase/migrations/202610310001_editor_audit_trail.sql in the Supabase SQL Editor, then reload this page.'
        : error.message)
      return
    }
    setNotice(''); setState('ready')
    setRows(prev => (append ? [...prev, ...data] : data))
    setDone(data.length < PAGE)
  }, [area, person, search])

  useEffect(() => { load(false) }, [load])
  useEffect(() => {
    editors.loadPeopleInLog().then(({ data }) => setPeople([...new Set((data || []).map(r => r.person_name))].sort((a, b) => a.localeCompare(b))))
  }, [])

  async function toggle(entry) {
    if (open?.id === entry.id) { setOpen(null); return }
    setOpen({ id: entry.id, data: null })
    if (entry.table_name !== 'site_content') return
    const { data, error } = await editors.loadVersions(entry.id)
    setOpen({ id: entry.id, data, error: error?.message })
  }

  async function restore(entry) {
    if (!window.confirm('Bring back the earlier version as a draft? Nothing goes live until someone publishes it.')) return
    const r = await editors.restoreVersion(entry.id)
    setMessage(r.message || (r.ok ? 'Restored.' : 'Could not restore.'))
    if (r.ok) load(false)
  }

  return <>
    <div className="flex flex-wrap items-center gap-3">
      <select aria-label="Filter by area" value={areaId} onChange={e => setAreaId(e.target.value)} className={input}>
        {AREAS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
      </select>
      <select aria-label="Filter by person" value={person} onChange={e => setPerson(e.target.value)} className={input}>
        <option value="">Everyone</option>
        {people.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <input type="search" aria-label="Search the log" placeholder="Search titles and names…" value={search} onChange={e => setSearch(e.target.value)} className={`${input} min-w-[14rem] flex-1`} />
      <button onClick={() => load(false)} className={outline}>Refresh</button>
    </div>
    {message && <p role="status" className="mt-4 rounded-md bg-green-50 px-4 py-3 text-green-900">{message}</p>}
    {notice && <p role="alert" className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">{notice}</p>}
    {state === 'ready' && !rows.length && <p className="mt-6 text-ink/70">Nothing has been logged here yet.</p>}

    <ul className="mt-6 divide-y divide-ink/10">
      {rows.map(r => (
        <li key={r.id} className="py-3">
          <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
            <div className="w-40 shrink-0 text-sm text-ink/65">{when(r.at)}</div>
            <div className="min-w-0 flex-1">
              <p>
                <strong>{r.person_name}</strong>{' '}
                <span className={`ml-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${TONE[actionTone(r.action)]}`}>{actionLabel(r.action)}</span>
              </p>
              <p className="mt-0.5 break-words text-sm text-ink/80">
                {r.table_name && <span className="text-ink/55">{tableLabel(r.table_name)}: </span>}{r.summary}
              </p>
              {r.changed_fields?.length > 0 && <p className="mt-0.5 text-xs text-ink/55">Changed: {r.changed_fields.join(', ')}</p>}
            </div>
            <div className="flex gap-2">
              {r.table_name === 'site_content' && <button onClick={() => toggle(r)} aria-expanded={open?.id === r.id} className={small}>{open?.id === r.id ? 'Hide' : 'Details'}</button>}
              {canRestore(r) && <button onClick={() => restore(r)} className={small}>Restore as draft</button>}
            </div>
          </div>
          {open?.id === r.id && <Detail open={open} />}
        </li>
      ))}
    </ul>
    {state === 'loading' && <p className="mt-4 text-ink/70">Loading…</p>}
    {state === 'ready' && !done && <button onClick={() => load(true, rows[rows.length - 1]?.id)} className={`${outline} mt-4`}>Show older entries</button>}
  </>
}

function Detail({ open }) {
  if (open.error) return <p className="mt-2 text-sm text-red-700">{open.error}</p>
  if (!open.data) return <p className="mt-2 text-sm text-ink/60">Loading…</p>
  const { lines, more } = contentDiff(open.data.old_data, open.data.new_data)
  if (!lines.length) return <p className="mt-2 text-sm text-ink/60">No wording changed in this entry.</p>
  return <div className="mt-3 overflow-x-auto rounded-md bg-ink/[0.04] p-3 text-sm">
    <table className="w-full min-w-[32rem] text-left">
      <thead><tr className="text-xs uppercase tracking-wide text-ink/55"><th className="pr-3 pb-1">Copy</th><th className="pr-3 pb-1">Field</th><th className="pr-3 pb-1">Before</th><th className="pb-1">After</th></tr></thead>
      <tbody>
        {lines.map((l, i) => (
          <tr key={`${l.side}-${l.field}-${i}`} className="align-top">
            <td className="pr-3 py-1 text-ink/65">{l.side === 'live' ? 'Website' : 'Draft'}</td>
            <td className="pr-3 py-1 font-semibold">{l.field}</td>
            <td className="pr-3 py-1 break-words text-red-800">{l.before || '—'}</td>
            <td className="py-1 break-words text-green-800">{l.after || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {more > 0 && <p className="mt-2 text-ink/60">…and {more} more changes.</p>}
  </div>
}

function Editors() {
  const [list, setList] = useState([])
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState({ ok: true, text: '' })
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [resetFor, setResetFor] = useState(null) // { id, pin }
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { editors: rows, error } = await editors.listEditors()
    if (error) { setState('error'); setMessage({ ok: false, text: error.message }); return }
    setList(rows); setState('ready')
  }, [])
  useEffect(() => { load() }, [load])

  async function run(promise, success) {
    setBusy(true)
    const r = await promise
    setBusy(false)
    setMessage({ ok: !!r.ok, text: r.ok ? success : (r.message || 'That did not work.') })
    if (r.ok) load()
    return r
  }

  async function add(e) {
    e.preventDefault()
    const bad = pinProblem(pin)
    if (bad) return setMessage({ ok: false, text: bad })
    const r = await run(editors.addEditor(name, pin), `${name.trim()} was added. Tell them to keep their PIN private.`)
    if (r.ok) { setName(''); setPin('') }
  }

  async function reset(e) {
    e.preventDefault()
    const bad = pinProblem(resetFor.pin)
    if (bad) return setMessage({ ok: false, text: bad })
    const r = await run(editors.resetEditorPin(resetFor.id, resetFor.pin), 'The PIN was changed. This reset is recorded in the log.')
    if (r.ok) setResetFor(null)
  }

  return <>
    <p className="text-sm text-ink/70">Everyone shares the admin login. These are the people who can be chosen as “the editor”. Each has a private PIN, and their name is saved with every change they make.</p>
    {message.text && <p role={message.ok ? 'status' : 'alert'} className={`mt-4 rounded-md px-4 py-3 ${message.ok ? 'bg-green-50 text-green-900' : 'border border-red-300 bg-red-50 text-red-800'}`}>{message.text}</p>}
    {state === 'loading' && <p className="mt-4 text-ink/70">Loading…</p>}

    <ul className="mt-5 divide-y divide-ink/10">
      {list.map(p => (
        <li key={p.id} className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold">{p.name}</span>
            {!p.active && <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-bold">Disabled</span>}
            {p.lockedUntil && new Date(p.lockedUntil) > new Date() && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">Locked after wrong PINs</span>}
            <span className="ml-auto flex gap-2">
              <button disabled={busy} onClick={() => setResetFor(resetFor?.id === p.id ? null : { id: p.id, pin: '' })} className={small}>Reset PIN</button>
              <button disabled={busy} onClick={() => run(editors.setEditorActive(p.id, !p.active), p.active ? `${p.name} was disabled.` : `${p.name} was enabled.`)} className={small}>{p.active ? 'Disable' : 'Enable'}</button>
            </span>
          </div>
          {resetFor?.id === p.id && (
            <form onSubmit={reset} className="mt-3 flex flex-wrap items-end gap-3">
              <label className="text-sm font-medium">New PIN for {p.name}
                <input required type="password" inputMode="numeric" autoComplete="new-password" value={resetFor.pin} onChange={e => setResetFor({ id: p.id, pin: e.target.value.replace(/\D/g, '') })} className={`${input} mt-1 block w-48`} />
              </label>
              <button disabled={busy} className={primary}>Save new PIN</button>
            </form>
          )}
        </li>
      ))}
    </ul>

    <form onSubmit={add} className="mt-6 flex flex-wrap items-end gap-3 rounded-md bg-ink/[0.04] p-4">
      <label className="text-sm font-medium">Name<input required minLength={2} maxLength={60} value={name} onChange={e => setName(e.target.value)} className={`${input} mt-1 block w-56`} /></label>
      <label className="text-sm font-medium">PIN (6 to 12 digits)<input required type="password" inputMode="numeric" autoComplete="new-password" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className={`${input} mt-1 block w-48`} /></label>
      <button disabled={busy} className={primary}>Add editor</button>
    </form>
    <p className="mt-3 text-sm text-ink/65">A PIN reset is recorded under the name of the person who did it, so a reset followed by a sign-in as that person shows up in the log. Anyone can change their own PIN from the bar at the top of the admin pages.</p>
  </>
}
