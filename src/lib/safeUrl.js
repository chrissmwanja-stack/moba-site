// Links typed into the admin content editor end up in href attributes. React does not block
// "javascript:" URLs, so an editor account could plant a script that runs for every visitor who
// clicks it (and would run with a signed-in admin's session). Only these shapes are allowed:
// a path on this site, or an http(s) / mailto / tel address. Anything else becomes null.
export function safeUrl(value) {
  const s = String(value ?? '').trim()
  if (!s) return null
  if (s.startsWith('/') && !s.startsWith('//') && !s.includes('\\')) return s
  return /^(https?:\/\/|mailto:|tel:)/i.test(s) ? s : null
}
