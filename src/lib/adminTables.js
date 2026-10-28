// What the admin screen shows for each submissions table.
// Every `fields` entry is [label, (row) => text]; empty values are hidden.

const ugx = n => 'UGX ' + Number(n || 0).toLocaleString('en-UG')
const list = a => (Array.isArray(a) ? a : [])

export const TABS = [
  {
    id: 'register', table: 'members', label: 'Member register', empty: 'No member accounts yet.',
    statuses: ['pending', 'active', 'suspended', 'rejected'], newStatus: 'pending',
    // Changing status goes through moba_set_member_status(), which issues the MOBA number on approval.
    statusRpc: true,
    // Editable on the card. Check these before approving: the MOBA number is built from them and never changes.
    edit: [['cohort', 'Cohort year', 'year'], ['house', 'House', 'house'], ['paid_until', 'Subscribed until', 'date']],
    title: r => r.name,
    summary: r => [r.moba_number, r.cohort && `Cohort ${r.cohort}`, r.house].filter(Boolean).join(', '),
    fields: [
      ['Email', r => r.email], ['Phone', r => r.phone], ['MOBA number', r => r.moba_number],
      ['Cohort', r => r.cohort], ['House', r => r.house], ['Subscribed until', r => r.paid_until],
      ['Approved', r => (r.approved_at ? when(r.approved_at) : '')],
    ],
  },
  {
    id: 'orders', table: 'orders', label: 'Store orders', empty: 'No orders yet.',
    statuses: ['new', 'confirmed', 'delivered', 'cancelled'],
    title: r => `${r.ref}: ${r.name}`,
    summary: r => `${ugx(r.total_ugx)}, pay on delivery`,
    fields: [
      ['Phone', r => r.phone], ['Email', r => r.email], ['Cohort', r => r.cohort],
      ['Delivery address', r => r.address], ['Notes', r => r.notes],
      ['Items', r => list(r.items).map(i => `${i.qty} x ${i.name} (${ugx(i.price)})`).join('\n')],
      ['Total', r => ugx(r.total_ugx)],
    ],
  },
  {
    id: 'membership', table: 'membership_applications', label: 'Membership', empty: 'No membership applications yet.',
    statuses: ['new', 'contacted', 'paid', 'rejected'],
    title: r => r.name,
    summary: r => `${r.plan_name}, ${ugx(r.amount_ugx)}`,
    fields: [
      ['Plan', r => r.plan_name], ['Amount', r => ugx(r.amount_ugx)],
      ['Phone', r => r.phone], ['Email', r => r.email], ['Cohort', r => r.cohort],
      ['Payment method', r => r.payment_method], ['Payment reference / transaction ID', r => r.payment_reference],
      ['Payer phone', r => r.payment_phone],
    ],
  },
  {
    id: 'funeral', table: 'funeral_enrolments', label: 'Funeral cover', empty: 'No funeral cover enrolments yet.',
    statuses: ['new', 'contacted', 'paid', 'active', 'rejected'],
    title: r => r.name,
    summary: r => `${list(r.dependants).length} dependant${list(r.dependants).length === 1 ? '' : 's'}`,
    fields: [
      ['Phone', r => r.phone], ['Email', r => r.email], ['Cohort', r => r.cohort],
      ['Payment method', r => r.payment_method], ['Payment reference / transaction ID', r => r.payment_reference],
      ['Payer phone', r => r.payment_phone],
      ['Next of kin', r => `${r.kin_name} (${r.kin_phone})`],
      ['Dependants', r => list(r.dependants).map((d, i) => `${i + 1}. ${d.name}, ${d.relationship}${d.born ? `, born ${d.born}` : ''}`).join('\n')],
    ],
  },
  {
    id: 'members', table: 'member_updates', label: 'Member details', empty: 'No member detail updates yet.',
    statuses: ['new', 'reviewed', 'added', 'rejected'],
    title: r => r.name,
    summary: r => [r.cohort && `Cohort ${r.cohort}`, r.location].filter(Boolean).join(', '),
    statusRpc: 'moba_set_member_update_status',
    note: 'Setting a verified submission to Added applies it to the member record matched by email. Submissions without exactly one matching member cannot be applied.',
    fields: [
      ['Email', r => r.email], ['Phone', r => r.phone], ['Cohort', r => r.cohort], ['Year left', r => r.year_left],
      ['Location', r => r.location], ['Profession', r => r.profession],
      ['Happy to help with', r => list(r.help_with).join(', ')],
      ['Applied to member ID', r => r.applied_member_id], ['Applied at', r => r.applied_at && when(r.applied_at)],
    ],
  },
  {
    id: 'profile_requests', table: 'member_profile_change_requests', label: 'Profile requests', empty: 'No official profile changes are awaiting review.',
    statuses: ['pending', 'approved', 'rejected'], newStatus: 'pending', statusRpc: 'moba_resolve_member_profile_change',
    title: r => r.member_name,
    summary: r => [r.member_email, r.requested_name && `Name: ${r.requested_name}`, r.requested_cohort && `Cohort ${r.requested_cohort}`, r.requested_house && `${r.requested_house} House`].filter(Boolean).join(' · '),
    fields: [
      ['Email', r => r.member_email], ['Current name', r => r.member_name], ['Current cohort', r => r.current_cohort], ['Current house', r => r.current_house],
      ['Requested name', r => r.requested_name], ['Requested cohort', r => r.requested_cohort], ['Requested house', r => r.requested_house],
      ['Reason', r => r.reason], ['Resolved at', r => r.resolved_at && when(r.resolved_at)],
    ],
  },
  {
    id: 'messages', table: 'contact_messages', label: 'Messages', empty: 'No messages yet.',
    statuses: ['new', 'answered', 'spam'],
    title: r => r.name,
    summary: r => r.topic,
    fields: [['Email', r => r.email], ['Topic', r => r.topic], ['Message', r => r.message]],
  },
]

export const when = iso =>
  new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

// CSV for the secretary to open in Excel or Sheets.
// Submissions are typed by strangers, so a cell that starts with = + - @ could run as a
// formula in a spreadsheet: prefix those with an apostrophe.
const cell = v => {
  let s = String(v ?? '')
  const isPhoneLike = /^[+-][\d\s().-]+$/.test(s) // "+256 700 000000" is safe and must stay as typed
  if (/^[=+\-@\t\r]/.test(s) && !isPhoneLike) s = "'" + s
  return `"${s.replace(/"/g, '""')}"`
}

export function toCsv(tab, rows) {
  const head = ['Received', 'Status', 'Title', ...tab.fields.map(f => f[0]), 'Admin notes']
  const lines = rows.map(r => [
    when(r.created_at), r.status, tab.title(r),
    ...tab.fields.map(([, get]) => get(r) ?? ''),
    r.admin_notes ?? '',
  ].map(cell).join(','))
  return '\uFEFF' + [head.map(cell).join(','), ...lines].join('\r\n')
}
