// Ordering, grouping and search for archive records. Pure functions so they can be unit-tested in Node.
// A record's `year` is optional: records without a usable year are listed last, under "Undated".

export const archiveYear = a => {
  if (a?.year === '' || a?.year == null) return null
  const n = Number(a.year)
  return Number.isFinite(n) ? n : null
}

// Newest first; undated records last; ties broken by title.
export function sortArchives(list) {
  return [...list].sort((a, b) => {
    const ya = archiveYear(a)
    const yb = archiveYear(b)
    if (ya === yb) return String(a.title || '').localeCompare(String(b.title || ''))
    if (ya === null) return 1
    if (yb === null) return -1
    return yb - ya
  })
}

// The story as a list of paragraphs (stored as a list, but a plain string is tolerated).
export const archiveStory = a => {
  const raw = Array.isArray(a?.story) ? a.story : typeof a?.story === 'string' ? a.story.split(/\n{2,}/) : []
  return raw.map(p => String(p).trim()).filter(Boolean)
}

export const archiveSearchText = a =>
  [a.title, a.author, a.summary, ...archiveStory(a), a.period, a.year, a.category].filter(Boolean).join(' ').toLowerCase()

// Distinct years in the order they first appear (null stands for "Undated").
export const archiveYears = list => [...new Set(list.map(archiveYear))]

export const yearHeading = y => (y === null ? 'Undated' : String(y))

// What visitors see as the date of a record: the period if given, else the year, else "Undated".
export const archiveWhen = a => a.period || (archiveYear(a) ?? 'Undated')

// A record is either a document (has a file) or a photograph-only record (picture, no file).
export const isPhotoOnly = a => !String(a?.file || '').trim() && Boolean(String(a?.cover || '').trim())

// ---------- pages for records with a story ----------
const slugText = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Web address of a record's own page: its title plus its year. Records that would share an address
// get a short suffix (from the stored id when there is one) so every page stays reachable.
export function withSlugs(list) {
  const base = list.map(a => {
    const year = archiveYear(a)
    return slugText(`${a.title || ''} ${year ?? ''}`) || 'record'
  })
  const seen = {}
  base.forEach(b => { seen[b] = (seen[b] || 0) + 1 })
  const used = {}
  return list.map((a, i) => {
    const b = base[i]
    if (seen[b] === 1) return { ...a, slug: b }
    used[b] = (used[b] || 0) + 1
    const suffix = a._id ? String(a._id).replace(/[^a-z0-9]/gi, '').slice(0, 6).toLowerCase() : String(used[b])
    return { ...a, slug: `${b}-${suffix || used[b]}` }
  })
}

export const archivePath = a => `/archives/${a.slug}`
export const findArchive = (list, slug) => withSlugs(list).find(a => a.slug === slug) || null
