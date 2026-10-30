// Admin-side calls for editing website content. Everything here runs with the signed-in staff member's
// session; the database decides what they are allowed to do (see 202610270003_site_content.sql).
import { supabase } from './supabase.js'
import { loadContent } from './siteContent.js'
import { MAX_PDF_MB } from './uploadLimits.js'

export const BUCKET = 'site-media'

// 'admin', 'editor' or null. Falls back to the older admin check if the content migration is not applied yet.
export async function getRole() {
  const r = await supabase.rpc('moba_admin_role')
  if (!r.error) return { role: r.data || null }
  const a = await supabase.rpc('moba_is_admin')
  return a.error ? { role: null, error: a.error } : { role: a.data ? 'admin' : null, legacy: true }
}

export async function listRows(kind) {
  return supabase.from('site_content').select('*').eq('kind', kind)
    .order('position', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false })
}

export const createRow = (kind, draft, position = null, key = null) =>
  supabase.from('site_content').insert({ kind, key, position, draft }).select().single()
export const saveDraft = (id, draft) => supabase.from('site_content').update({ draft }).eq('id', id)
export const discardDraft = id => supabase.from('site_content').update({ draft: null }).eq('id', id)
export const removeRow = id => supabase.from('site_content').delete().eq('id', id).select('id')
export const publishRow = id => supabase.rpc('moba_publish_content', { p_id: id })
export const unpublishRow = id => supabase.rpc('moba_unpublish_content', { p_id: id })
export const importItems = (kind, items, key = null) => supabase.rpc('moba_import_content', { p_kind: kind, p_items: items, p_key: key })
export const setPosition = (id, position) => supabase.from('site_content').update({ position }).eq('id', id)

// Visitors only see changes after the public copy is refreshed, so do it right after publishing.
export const refreshSite = () => loadContent()

export function rowState(row) {
  if (row.live && row.draft) return 'changes'
  return row.live ? 'published' : 'draft'
}

// ---------- uploads ----------
const slug = s => String(s).toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'file'
const stamp = () => `${new Date().getFullYear()}/${Math.random().toString(36).slice(2, 10)}`

// Shrinks a picture in the browser (phone photos are often 5 MB or more) and converts it to WebP.
async function shrink(file, maxSide, quality = 0.82) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  let blob = await new Promise(res => canvas.toBlob(res, 'image/webp', quality))
  if (!blob || blob.type !== 'image/webp') blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality))
  if (!blob) throw new Error('This picture could not be read. Try a JPG or PNG file.')
  return { blob, ext: blob.type === 'image/webp' ? 'webp' : 'jpg' }
}

async function put(path, blob, contentType) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType, cacheControl: '31536000' })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function uploadImage(file, folder, maxSide = 1600) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a picture (JPG, PNG or WebP).')
  if (file.size > 30 * 1024 * 1024) throw new Error('That picture is larger than 30 MB. Please choose a smaller one.')
  const { blob, ext } = await shrink(file, maxSide)
  return put(`${folder}/${stamp()}-${slug(file.name)}.${ext}`, blob, blob.type)
}

export async function uploadPdf(file, folder) {
  if (file.type !== 'application/pdf') throw new Error('Please choose a PDF file.')
  if (file.size > MAX_PDF_MB * 1024 * 1024) throw new Error(`That PDF is larger than ${MAX_PDF_MB} MB. Please compress it and try again.`)
  const url = await put(`${folder}/${stamp()}-${slug(file.name)}.pdf`, file, 'application/pdf')
  const mb = file.size / (1024 * 1024)
  return { url, size: mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB` }
}
