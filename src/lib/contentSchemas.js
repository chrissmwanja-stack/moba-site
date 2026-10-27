// Describes every editable section: its fields, how items are listed, and where the built-in content
// (used for the one-time import) comes from. The admin form is generated from this file, so adding a
// field here adds it to the form.
import * as base from '../data/content.js'

const FOCUS = [['50% 20%', 'Top'], ['50% 35%', 'Upper part'], ['50% 50%', 'Centre'], ['50% 70%', 'Lower part']]

export const SECTIONS = [
  {
    kind: 'news', label: 'News & events', noun: 'news item', reorder: false,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, help: 'Changing the title or date also changes the article’s web address.' },
      { key: 'date', label: 'Date', type: 'date', required: true, help: 'The date of the event, or the day the news was written.' },
      { key: 'category', label: 'Category', type: 'select', options: base.newsCategories, required: true },
      { key: 'place', label: 'Place', type: 'text' },
      { key: 'excerpt', label: 'Short summary', type: 'textarea', rows: 3, required: true, help: 'Shown on the news card.' },
      { key: 'body', label: 'Full article', type: 'paragraphs', rows: 8, help: 'Optional. Leave a blank line between paragraphs.' },
      { key: 'image', label: 'Picture', type: 'image', folder: 'news', maxSide: 1400 },
      { key: 'link.label', label: 'Button text', type: 'text', help: 'Optional button under the article, for example “Browse the photos”.' },
      { key: 'link.to', label: 'Button link', type: 'text', help: 'A page on this site such as /gallery, or a full https:// address.' },
    ],
    title: d => d.title, summary: d => [d.date, d.category].filter(Boolean).join(' · '), preview: d => d.image,
    sample: () => base.news,
  },
  {
    kind: 'photo', label: 'Gallery photos', noun: 'photo', reorder: true, bulk: true,
    fields: [
      { key: 'src', label: 'Photo', type: 'image', folder: 'gallery', maxSide: 1600, thumbKey: 'thumb', thumbSide: 640, required: true },
      { key: 'thumb', type: 'hidden' },
      { key: 'caption', label: 'Caption', type: 'text', required: true },
      { key: 'alt', label: 'Description for screen readers', type: 'text', help: 'Say what is in the photo, for visitors who cannot see it.' },
      { key: 'year', label: 'Year', type: 'number', required: true },
      { key: 'source', label: 'Photo credit', type: 'text', help: 'Who took it or supplied it.' },
      { key: 'sourceUrl', label: 'Credit link', type: 'text', help: 'Optional web address of the original.' },
      { key: 'focus', label: 'Which part to keep when cropped', type: 'select', options: FOCUS },
      { key: 'featured', label: 'Show in the photo strip on the home page', type: 'checkbox' },
    ],
    title: d => d.caption, summary: d => [d.year, d.source].filter(Boolean).join(' · '), preview: d => d.thumb || d.src,
    sample: () => base.photos.map(({ id, ...p }) => p),
  },
  {
    kind: 'mwirian', label: 'Prominent Mwirians', noun: 'profile', reorder: false,
    fields: [
      { key: 'name', label: 'Full name', type: 'text', required: true },
      { key: 'field', label: 'Field', type: 'select', options: base.mwirianFields, required: true },
      { key: 'knownFor', label: 'Known for', type: 'text', required: true, help: 'One line shown on the card, for example “Former Justice of the Supreme Court”.' },
      { key: 'cohort', label: 'Cohort (year the class started S1)', type: 'text', placeholder: '1995' },
      { key: 'cohortName', label: 'Cohort name', type: 'text', placeholder: 'Solida' },
      { key: 'houses', label: 'Houses', type: 'houses' },
      { key: 'photo', label: 'Photo', type: 'image', folder: 'mwirians', maxSide: 800 },
      { key: 'bio', label: 'Biography', type: 'paragraphs', rows: 8, help: 'Optional. Leave a blank line between paragraphs.' },
      { key: 'featured', label: 'List first', type: 'checkbox' },
      { key: 'deceased', label: 'Show “Late” before the name', type: 'checkbox' },
    ],
    title: d => d.name, summary: d => [d.field, d.cohort && `Cohort ${d.cohort}`].filter(Boolean).join(' · '), preview: d => d.photo,
    sample: () => base.prominentMwirians,
  },
  {
    kind: 'archive', label: 'Archives', noun: 'record', reorder: false,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'year', label: 'Year', type: 'number', required: true },
      { key: 'category', label: 'Category', type: 'select', options: base.archiveCategories, required: true },
      { key: 'summary', label: 'One-line summary', type: 'text' },
      { key: 'file', label: 'Document', type: 'file', folder: 'archives', required: true, sizeKey: 'size', help: 'Upload a PDF (up to 10 MB) or paste a link to a file hosted elsewhere.' },
      { key: 'size', label: 'File size shown to visitors', type: 'text', placeholder: '1.2 MB', help: 'Filled in automatically when you upload.' },
      { key: 'source', label: 'Supplied by', type: 'text' },
    ],
    title: d => d.title, summary: d => [d.year, d.category].filter(Boolean).join(' · '),
    sample: () => base.archives,
  },
  {
    kind: 'project', label: 'Projects', noun: 'project', reorder: true,
    fields: [
      { key: 'title', label: 'Project name', type: 'text', required: true },
      { key: 'year', label: 'Year', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'Planned'], required: true, help: 'Only ongoing projects appear on the Donate page.' },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 3, required: true },
      { key: 'image', label: 'Picture', type: 'image', folder: 'projects', maxSide: 1200 },
      { key: 'progress', label: 'Progress (0 to 100)', type: 'number', help: 'Shows a progress bar. Leave empty to hide it.' },
      { key: 'goal', label: 'Funding goal (UGX)', type: 'number' },
      { key: 'raised', label: 'Amount raised so far (UGX)', type: 'number' },
    ],
    title: d => d.title, summary: d => [d.year, d.status].filter(Boolean).join(' · '), preview: d => d.image,
    sample: () => base.projects,
    validate: d => (d.progress != null && (d.progress < 0 || d.progress > 100) ? 'Progress must be between 0 and 100.' : ''),
  },
  {
    kind: 'leader', label: 'Leadership', noun: 'leader', reorder: true,
    fields: [
      { key: 'name', label: 'Full name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text', required: true, help: 'The first two leaders in the list are shown as President and Vice President on the About page.' },
      { key: 'cohort', label: 'Cohort (year the class started S1)', type: 'text', placeholder: '1995' },
      { key: 'cohortName', label: 'Cohort name', type: 'text', placeholder: 'Solida' },
      { key: 'houses', label: 'Houses', type: 'houses' },
      { key: 'photo', label: 'Photo', type: 'image', folder: 'leaders', maxSide: 800 },
      { key: 'bio', label: 'Biography', type: 'paragraphs', rows: 8, help: 'Leave a blank line between paragraphs. The first paragraph is the short version on the card.' },
    ],
    title: d => d.name, summary: d => d.role, preview: d => d.photo,
    sample: () => base.leaders,
  },
  {
    kind: 'setting', label: 'Site details', noun: 'site details', single: true, key: 'site',
    fields: [
      { key: 'email', label: 'Association email', type: 'text' },
      { key: 'phone', label: 'Phone number', type: 'text', help: 'Leave empty to hide it on the site.' },
      { key: 'address', label: 'Postal address', type: 'text' },
      { key: 'website', label: 'Website address', type: 'text', placeholder: 'www.mwirian.org' },
      { key: 'orderEmail', label: 'Where store orders are emailed', type: 'text' },
      { key: 'motto', label: 'Motto shown in the header', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'leadersTerm', label: 'Executive term', type: 'text', placeholder: '2026–2028' },
      { key: 'social.linkedin', label: 'LinkedIn link', type: 'text', help: 'Social icons show in the footer only when a link is set.' },
      { key: 'social.facebook', label: 'Facebook link', type: 'text' },
      { key: 'social.instagram', label: 'Instagram link', type: 'text' },
      { key: 'social.x', label: 'X link', type: 'text' },
      { key: 'donate', label: 'Ways to give', type: 'methods', help: 'Bank and mobile money details shown on the Donate page. Only add accounts the executive has confirmed.' },
    ],
    title: () => 'Site details', summary: () => 'Contact details, social links and donation accounts',
    defaults: () => ({
      email: base.site.email, phone: base.site.phone, address: base.site.address, website: base.site.website,
      orderEmail: base.site.orderEmail, motto: base.site.motto, tagline: base.site.tagline,
      leadersTerm: base.leadersTerm, social: base.site.social, donate: base.site.donate,
    }),
  },
]

