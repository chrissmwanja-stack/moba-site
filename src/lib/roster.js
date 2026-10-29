// Split an ordered roster into balanced vertical columns without changing its numbering.
// Earlier columns receive one extra item when the total does not divide evenly.
export function balancedColumns(items, columnLimit = 4) {
  const list = Array.isArray(items) ? items : []
  const limit = Number.isInteger(columnLimit) && columnLimit > 0 ? columnLimit : 1
  const count = Math.min(limit, list.length)
  if (!count) return []

  const minimum = Math.floor(list.length / count)
  const largerColumns = list.length % count
  let offset = 0

  return Array.from({ length: count }, (_, index) => {
    const size = minimum + (index < largerColumns ? 1 : 0)
    const column = { start: offset + 1, items: list.slice(offset, offset + size) }
    offset += size
    return column
  })
}
