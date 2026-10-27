import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { supabase } from '../lib/supabase.js'
import { TABS, toCsv, when } from '../lib/adminTables.js'
import { houses } from '../data/content.js'
import { getRole } from '../lib/contentAdmin.js'

const LIMIT = 500

export default function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null) // null while checking
  const [tabId, setTabId] = useState(TABS[0].id)
  const [rows, setRows] = useState({}) // { [tabId]: row[] }
  const [counts, setCounts] = useState({}) // new (unread) per tab
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [state, setState] = useState('loading') // loading | ready | error
  const [notice, setNotice] = useState('')
  const tab = TABS.find(t => t.id === tabId)

  // Sign-in check: a session AND a place on the admin allowlist.
  useEffect(() => {
    let live = true
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/admin/login', { replace: true }); return }
      const { role } = await getRole()
      if (!live) return
      if (role === 'editor') { navigate('/admin/content', { replace: true }); return } // editors manage content only
      if (role !== 'admin') { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }); return }
      setUser(session.user)
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate('/admin/login', { replace: true }) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [navigate])

  const loadCounts = useCallback(async () => {
    const out = {}
    await Promise.all(TABS.map(async t => {
      const { count } = await supabase.from(t.table).select('id', { count: 'exact', head: true }).eq('status', t.newStatus || 'new')
      out[t.id] = count || 0
    }))
    setCounts(out)
  }, [])

  const load = useCallback(async t => {
    setState('loading')
    const { data, error } = await supabase.from(t.table).select('*').order('created_at', { ascending: false }).limit(LIMIT)
    if (error) { setState('error'); setNotice(error.message); return }
    setRows(r => ({ ...r, [t.id]: data }))
    setState('ready'); setNotice('')
  }, [])

  useEffect(() => { if (user) { load(tab); loadCounts() } }, [user, tab, load, loadCounts])

  const current = rows[tabId] || []
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return current.filter(r =>
      (filter === 'all' || r.status === filter) &&
      (!q || JSON.stringify(r).toLowerCase().includes(q)))
  }, [current, filter, query])

  async function patch(row, changes) {
    if (tab.statusRpc && 'status' in changes) {
      // Status changes on the register go through the database function (it issues the MOBA number).
      const { data, error } = await supabase.rpc('moba_set_member_status', { p_member_id: row.id, p_status: changes.status })
      if (error) { setNotice(`Could not change status: ${error.message}`); return false }
      setRows(r => ({ ...r, [tabId]: r[tabId].map(x => (x.id === row.id ? { ...x, ...data } : x)) }))
      setNotice(''); loadCounts()
      return true
    }
    const { error } = await supabase.from(tab.table).update(changes).eq('id', row.id)
    if (error) { setNotice(`Could not save: ${error.message}`); return false }
    setRows(r => ({ ...r, [tabId]: r[tabId].map(x => (x.id === row.id ? { ...x, ...changes } : x)) }))
    setNotice('')
    if ('status' in changes) loadCounts()
    return true
  }

  async function remove(row) {
    if (!window.confirm(`Delete "${tab.title(row)}" permanently? This cannot be undone.`)) return
    const { error } = await supabase.from(tab.table).delete().eq('id', row.id)
    if (error) { setNotice(`Could not delete: ${error.message}`); return }
    setRows(r => ({ ...r, [tabId]: r[tabId].filter(x => x.id !== row.id) }))
    loadCounts()
  }

  function download() {
    const blob = new Blob([toCsv(tab, shown)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `moba-${tab.id}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function signOut() { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }) }

  if (!user) return <><PageHeader variant="functional" title="MOBA Administration" /><p className="max-w-4xl mx-auto px-4 py-12">Checking administrator access…</p></>

  return (
    <>
      <PageHeader variant="functional" title="MOBA Administration" subtitle={`Signed in as ${user.email}`} />
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Submissions" className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t.id} role="tab" aria-selected={t.id === tabId}
                onClick={() => { setTabId(t.id); setFilter('all'); setQuery('') }}
                className={`rounded-md border-2 px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${t.id === tabId ? 'border-brand bg-brand text-white' : 'border-brand/30 bg-white text-brand hover:border-brand'}`}>
                {t.label}
                {counts[t.id] > 0 && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-brand-dark">{counts[t.id]} new</span>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin/content" className="text-brand underline">Website content</Link>
            <Link to="/" className="text-brand underline">View website</Link>
            <button onClick={signOut} className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Sign out</button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input type="search" aria-label="Search submissions" placeholder="Search by name, phone, email…" value={query} onChange={e => setQuery(e.target.value)}
            className="min-w-[14rem] flex-1 rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          <select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)}
            className="rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="all">All statuses</option>
            {tab.statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => load(tab)} className="rounded-md border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand hover:text-white">Refresh</button>
          <button onClick={download} disabled={!shown.length} className="rounded-md border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-50">Download CSV</button>
        </div>

        {notice && <p role="alert" className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">{notice}</p>}
        {state === 'loading' && <p className="mt-6 text-ink/70">Loading…</p>}
        {state === 'ready' && !shown.length && <p className="mt-6 text-ink/70">{current.length ? 'Nothing matches that search or filter.' : tab.empty}</p>}
        {state === 'ready' && current.length >= LIMIT && <p className="mt-4 text-sm text-ink/70">Showing the latest {LIMIT}. Older submissions are still in the database.</p>}

        <ul className="mt-6 space-y-4">
          {shown.map(r => <Card key={r.id} row={r} tab={tab} onPatch={patch} onDelete={remove} />)}
        </ul>
      </section>
    </>
  )
}

function Card({ row, tab, onPatch, onDelete }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(row.admin_notes || '')
  const [saving, setSaving] = useState(false)
  const fresh = row.status === (tab.newStatus || 'new')

  async function saveNotes() {
    if (notes === (row.admin_notes || '')) return
    setSaving(true); await onPatch(row, { admin_notes: notes.trim() || null }); setSaving(false)
  }

  return (
    <li className={`rounded-lg bg-white p-5 shadow border-l-4 ${fresh ? 'border-gold' : 'border-transparent'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-brand">{tab.title(row)}</p>
          <p className="text-sm text-ink/70">{when(row.created_at)}{tab.summary(row) ? `, ${tab.summary(row)}` : ''}</p>
        </div>
        <label className="text-sm font-medium">
          <span className="sr-only">Status</span>
          <select value={row.status} onChange={e => onPatch(row, { status: e.target.value })}
            className="rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
            {tab.statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="mt-3 text-sm font-semibold text-gold-dark underline">
        {open ? 'Hide details' : 'Show details'}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {tab.fields.map(([label, get]) => {
              const v = get(row)
              if (v === null || v === undefined || v === '') return null
              return (
                <div key={label} className={String(v).includes('\n') || String(v).length > 60 ? 'sm:col-span-2' : ''}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</dt>
                  <dd className="whitespace-pre-line break-words">
                    {label === 'Phone' ? <a className="text-brand underline" href={`tel:${String(v).replace(/[^\d+]/g, '')}`}>{v}</a>
                      : label === 'Email' ? <a className="text-brand underline" href={`mailto:${v}`}>{v}</a> : v}
                  </dd>
                </div>
              )
            })}
          </dl>
          {tab.edit && (
            <div className="grid gap-3 sm:grid-cols-3">
              {tab.edit.map(([key, label, kind]) => (
                <label key={key} className="block text-sm font-medium">
                  {label}
                  {kind === 'house' ? (
                    <select value={row[key] || ''} onChange={e => onPatch(row, { [key]: e.target.value || null })}
                      className="mt-1 w-full rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
                      <option value="">Not set</option>
                      {houses.map(h => <option key={h}>{h}</option>)}
                    </select>
                  ) : (
                    <input key={row[key] ?? ''} type={kind === 'date' ? 'date' : 'text'} inputMode={kind === 'year' ? 'numeric' : undefined}
                      maxLength={kind === 'year' ? 4 : undefined} defaultValue={row[key] ?? ''}
                      onBlur={e => {
                        const v = e.target.value.trim()
                        const next = kind === 'year' ? (/^\d{4}$/.test(v) ? Number(v) : null) : (v || null)
                        if (next !== (row[key] ?? null)) onPatch(row, { [key]: next })
                      }}
                      className="mt-1 w-full rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
                  )}
                </label>
              ))}
            </div>
          )}
          <label className="block text-sm font-medium">
            Admin notes (only staff see these)
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} onBlur={saveNotes} maxLength={2000}
              className="mt-1 w-full rounded-md border border-ink/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            <span className="text-xs text-ink/60">{saving ? 'Saving…' : 'Saved when you click away.'}</span>
          </label>
          <button onClick={() => onDelete(row)} className="text-sm font-semibold text-red-700 underline">Delete this submission</button>
        </div>
      )}
    </li>
  )
}