// ---------- form helpers ----------
const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o)
function put(o, path, value) {
  const keys = path.split('.')
  const out = { ...o }
  let cur = out
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k] }
  })
  return out
}

// Drops empty values so optional fields simply disappear from the stored item.
export function clean(v) {
  if (Array.isArray(v)) {
    const arr = v.map(clean).filter(x => x !== undefined)
    return arr.length ? arr : undefined
  }
  if (v && typeof v === 'object') {
    const out = {}
    for (const [k, x] of Object.entries(v)) {
      const c = clean(x)
      if (c !== undefined) out[k] = c
    }
    return Object.keys(out).length ? out : undefined
  }
  if (v === '' || v === null || v === undefined || v === false) return undefined
  return v
}

// Stored data -> what the form inputs hold (everything is a string, array of strings, or boolean).
export function toForm(section, data = {}) {
  const f = {}
  for (const fd of section.fields) {
    const v = get(data, fd.key)
    if (fd.type === 'paragraphs') f[fd.key] = Array.isArray(v) ? v.join('\n\n') : v || ''
    else if (fd.type === 'houses') f[fd.key] = Array.isArray(v) ? v : []
    else if (fd.type === 'methods') f[fd.key] = Array.isArray(v) ? v.map(m => ({ label: m.label || '', lines: (m.lines || []).join('\n') })) : []
    else if (fd.type === 'checkbox') f[fd.key] = Boolean(v)
    else f[fd.key] = v == null ? '' : String(v)
  }
  return f
}

const toNumber = s => {
  const n = Number(String(s).replace(/[^\d.-]/g, ''))
  return String(s).trim() === '' || Number.isNaN(n) ? undefined : n
}

// Form -> stored data. Properties the form does not know about (for example an article's slug) are kept.
export function fromForm(section, form, original = {}) {
  let out = JSON.parse(JSON.stringify(original || {}))
  for (const fd of section.fields) {
    const v = form[fd.key]
    let value
    switch (fd.type) {
      case 'paragraphs': value = String(v || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean); break
      case 'houses': value = v; break
      case 'methods': value = (v || []).map(m => ({ label: m.label.trim(), lines: m.lines.split('\n').map(l => l.trim()).filter(Boolean) })).filter(m => m.label); break
      case 'checkbox': value = Boolean(v); break
      case 'number': value = toNumber(v); break
      default: value = String(v ?? '').trim()
    }
    out = put(out, fd.key, value)
  }
  return clean(out) || {}
}

// Returns a list of problems that stop an item being published (empty list = fine).
export function problems(section, data) {
  const list = []
  for (const fd of section.fields) {
    if (!fd.required) continue
    const v = get(data, fd.key)
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) list.push(`${fd.label} is required.`)
  }
  const extra = section.validate?.(data)
  if (extra) list.push(extra)
  return list
}
