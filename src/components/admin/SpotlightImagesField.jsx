import { useState } from 'react'
import { uploadImage } from '../../lib/contentAdmin.js'

const input = 'mt-1 w-full rounded-md border border-ink/40 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand'
const smallBtn = 'rounded-md border-2 border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function SpotlightImageCard({ image, index, total, onChange, onRemove, onMove }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function replace(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setError('')
    try {
      const src = await uploadImage(file, 'projects/spotlights', 1600)
      onChange({ ...image, src })
    } catch (err) { setError(err.message) }
    setBusy(false)
  }

  return (
    <fieldset className="rounded-lg border border-ink/20 bg-paper p-4">
      <legend className="px-1 text-sm font-semibold text-brand">Spotlight image {index + 1}</legend>
      <div className="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)]">
        <div>
          {image.src
            ? <img src={image.src} alt="" className="aspect-[16/9] w-full rounded-md border border-ink/20 bg-white object-cover md:aspect-square" />
            : <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md border border-dashed border-ink/40 text-xs text-ink/60 md:aspect-square">No picture</div>}
          <label className={`${smallBtn} mt-3 inline-block cursor-pointer focus-within:ring-2 focus-within:ring-brand`}>
            {busy ? 'Uploading…' : image.src ? 'Replace picture' : 'Choose picture'}
            <input type="file" accept="image/*" onChange={replace} disabled={busy} className="sr-only" />
          </label>
          {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Caption <span className="text-red-700" aria-hidden="true">*</span>
            <input className={input} value={image.caption || ''} onChange={e => onChange({ ...image, caption: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">
            Alternative text <span className="text-red-700" aria-hidden="true">*</span>
            <input className={input} value={image.alt || ''} onChange={e => onChange({ ...image, alt: e.target.value })} aria-describedby={`spotlight-alt-help-${index}`} />
            <span id={`spotlight-alt-help-${index}`} className="mt-1 block text-xs font-normal text-ink/65">Describe what the image shows for visitors who cannot see it.</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Image display
              <select className={input} value={image.fit || 'cover'} onChange={e => onChange({ ...image, fit: e.target.value })}>
                <option value="cover">Crop to fill</option>
                <option value="contain">Show the whole image</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Badge text (optional)
              <input className={input} value={image.badge || ''} placeholder="Defaults to Artist's impression" onChange={e => onChange({ ...image, badge: e.target.value })} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" checked={Boolean(image.concept)} onChange={e => onChange({ ...image, concept: e.target.checked })} />
            This is an artist&apos;s impression or concept image
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3">
        <button type="button" className={smallBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move spotlight image ${index + 1} up`}>↑</button>
        <button type="button" className={smallBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label={`Move spotlight image ${index + 1} down`}>↓</button>
        <button type="button" className="text-sm font-semibold text-red-700 underline" onClick={onRemove}>Remove image</button>
      </div>
    </fieldset>
  )
}

export default function SpotlightImagesField({ id, value = [], onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function add(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    setBusy(true); setError('')
    const images = [...value]
    const failed = []
    for (const file of files) {
      try {
        const src = await uploadImage(file, 'projects/spotlights', 1600)
        images.push({ src, alt: '', caption: '', badge: '', concept: false, fit: 'cover' })
        onChange([...images])
      } catch (err) { failed.push(`${file.name}: ${err.message}`) }
    }
    setBusy(false)
    if (failed.length) setError(failed.join('\n'))
  }

  const patch = (index, image) => onChange(value.map((item, i) => i === index ? image : item))
  const move = (index, direction) => {
    const images = [...value]
    const target = index + direction
    if (target < 0 || target >= images.length) return
    ;[images[index], images[target]] = [images[target], images[index]]
    onChange(images)
  }

  return (
    <div id={id} className="space-y-4">
      {value.map((image, index) => (
        <SpotlightImageCard
          key={index}
          image={image}
          index={index}
          total={value.length}
          onChange={next => patch(index, next)}
          onRemove={() => onChange(value.filter((_, i) => i !== index))}
          onMove={direction => move(index, direction)}
        />
      ))}
      <div>
        <label className={`${smallBtn} inline-block cursor-pointer focus-within:ring-2 focus-within:ring-brand`}>
          {busy ? 'Uploading…' : 'Add spotlight images'}
          <input type="file" accept="image/*" multiple onChange={add} disabled={busy} className="sr-only" />
        </label>
        <p className="mt-2 text-xs text-ink/65">You can choose several pictures at once. Add a caption and alternative text to each one before publishing.</p>
        {error && <p role="alert" className="mt-2 whitespace-pre-line text-sm text-red-700">{error}</p>}
      </div>
    </div>
  )
}
