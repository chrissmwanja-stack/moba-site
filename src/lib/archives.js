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

export const archiveSearchText = a =>
  [a.title, a.summary, a.period, a.year, a.category].filter(Boolean).join(' ').toLowerCase()

// Distinct years in the order they first appear (null stands for "Undated").
export const archiveYears = list => [...new Set(list.map(archiveYear))]

export const yearHeading = y => (y === null ? 'Undated' : String(y))

// What visitors see as the date of a record: the period if given, else the year, else "Undated".
export const archiveWhen = a => a.period || (archiveYear(a) ?? 'Undated')
