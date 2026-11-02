// "Who is editing?" calls. Staff share one login, so each person also picks their name and enters a PIN.
// The database remembers who is editing for this browser sign-in and writes it into the activity log
// (see supabase/migrations/202610310001_editor_audit_trail.sql). Nothing here is trusted by the database:
// it checks the PIN and the sign-in itself.
import { supabase } from './supabase.js'

// True when the audit migration has not been applied yet. The site then works as before.
const notInstalled = e => /does not exist|schema cache|could not find the function|PGRST202|42883/i.test(`${e?.code || ''} ${e?.message || ''}`)

async function call(name, args) {
  const { data, error } = await supabase.rpc(name, args)
  if (error) return { ok: false, message: error.message, notInstalled: notInstalled(error) }
  return data && typeof data === 'object' && !Array.isArray(data) ? data : { ok: true }
}

// { installed, person: { id, name } | null }
export async function currentEditor() {
  const { data, error } = await supabase.rpc('moba_current_editor')
  if (error) return { installed: !notInstalled(error), person: null, error }
  const row = Array.isArray(data) ? data[0] : data
  return { installed: true, person: row ? { id: row.person_id, name: row.person_name } : null }
}

export async function editorChoices() {
  const { data, error } = await supabase.rpc('moba_editor_choices')
  if (error) return { people: [], error }
  return { people: (data || []).map(r => ({ id: r.person_id, name: r.person_name })) }
}

export const startEditing = (personId, pin) => call('moba_start_editing', { p_person: personId, p_pin: pin })
export const changeMyPin = (oldPin, newPin) => call('moba_change_my_pin', { p_old: oldPin, p_new: newPin })
export async function stopEditing() { try { await supabase.rpc('moba_stop_editing') } catch { /* signing out anyway */ } }

export async function listEditors() {
  const { data, error } = await supabase.rpc('moba_list_editors')
  if (error) return { editors: [], error }
  return { editors: (data || []).map(r => ({ id: r.person_id, name: r.person_name, active: r.active, lockedUntil: r.locked_until })) }
}
export const addEditor = (name, pin) => call('moba_add_editor', { p_name: name, p_pin: pin })
export const setEditorActive = (id, active) => call('moba_set_editor_active', { p_person: id, p_active: active })
export const resetEditorPin = (id, pin) => call('moba_reset_editor_pin', { p_person: id, p_pin: pin })
export const restoreVersion = logId => call('moba_restore_content_version', { p_log_id: logId })

// Newest entries first; the heavy before/after copies are only fetched when someone opens an entry.
const LIST_COLUMNS = 'id,at,person_name,action,table_name,record_id,summary,changed_fields'
export async function loadActivity({ area, person, search, before, size = 50 }) {
  let q = supabase.from('moba_audit_log').select(LIST_COLUMNS).order('id', { ascending: false }).limit(size)
  if (area?.tables === null) q = q.is('table_name', null)
  else if (area?.tables) q = q.in('table_name', area.tables)
  if (person) q = q.eq('person_name', person)
  if (search) q = q.ilike('summary', `%${search.replace(/[%_]/g, m => `\\${m}`)}%`)
  if (before) q = q.lt('id', before)
  return q
}
export const loadVersions = id => supabase.from('moba_audit_log').select('old_data,new_data').eq('id', id).single()
export const loadPeopleInLog = () => supabase.from('moba_audit_log').select('person_name').order('id', { ascending: false }).limit(1000)
