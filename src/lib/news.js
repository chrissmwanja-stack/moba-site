// Helpers for news and event articles.
export const slugify = s =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// An item can set its own `slug`; otherwise it is the date plus the title, which stays unique
// even when the same event (for example the AGM) comes round every year.
export const newsSlug = n => n.slug || `${n.date}-${slugify(n.title)}`
export const newsPath = n => `/news/${newsSlug(n)}`

// `body` can be an array of paragraphs, or one string with blank lines between paragraphs.
export const bodyParagraphs = body =>
  Array.isArray(body) ? body : body ? String(body).split(/\n{2,}/).map(p => p.trim()).filter(Boolean) : []
