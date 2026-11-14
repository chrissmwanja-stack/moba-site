// Keep MAX_CONTRIBUTION_MB in step with the `member-contributions` bucket limit
// (supabase/migrations/202611140001_member_contributions.sql).
export const MAX_CONTRIBUTION_MB = 25
export const MAX_CONTRIBUTION_FILES = 10
export const CONTRIBUTION_ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,.docx'

export const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}
const BY_EXTENSION = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }

// The type the file will be stored as (phones sometimes leave the browser type empty), or '' if not allowed.
export function contributionType(file) {
  if (TYPES[file.type]) return file.type
  const ext = String(file.name || '').toLowerCase().split('.').pop()
  return BY_EXTENSION[ext] || ''
}

// A plain-language problem with this file, or '' if it is fine.
export function checkContributionFile(file) {
  if (!contributionType(file)) return `“${file.name}” is not a supported type. Send JPG, PNG or WebP pictures, PDFs, or Word (.docx) articles.`
  if (file.size > MAX_CONTRIBUTION_MB * 1024 * 1024) return `“${file.name}” is larger than ${MAX_CONTRIBUTION_MB} MB. Please send a smaller copy.`
  if (file.size === 0) return `“${file.name}” is empty.`
  return ''
}

export function checkContributionFiles(existing, added) {
  if (existing.length + added.length > MAX_CONTRIBUTION_FILES) return `You can send up to ${MAX_CONTRIBUTION_FILES} files at a time.`
  for (const f of added) { const p = checkContributionFile(f); if (p) return p }
  return ''
}

export const fileSize = bytes => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)
