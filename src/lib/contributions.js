import { supabase } from './supabase.js'
import { notifyAdmin } from './forms.js'
import { contributionType, TYPES } from './contributionFiles.js'

export * from './contributionFiles.js'

// Uploads the files to the member's private folder, then saves the contribution. If anything fails the
// uploaded files are removed again so nothing is left behind. Returns { ok } or { ok: false, error }.
export async function submitContribution({ userId, title, message, files }) {
  const uploaded = []
  try {
    for (const file of files) {
      const type = contributionType(file)
      const path = `${userId}/${crypto.randomUUID()}.${TYPES[type]}`
      const { error } = await supabase.storage.from('member-contributions').upload(path, file, { contentType: type, upsert: false })
      if (error) throw error
      uploaded.push({ path, name: file.name.slice(0, 120), size: file.size, type })
    }
    const { error } = await supabase.from('member_contributions').insert({ title: title.trim(), message: message.trim() || null, files: uploaded })
    if (error) throw error
    notifyAdmin({
      subject: `MOBA website: member contribution, ${title.trim()}`,
      from_name: 'MOBA website',
      message: `A member sent ${uploaded.length} file(s): ${title.trim()}. Open /admin and choose Contributions to review them.`,
    })
    return { ok: true }
  } catch (e) {
    if (uploaded.length) await supabase.storage.from('member-contributions').remove(uploaded.map(u => u.path)).catch(() => {})
    const msg = String(e?.message || '')
    return { ok: false, error: /row-level security|only active members|policy/i.test(msg)
      ? 'Only active members can send files. Please sign in with your member account, or write to us without files.'
      : 'We could not send your files. Please check your connection and try again.' }
  }
}
