import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { supabase } from '../lib/supabase.js'
import { fetchMyMember } from '../lib/members.js'
import { houses } from '../data/content.js'

const HELP_OPTIONS = ['Mentoring current students', 'Association projects', 'Reunions and events', 'Professional networking']
const emptyProfile = { phone: '', year_left: '', location: '', profession: '', help_with: [] }

export default function MemberProfile() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(true)
  const [saving, setSaving] = useState(false)
  const [member, setMember] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(emptyProfile)
  const [avatarPath, setAvatarPath] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [file, setFile] = useState(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [requests, setRequests] = useState([])
  const [request, setRequest] = useState({ name: '', cohort: '', house: '', reason: '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function refreshAvatar(path) {
    if (!path) { setAvatarUrl(''); return }
    const { data } = await supabase.storage.from('member-avatars').createSignedUrl(path, 3600)
    setAvatarUrl(data?.signedUrl || '')
  }

  useEffect(() => {
    let live = true
    async function load() {
      if (!supabase) { navigate('/member/login', { replace: true }); return }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/member/login', { replace: true }); return }
      const [{ member: row }, { data: p }, { data: q }] = await Promise.all([
        fetchMyMember(session.user.id),
        supabase.from('member_profiles').select('*').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('member_profile_change_requests').select('id,created_at,status,requested_name,requested_cohort,requested_house,reason').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(10),
      ])
      if (!live) return
      if (!row) { navigate('/member', { replace: true }); return }
      setUser(session.user); setMember(row)
      setProfile({ phone: row.phone || '', year_left: p?.year_left || '', location: p?.location || '', profession: p?.profession || '', help_with: p?.help_with || [] })
      setAvatarPath(p?.avatar_path || null); setRequests(q || [])
      setBusy(false)
      if (p?.avatar_path) refreshAvatar(p.avatar_path)
    }
    load().catch(e => { if (live) { setError(e.message || 'Could not load your profile.'); setBusy(false) } })
    return () => { live = false }
  }, [navigate])

  const preview = useMemo(() => file ? URL.createObjectURL(file) : '', [file])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  const shownAvatar = preview || (removeAvatar ? '' : avatarUrl)

  function update(field, value) { setProfile(p => ({ ...p, [field]: value })) }
  function toggleHelp(value) { setProfile(p => ({ ...p, help_with: p.help_with.includes(value) ? p.help_with.filter(x => x !== value) : [...p.help_with, value] })) }

  async function saveProfile(e) {
    e.preventDefault(); setError(''); setNotice(''); setSaving(true)
    let newPath = null
    try {
      let nextPath = removeAvatar ? null : avatarPath
      if (file) {
        const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
        newPath = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('member-avatars').upload(newPath, file, { contentType: file.type, upsert: false })
        if (uploadError) throw uploadError
        nextPath = newPath
      }
      const { data, error: saveError } = await supabase.rpc('moba_update_my_profile', {
        p_phone: profile.phone || null,
        p_year_left: profile.year_left ? Number(profile.year_left) : null,
        p_location: profile.location || null,
        p_profession: profile.profession || null,
        p_help_with: profile.help_with,
        p_avatar_path: nextPath,
      })
      if (saveError) throw saveError
      const previousPath = avatarPath
      setAvatarPath(data?.avatar_path || null); setFile(null); setRemoveAvatar(false)
      await refreshAvatar(data?.avatar_path || null)
      if (previousPath && previousPath !== data?.avatar_path) await supabase.storage.from('member-avatars').remove([previousPath])
      setNotice('Your contact and profile details have been saved. Your official name, cohort and house remain unchanged unless an administrator approves a request.')
    } catch (e) {
      if (newPath) await supabase.storage.from('member-avatars').remove([newPath])
      setError(e.message || 'Could not save your profile.')
    } finally { setSaving(false) }
  }

  async function submitRequest(e) {
    e.preventDefault(); setError(''); setNotice(''); setSaving(true)
    try {
      const { data, error: submitError } = await supabase.rpc('moba_submit_member_profile_change', {
        p_name: request.name.trim() || null,
        p_cohort: request.cohort ? Number(request.cohort) : null,
        p_house: request.house || null,
        p_reason: request.reason.trim() || null,
      })
      if (submitError) throw submitError
      setRequests(rs => [data, ...rs]); setRequest({ name: '', cohort: '', house: '', reason: '' })
      setNotice('Your official-record change request has been sent for administrator review.')
    } catch (e) { setError(e.message || 'Could not submit your request.') }
    finally { setSaving(false) }
  }

  if (busy) return <><PageHeader variant="functional" title="My profile" /><p className="mx-auto max-w-5xl px-4 py-12">Loading your profile…</p></>
  return <>
    <PageHeader variant="functional" title="My profile" subtitle="Manage contact information and request official-record corrections." />
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <Link to="/member" className="text-sm font-semibold text-brand underline">← Back to my MOBA dashboard</Link>
      {error && <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-md bg-green-50 p-4 text-green-900">{notice}</p>}
      <form onSubmit={saveProfile} className="space-y-5 rounded-lg border border-brand/10 bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-semibold text-brand">Contact details and photo</h2><p className="mt-1 text-sm text-ink/70">These details update directly. Your photo is private and visible only to you and MOBA administrators.</p></div>
        <div className="flex items-center gap-4">
          {shownAvatar ? <img src={shownAvatar} alt={`${member.name}'s profile`} className="h-20 w-20 rounded-full object-cover" /> : <div aria-label="No profile photo" className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand">{member.name?.slice(0, 1)}</div>}
          <div className="space-y-2"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 3 * 1024 * 1024) { setError('Choose a photo smaller than 3 MB.'); e.target.value = ''; return } setError(''); setFile(f); setRemoveAvatar(false) }} /><button type="button" className="block text-sm text-brand underline" onClick={() => { setFile(null); setRemoveAvatar(true) }}>Remove photo</button></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Phone<input className="mt-1 w-full rounded border p-2" maxLength={30} value={profile.phone} onChange={e => update('phone', e.target.value)} /></label>
          <label className="text-sm font-medium">Year left<input type="number" min="1900" max="2100" className="mt-1 w-full rounded border p-2" value={profile.year_left} onChange={e => update('year_left', e.target.value)} /></label>
          <label className="text-sm font-medium">Location<input maxLength={120} className="mt-1 w-full rounded border p-2" value={profile.location} onChange={e => update('location', e.target.value)} /></label>
          <label className="text-sm font-medium">Profession<input maxLength={160} className="mt-1 w-full rounded border p-2" value={profile.profession} onChange={e => update('profession', e.target.value)} /></label>
        </div>
        <fieldset><legend className="mb-2 text-sm font-medium">I’m happy to help with</legend><div className="grid gap-2 sm:grid-cols-2">{HELP_OPTIONS.map(x => <label key={x} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.help_with.includes(x)} onChange={() => toggleHelp(x)} />{x}</label>)}</div></fieldset>
        <button disabled={saving} className="rounded-md bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save contact details'}</button>
      </form>
      <section id="identity-correction" className="space-y-5 rounded-lg border border-brand/10 bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-semibold text-brand">Request an official-record correction</h2><p className="mt-1 text-sm text-ink/70">Your registered name, cohort and house are protected. Changes are applied only after administrator approval.</p></div>
        <dl className="grid gap-2 text-sm sm:grid-cols-3"><div><dt className="font-semibold">Current name</dt><dd>{member.name}</dd></div><div><dt className="font-semibold">Current cohort</dt><dd>{member.cohort || 'Not recorded'}</dd></div><div><dt className="font-semibold">Current house</dt><dd>{member.house || 'Not recorded'}</dd></div></dl>
        <form onSubmit={submitRequest} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium">Requested name<input maxLength={120} placeholder="Leave blank for no change" className="mt-1 w-full rounded border p-2" value={request.name} onChange={e => setRequest({ ...request, name: e.target.value })} /></label>
            <label className="text-sm font-medium">Requested cohort<input type="number" min="1900" max="2100" placeholder="Leave blank for no change" className="mt-1 w-full rounded border p-2" value={request.cohort} onChange={e => setRequest({ ...request, cohort: e.target.value })} /></label>
            <label className="text-sm font-medium">Requested house<select className="mt-1 w-full rounded border p-2" value={request.house} onChange={e => setRequest({ ...request, house: e.target.value })}><option value="">No change</option>{houses.map(h => <option key={h} value={h}>{h}</option>)}</select></label>
          </div>
          <label className="block text-sm font-medium">Reason or supporting context<textarea maxLength={1000} rows={3} className="mt-1 w-full rounded border p-2" value={request.reason} onChange={e => setRequest({ ...request, reason: e.target.value })} /></label>
          <button disabled={saving} className="rounded-md border border-brand px-5 py-2 font-semibold text-brand disabled:opacity-50">{saving ? 'Sending…' : 'Submit for review'}</button>
        </form>
        {requests.length > 0 && <div><h3 className="mb-2 font-semibold">Your recent requests</h3><ul className="space-y-2">{requests.map(r => <li key={r.id} className="rounded border p-3 text-sm"><div className="flex justify-between gap-2"><strong>{r.status[0].toUpperCase() + r.status.slice(1)}</strong><span>{new Date(r.created_at).toLocaleDateString()}</span></div><p>{[r.requested_name, r.requested_cohort && `Cohort ${r.requested_cohort}`, r.requested_house && `${r.requested_house} House`].filter(Boolean).join(' · ')}</p></li>)}</ul></div>}
      </section>
    </main>
  </>
}
