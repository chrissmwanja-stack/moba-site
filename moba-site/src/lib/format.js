export const ugx = n => 'UGX ' + Number(n).toLocaleString('en-UG')

// Event dates are plain calendar days (YYYY-MM-DD). new Date() reads them as UTC midnight,
// so format in UTC too; otherwise visitors west of Greenwich (e.g. the US) see the day before.
export const formatDate = (d, month = 'short') =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' })
