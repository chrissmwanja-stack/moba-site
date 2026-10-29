import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = fileURLToPath(new URL('../supabase/migrations/', import.meta.url))
const filenames = readdirSync(directory).filter(name => name.endsWith('.sql')).sort()
const pattern = /^(\d{12})_([a-z0-9]+(?:_[a-z0-9]+)*)\.sql$/
const versions = new Set()
const names = new Set()
let previous = ''

if (filenames.length === 0) throw new Error('No SQL migrations were found.')

for (const filename of filenames) {
  const match = filename.match(pattern)
  if (!match) throw new Error(`Invalid migration filename: ${filename}. Expected YYYYMMDDNNNN_descriptive_name.sql.`)
  const [, version, name] = match
  if (versions.has(version)) throw new Error(`Duplicate migration version: ${version}`)
  if (names.has(name)) throw new Error(`Duplicate migration name: ${name}`)
  if (version <= previous) throw new Error(`Migration versions are not strictly increasing near ${filename}`)
  versions.add(version)
  names.add(name)
  previous = version

  const sql = readFileSync(join(directory, filename), 'utf8')
  if (!sql.trim()) throw new Error(`Migration is empty: ${filename}`)
  if (/^(<{7}|={7}|>{7})/m.test(sql)) throw new Error(`Unresolved merge conflict marker in ${filename}`)
}

console.log(`PASS: ${filenames.length} migrations have unique, ordered versions, valid names, content and no conflict markers.`)
