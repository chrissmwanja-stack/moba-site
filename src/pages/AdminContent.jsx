import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ContentForm from '../components/admin/ContentForm.jsx'
import { projectSpotlights, projectClaimsSpotlight, projectForEditing } from '../data/projectSpotlights.js'
import { supabase } from '../lib/supabase.js'
import { SECTIONS, toForm, fromForm, problems } from '../lib/contentSchemas.js'
import * as api from '../lib/contentAdmin.js'
import { withEditableBackgrounds } from '../lib/backgrounds.js'

const btn = 'rounded-md px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50'
const primary = `${btn} bg-brand text-white hover:bg-brand-dark`
const outline = `${btn} border-2 border-brand text-brand hover:bg-brand hover:text-white`
const small = 'rounded-md border border-brand/40 px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

const CHIP = {
  published: ['Published', 'bg-green-100 text-green-900'],
  changes: ['Published, changes waiting', 'bg-gold/30 text-brand-dark'],
  draft: ['Draft, not on the website', 'bg-ink/10 text-ink'],
}

export default function AdminContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [kind, setKind] = useState(SECTIONS[0].kind)
  const [rows, setRows] = useState([])
  const [state, setState] = useState('loading') // loading | ready | error
  const [notice, setNotice] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)
  const [edit, setEdit] = useState(null) // { row | null, form, problems: [] }
  const [bulk, setBulk] = useState(null) // { done, total, failed: [] }
  const [uploadCategory, setUploadCategory] = useState('')
  const [newCategoryMode, setNewCategoryMode] = useState(false)
  const section = SECTIONS.find(s => s.kind === kind)
  const kindMigration = kind === 'life_member' || kind === 'headmaster'
    ? '202610290001_editable_rosters.sql'
    : '202610270004_editable_static_content.sql'

  // Sign-in check: a session AND a place on the admin or editor list.
  useEffect(() => {
    let live = true
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/admin/login', { replace: true }); return }
      const { role: r } = await api.getRole()
      if (!live) return
      if (!r) { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }); return }
      setRole(r); setUser(session.user)
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate('/admin/login', { replace: true }) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [navigate])

  const load = useCallback(async () => {
    setState('loading')
    const { data, error } = await api.listRows(kind)
    if (error) {
      setState('error')
      setNotice(/site_content|schema cache|does not exist/i.test(error.message)
        ? 'The content tables are not set up yet. Run supabase/migrations/202610270003_site_content.sql in the Supabase SQL Editor, then reload this page.'
        : error.message)
      return
    }
    setRows(data); setState('ready'); setNotice('')
  }, [kind])

  useEffect(() => { if (user) { setEdit(null); setOk(''); load() } }, [user, kind, load])

  const view = r => r.draft || r.live || {}
  const unattachedSpotlights = kind === 'project' && state === 'ready'
    ? projectSpotlights.filter(spotlight => !rows.some(row => projectClaimsSpotlight(view(row), spotlight)))
    : []
  const existingCategories = useMemo(() => [...new Set([
    ...rows.map(r => r.draft?.category || r.live?.category),
    ...(section.sample?.() || []).map(photo => photo.category),
  ].map(value => String(value || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [rows, section])
  const needsImport = state === 'ready' && !section.single && rows.length === 0 && (section.sample?.().length || 0) > 0
  const pending = useMemo(() => rows.filter(r => r.draft), [rows])
  const ready = useMemo(() => pending.filter(r => problems(section, r.draft).length === 0), [pending, section])

  const fail = error => {
    const message = error.message || String(error)
    setNotice(/site_content_kind_check/.test(message)
      ? `This content type is not enabled in Supabase yet. Apply supabase/migrations/${kindMigration}, then try again.`
      : message)
    setBusy(false)
  }
  const done = async (message, publishedSomething) => {
    if (publishedSomething) await api.refreshSite()
    await load(); setOk(message); setBusy(false)
  }

  function startEdit(row, messages = [], initialData = null) {
    const data = initialData || (row ? view(row) : section.defaults?.() || {})
    const editableData = kind === 'project' ? projectForEditing(data) : section.key === 'site' ? withEditableBackgrounds(data) : data
    setEdit({ row, form: toForm(section, editableData), problems: messages }); setNotice(''); setOk('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startSpotlightProject(spotlight) {
    startEdit(null, [], {
      title: spotlight.projectTitle,
      year: '',
      status: '',
      summary: spotlight.description,
      spotlightId: spotlight.id,
      spotlightImages: spotlight.images,
    })
  }

  function nextPosition() {
    if (!section.reorder) return null
    const used = rows.map(r => r.position).filter(p => p != null)
    if (kind === 'photo') return (used.length ? Math.min(...used) : 10) - 10 // newest photos first
    return (used.length ? Math.max(...used) : 0) + 10
  }

  async function save(andPublish) {
    const original = edit.row ? view(edit.row) : {}
    const data = fromForm(section, edit.form, original)
    if (andPublish) {
      const list = problems(section, data)
      if (list.length) { setEdit(e => ({ ...e, problems: list })); return }
    }
    setBusy(true); setNotice('')
    let id = edit.row?.id
    if (id) {
      const { error } = await api.saveDraft(id, data)
      if (error) return fail(error)
    } else {
      const { data: row, error } = await api.createRow(kind, data, nextPosition(), section.key || null)
      if (error) return fail(error)
      id = row.id
    }
    if (andPublish) {
      const { error } = await api.publishRow(id)
      if (error) return fail(error)
    }
    setEdit(null)
    await done(andPublish ? 'Published. The change is now on the website.' : 'Draft saved. It will not appear on the website until you publish it.', andPublish)
  }

  async function publish(row) {
    const list = problems(section, row.draft)
    if (list.length) { startEdit(row, list); return }
    setBusy(true); setNotice('')
    const { error } = await api.publishRow(row.id)
    if (error) return fail(error)
    await done('Published. The change is now on the website.', true)
  }

  async function publishAll() {
    setBusy(true); setNotice('')
    for (const r of ready) {
      const { error } = await api.publishRow(r.id)
      if (error) return fail(error)
    }
    await done(`Published ${ready.length} ${ready.length === 1 ? 'item' : 'items'}.`, true)
  }

  async function unpublish(row) {
    if (!window.confirm(`Take "${section.title(view(row)) || 'this item'}" off the website? It stays here as a draft.`)) return
    setBusy(true); setNotice('')
    const { error } = await api.unpublishRow(row.id)
    if (error) return fail(error)
    await done('Taken off the website. It is saved as a draft.', true)
  }

  async function discard(row) {
    if (!window.confirm('Throw away the changes waiting to be published? The website keeps showing the published version.')) return
    setBusy(true); setNotice('')
    const { error } = await api.discardDraft(row.id)
    if (error) return fail(error)
    setEdit(null)
    await done('Changes discarded.', false)
  }

  async function remove(row) {
    const live = Boolean(row.live)
    if (!window.confirm(`Delete "${section.title(view(row)) || 'this item'}" permanently?${live ? ' It will disappear from the website straight away.' : ''} This cannot be undone.`)) return
    setBusy(true); setNotice('')
    const { data, error } = await api.removeRow(row.id)
    if (error) return fail(error)
    if (!data?.length) return fail({ message: 'You are not allowed to delete this item. Ask an administrator, or use "Take off website" instead.' })
    await done('Deleted.', live)
  }

  async function move(row, dir) {
    const i = rows.findIndex(r => r.id === row.id)
    const j = i + dir
    if (j < 0 || j >= rows.length) return
    const order = rows.map(r => r.id)
    ;[order[i], order[j]] = [order[j], order[i]]
    setBusy(true); setNotice('')
    const results = await Promise.all(order.map((id, idx) => {
      const want = (idx + 1) * 10
      return rows.find(r => r.id === id).position === want ? null : api.setPosition(id, want)
    }))
    const bad = results.find(r => r?.error)
    if (bad) return fail(bad.error)
    await done('Order updated. Reordering applies to the website straight away.', true)
  }

  async function importBuiltIn() {
    if (!window.confirm('Copy the content that ships with the website into the editor? The website will look exactly the same afterwards, and you can then edit every item.')) return
    setBusy(true); setNotice('')
    const { error } = await api.importItems(kind, JSON.parse(JSON.stringify(section.sample())))
    if (error) return fail(error)
    await done('Imported. Everything now on the website can be edited here.', true)
  }

  async function addPhotos(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    const category = uploadCategory.trim()
    if (!category) { setNotice('Enter a category before uploading these photos.'); return }
    setNotice(''); setOk('')
    const used = rows.map(r => r.position).filter(p => p != null)
    const start = (used.length ? Math.min(...used) : 10) - 10 * files.length
    const failed = []
    setBulk({ done: 0, total: files.length, failed })
    for (const [idx, file] of files.entries()) {
      try {
        const src = await api.uploadImage(file, 'gallery', 1600)
        const thumb = await api.uploadImage(file, 'gallery', 640)
        const { error } = await api.createRow('photo', { src, thumb, category, year: new Date().getFullYear() }, start + 10 * idx)
        if (error) throw error
      } catch (err) { failed.push(`${file.name}: ${err.message}`) }
      setBulk({ done: idx + 1, total: files.length, failed })
    }
    setBulk(null)
    await load()
    const added = files.length - failed.length
    if (failed.length) setNotice(`Some pictures could not be added:\n${failed.join('\n')}`)
    if (added) {
      setNewCategoryMode(false)
      setOk(`${added} ${added === 1 ? 'photo' : 'photos'} added to “${category}” as drafts. Open each one to add a caption, then publish.`)
    }
  }

  async function signOut() { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }) }

  if (!user) return <><PageHeader variant="functional" title="Website content" /><p className="max-w-4xl mx-auto px-4 py-12">Checking access…</p></>
  const canDelete = row => role === 'admin' || !row.live

  return (
    <>
      <PageHeader variant="functional" title="Website content" subtitle={`Signed in as ${user.email} (${role})`} />
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="rounded-xl border border-brand/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label="Sections" className="flex max-w-full flex-wrap gap-2">
            {SECTIONS.map(s => (
              <button key={s.kind} role="tab" aria-selected={s.kind === kind} onClick={() => setKind(s.kind)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${s.kind === kind ? 'border-brand bg-brand text-white shadow-sm' : 'border-brand/15 bg-paper text-brand hover:border-brand/50 hover:bg-white'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            {role === 'admin' && <Link to="/admin" className="text-brand underline">Submissions &amp; members</Link>}
            <Link to="/" className="text-brand underline">View website</Link>
            <button onClick={signOut} className={primary}>Sign out</button>
          </div>
        </div>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">Content editor</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-brand">{section.label}</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">Manage this section of the public website. Save drafts first, then publish when you are ready.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ['Items', rows.length],
              ['Drafts', pending.length],
              ['Ready to publish', ready.length],
            ].map(([label, value]) => (
              <div key={label} className="min-w-[5rem] rounded-lg border border-brand/10 bg-white px-3 py-2 text-center shadow-sm sm:min-w-[7rem]">
                <p className="text-lg font-bold text-brand">{value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/55">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          {ok && <p className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-900">{ok}</p>}
          {notice && <p role="alert" className="mt-4 whitespace-pre-line rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">{notice}</p>}
          {bulk && <p className="mt-4 rounded-md border border-brand/30 bg-white px-4 py-3">Uploading photos… {bulk.done} of {bulk.total}</p>}
        </div>

        {edit ? (
          <form onSubmit={e => { e.preventDefault(); save(false) }} className="mt-6 rounded-2xl border border-brand/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand">{edit.row ? `Edit ${section.noun}` : `New ${section.noun}`}</h2>
            {edit.row?.live && edit.row?.draft && <p className="mt-1 text-sm text-ink/70">You are editing changes that are not yet on the website.</p>}
            {edit.problems.length > 0 && (
              <ul role="alert" className="mt-4 list-disc rounded-md border border-red-300 bg-red-50 py-3 pl-8 pr-4 text-red-800">
                {edit.problems.map(p => <li key={p}>{p}</li>)}
              </ul>
            )}
            <div className="mt-6">
              <ContentForm section={section} form={edit.form} setForm={fn => setEdit(e => ({ ...e, form: typeof fn === 'function' ? fn(e.form) : fn }))} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="submit" disabled={busy} className={outline}>{busy ? 'Saving…' : 'Save draft'}</button>
              <button type="button" disabled={busy} onClick={() => save(true)} className={primary}>Publish to website</button>
              <button type="button" disabled={busy} onClick={() => setEdit(null)} className={`${btn} text-brand underline`}>Cancel</button>
              {edit.row?.live && edit.row?.draft && <button type="button" disabled={busy} onClick={() => discard(edit.row)} className={`${btn} text-red-700 underline`}>Discard these changes</button>}
            </div>
            <p className="mt-3 text-xs text-ink/70">Saving a draft keeps your work private. Nothing changes on the website until you publish.</p>
          </form>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {section.single
                ? <button className={primary} disabled={busy || state !== 'ready'} onClick={() => startEdit(rows[0] || null)}>Edit {section.label.toLowerCase()}</button>
                : section.bulk
                  ? <button className={primary} disabled={busy || state !== 'ready' || needsImport} onClick={() => { setUploadCategory(''); setNewCategoryMode(true) }}>Add category</button>
                  : <button className={primary} disabled={busy || state !== 'ready' || needsImport} onClick={() => startEdit(null)}>Add {section.noun}</button>}
              {section.bulk && (
                <div className="flex flex-wrap items-end gap-3 rounded-xl border border-brand/10 bg-paper/70 p-3">
                  {newCategoryMode ? (
                    <label className="block min-w-[15rem] text-sm font-semibold text-brand">
                      New photo category
                      <input type="text" required maxLength={60} value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}
                        placeholder="e.g. Reunions, AGM & meetings" className="mt-1 w-full rounded-md border border-ink/30 bg-white px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-brand" />
                    </label>
                  ) : (
                    <label className="block min-w-[15rem] text-sm font-semibold text-brand">
                      Choose an existing category
                      <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}
                        className="mt-1 w-full rounded-md border border-ink/30 bg-white px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-brand">
                        <option value="">Select a category…</option>
                        {existingCategories.map(category => <option key={category} value={category}>{category}</option>)}
                      </select>
                    </label>
                  )}
                  <label className={`${outline} cursor-pointer focus-within:ring-2 focus-within:ring-brand ${busy || needsImport || state !== 'ready' || bulk || !uploadCategory.trim() ? 'pointer-events-none opacity-50' : ''}`}>
                    {uploadCategory.trim() ? `Upload photos to “${uploadCategory.trim()}”` : 'Choose a category first'}
                    <input type="file" accept="image/*" multiple onChange={addPhotos} disabled={busy || needsImport || state !== 'ready' || bulk || !uploadCategory.trim()} className="sr-only" />
                  </label>
                  {newCategoryMode && <button type="button" className={`${btn} text-brand underline`} onClick={() => { setNewCategoryMode(false); setUploadCategory('') }}>Cancel</button>}
                  <p className="basis-full text-xs text-ink/65">Choose an existing category or add a new one. A new category appears in this list once its first photos are added.</p>
                </div>
              )}
              {pending.length > 0 && !section.single && (
                <button className={outline} disabled={busy || !ready.length} onClick={publishAll}>
                  Publish all drafts ({ready.length} ready{pending.length > ready.length ? `, ${pending.length - ready.length} need details` : ''})
                </button>
              )}
              <button className={`${btn} text-brand underline`} onClick={load} disabled={busy}>Refresh</button>
            </div>

            {section.reorder && rows.length > 1 && <p className="mt-3 text-sm text-ink/70">Use the arrows to change the order. Order changes apply to the website straight away.</p>}

            {needsImport && (
              <div className="mt-6 rounded-lg border-2 border-gold bg-gold/15 p-6">
                <h2 className="text-lg font-bold text-brand">The website is showing built-in {section.label.toLowerCase()}</h2>
                <p className="mt-2 text-ink/80">To edit what is already on the site, copy it into the editor first. The website will look exactly the same afterwards, and every item becomes editable.</p>
                <button className={`${primary} mt-4`} disabled={busy} onClick={importBuiltIn}>{busy ? 'Importing…' : `Import current ${section.label.toLowerCase()}`}</button>
              </div>
            )}

            {state === 'loading' && <p className="mt-6 text-ink/70">Loading…</p>}
            {state === 'ready' && !needsImport && rows.length === 0 && !section.single && <p className="mt-6 text-ink/70">Nothing here yet. Add the first {section.noun}.</p>}
            {section.single && state === 'ready' && rows.length === 0 && <p className="mt-6 text-ink/70">The website is using the built-in details. Press “Edit site details” to change them.</p>}

            {unattachedSpotlights.length > 0 && (
              <div className="mt-6 rounded-lg border border-brand/20 bg-paper p-5">
                <h2 className="text-lg font-bold text-brand">Existing spotlights not linked to a project</h2>
                <p className="mt-1 text-sm text-ink/70">Create an editable project to manage these existing spotlight images. You will need to confirm its year and status before publishing.</p>
                <ul className="mt-4 space-y-3">
                  {unattachedSpotlights.map(spotlight => (
                    <li key={spotlight.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-3">
                      <span className="font-medium text-brand">{spotlight.title}</span>
                      <button type="button" className={small} disabled={busy} onClick={() => startSpotlightProject(spotlight)}>Create editable project</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {rows.map((row, idx) => {
                const d = view(row)
                const st = api.rowState(row)
                const [chipText, chipClass] = CHIP[st]
                const preview = section.preview?.(d)
                return (
                  <li key={row.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-brand/10 bg-white p-4 shadow-sm transition hover:shadow-md">
                    {section.preview && (preview
                      ? <img src={preview} alt="" loading="lazy" style={{ objectPosition: d.focus || '50% 50%' }} className="h-16 w-16 shrink-0 rounded-md object-cover" />
                      : <div aria-hidden="true" className="h-16 w-16 shrink-0 rounded-md bg-brand/10" />)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-brand">{section.title(d) || '(no title yet)'}</p>
                      <p className="truncate text-sm text-ink/70">{section.summary(d) || '\u00A0'}</p>
                      <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${chipClass}`}>{chipText}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {section.reorder && (
                        <>
                          <button className={small} disabled={busy || idx === 0} onClick={() => move(row, -1)} aria-label={`Move ${section.title(d)} up`}>↑</button>
                          <button className={small} disabled={busy || idx === rows.length - 1} onClick={() => move(row, 1)} aria-label={`Move ${section.title(d)} down`}>↓</button>
                        </>
                      )}
                      <button className={small} disabled={busy} onClick={() => startEdit(row)}>Edit</button>
                      {row.draft && <button className={small} disabled={busy} onClick={() => publish(row)}>Publish</button>}
                      {row.live && !section.single && <button className={small} disabled={busy} onClick={() => unpublish(row)}>Take off website</button>}
                      {!section.single && canDelete(row) && <button className={`${small} border-red-300 text-red-700 hover:bg-red-700 hover:text-white`} disabled={busy} onClick={() => remove(row)}>Delete</button>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
