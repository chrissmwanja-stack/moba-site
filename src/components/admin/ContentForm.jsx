import { useState } from 'react'
import { houses } from '../../data/content.js'
import { uploadImage, uploadPdf } from '../../lib/contentAdmin.js'

const input = 'w-full rounded-md border border-ink/40 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const smallBtn = 'rounded-md border-2 border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function Row({ id, label, help, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink/90">
        {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}
      </label>
      <div className="mt-1">{children}</div>
      {help && <p className="mt-1 text-xs text-ink/70">{help}</p>}
    </div>
  )
}

function ImageField({ fd, form, set, id }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const value = form[fd.key]

  async function pick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setError('')
    try {
      const url = await uploadImage(file, fd.folder, fd.maxSide)
      const changes = { [fd.key]: url }
      if (fd.thumbKey) changes[fd.thumbKey] = await uploadImage(file, fd.folder, fd.thumbSide || 640)
      set(changes)
    } catch (err) { setError(err.message) }
    setBusy(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {value
        ? <img src={form[fd.thumbKey] || value} alt="Current" className="h-24 w-24 rounded-md border border-ink/20 object-cover" />
        : <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed border-ink/40 text-xs text-ink/60">No picture</div>}
      <div className="space-y-2">
        <label className={`${smallBtn} inline-block cursor-pointer focus-within:ring-2 focus-within:ring-brand`}>
          {busy ? 'Uploading…' : value ? 'Replace picture' : 'Choose picture'}
          <input id={id} type="file" accept="image/*" onChange={pick} disabled={busy} className="sr-only" />
        </label>
        {value && !busy && (
          <button type="button" className="ml-2 text-sm text-brand underline" onClick={() => set({ [fd.key]: '', ...(fd.thumbKey ? { [fd.thumbKey]: '' } : {}) })}>Remove</button>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </div>
    </div>
  )
}

function FileField({ fd, form, set, id }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function pick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setError('')
    try {
      const { url, size } = await uploadPdf(file, fd.folder)
      set({ [fd.key]: url, ...(fd.sizeKey ? { [fd.sizeKey]: size } : {}) })
    } catch (err) { setError(err.message) }
    setBusy(false)
  }
  return (
    <div className="space-y-2">
      <label className={`${smallBtn} inline-block cursor-pointer focus-within:ring-2 focus-within:ring-brand`}>
        {busy ? 'Uploading…' : 'Upload a PDF'}
        <input type="file" accept="application/pdf" onChange={pick} disabled={busy} className="sr-only" />
      </label>
      <input id={id} className={input} placeholder="…or paste a link to the document" value={form[fd.key]} onChange={e => set({ [fd.key]: e.target.value })} />
      {form[fd.key] && <p className="text-sm"><a href={form[fd.key]} target="_blank" rel="noopener noreferrer" className="text-brand underline">Open current file</a></p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  )
}

function Methods({ value, onChange }) {
  const update = (i, patch) => onChange(value.map((m, j) => (j === i ? { ...m, ...patch } : m)))
  return (
    <div className="space-y-3">
      {value.map((m, i) => (
        <div key={i} className="rounded-md border border-ink/20 bg-paper p-3 space-y-2">
          <input aria-label="Name of this way to give" className={input} placeholder="e.g. Bank transfer, MTN MoMo" value={m.label} onChange={e => update(i, { label: e.target.value })} />
          <textarea aria-label="Details, one per line" rows={3} className={input} placeholder={'One detail per line, e.g.\nAccount name: …\nAccount number: …'} value={m.lines} onChange={e => update(i, { lines: e.target.value })} />
          <button type="button" className="text-sm text-red-700 underline" onClick={() => onChange(value.filter((_, j) => j !== i))}>Remove this</button>
        </div>
      ))}
      <button type="button" className={smallBtn} onClick={() => onChange([...value, { label: '', lines: '' }])}>Add a way to give</button>
    </div>
  )
}

export default function ContentForm({ section, form, setForm }) {
  const set = changes => setForm(f => ({ ...f, ...changes }))
  return (
    <div className="space-y-5">
      {section.fields.filter(fd => fd.type !== 'hidden').map(fd => {
        const id = `f-${fd.key.replace(/\./g, '-')}`
        const v = form[fd.key]
        let control
        switch (fd.type) {
          case 'textarea':
          case 'paragraphs':
            control = <textarea id={id} rows={fd.rows || 4} className={input} value={v} onChange={e => set({ [fd.key]: e.target.value })} />
            break
          case 'select': {
            const opts = fd.options.map(o => (Array.isArray(o) ? o : [o, o]))
            if (v && !opts.some(([val]) => val === v)) opts.push([v, `Current setting (${v})`])
            control = (
              <select id={id} className={input} value={v} onChange={e => set({ [fd.key]: e.target.value })}>
                <option value="">{fd.required ? 'Choose…' : 'Not set'}</option>
                {opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            )
            break
          }
          case 'checkbox':
            control = (
              <label className="flex items-center gap-2 text-sm">
                <input id={id} type="checkbox" checked={v} onChange={e => set({ [fd.key]: e.target.checked })} className="h-4 w-4" />
                Yes
              </label>
            )
            break
          case 'houses':
            control = (
              <div id={id} role="group" aria-label={fd.label} className="flex flex-wrap gap-x-5 gap-y-2">
                {houses.map(h => (
                  <label key={h} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={v.includes(h)} onChange={e => set({ [fd.key]: e.target.checked ? [...v, h] : v.filter(x => x !== h) })} />
                    {h}
                  </label>
                ))}
              </div>
            )
            break
          case 'image': control = <ImageField fd={fd} form={form} set={set} id={id} />; break
          case 'file': control = <FileField fd={fd} form={form} set={set} id={id} />; break
          case 'methods': control = <Methods value={v} onChange={val => set({ [fd.key]: val })} />; break
          default:
            control = <input id={id} type={fd.type === 'date' ? 'date' : 'text'} inputMode={fd.type === 'number' ? 'numeric' : undefined} placeholder={fd.placeholder} className={input} value={v} onChange={e => set({ [fd.key]: e.target.value })} />
        }
        return <Row key={fd.key} id={id} label={fd.label} help={fd.help} required={fd.required}>{control}</Row>
      })}
    </div>
  )
}
