// All site content lives here. Edit this file, not the pages.

export const site = {
  name: 'MOBA',
  fullName: 'Mwiri Old Boys Association',
  school: 'Mwiri',                  // TODO: confirm official school name
  tagline: 'Once a Mwirian, always a Mwirian.', // TODO: confirm motto/tagline
  founded: 1911,
  schoolYears: 6,                  // classes from S1 to S6; join in S1 in 2001, finish S6 in 2006
  email: 'info@mwirian.org',       // TODO
  phone: '+256 000 000 000',        // TODO
  orderEmail: 'orders@mwirian.org', // TODO: where store orders are sent (use a shared admin mailbox)
}

export const stats = [
  { label: 'Years of brotherhood', value: new Date().getFullYear() - site.founded },
  { label: 'Projects delivered', value: 12 },        // TODO
  { label: 'Members worldwide', value: '1,500+' },   // TODO
]

export const timeline = [
  { year: 1911, title: 'The beginning', text: 'Replace with the story of how Mwiri and MOBA began.' },
  { year: 1950, title: 'A milestone', text: 'Replace with a key milestone.' },
  { year: 1995, title: 'A milestone', text: 'Replace with a key milestone.' },
  { year: 2026, title: 'Going digital', text: 'The association launches its online home.' },
]

export const projects = [
  { year: 2024, title: 'Project title', summary: 'Replace with project summary.', status: 'Completed' },
  { year: 2019, title: 'Project title', summary: 'Replace with project summary.', status: 'Ongoing' },
  { year: 2015, title: 'Project title', summary: 'Replace with project summary.', status: 'Completed' },
]

// Publicly sourced photos. Please confirm reuse permission before launch.
// Image credits and original articles are recorded with each entry.
export const photos = [
  {
    id: 1,
    src: 'https://newvision-media.s3.amazonaws.com/cms/f1d80e41-1588-47dc-80c0-bdbc721da698.jpg',
    caption: 'Busoga College Mwiri’s new main gate — Photo: Donald Kiirya / New Vision',
    year: 2025,
    source: 'New Vision',
    sourceUrl: 'https://www.newvision.co.ug/category/education/busoga-college-mwiri-celebrates-114-years-com-NV_221954_082026',
  },
  {
    id: 2,
    src: 'https://mwiri.sc.ug/wp-content/uploads/Sports-equipment-handover2-1.jpg',
    caption: 'MOBA alumni sports equipment handover at Busoga College Mwiri',
    year: 2025,
    source: 'Busoga College Mwiri',
    sourceUrl: 'https://mwiri.sc.ug/busoga-college-mwiri-leadership-from-alumni-to-future-leaders-inspiration/',
  },

  
  {
    id: 3,
    src: '/images/gallery/mwiri-library.jpg',
    caption: 'Muljibhai Madhvani Library, Busoga College Mwiri',
    year: 2026,
    source: 'MOBA',
  },
  {
    id: 4,
    src: '/images/gallery/moba-alumni-gathering.jpg',
    caption: 'MOBA members gathered at Busoga College Mwiri',
    year: 2026,
    source: 'MOBA',
  },

]

// ---------- STORE ----------
// PRICES ARE PLACEHOLDERS (UGX) until costs are confirmed.
// delivery: 'digital' = instant download/e-mail, 'physical' = needs an address.
// image: put files in /public/store and use '/store/tie.jpg'
export const products = [
  { id: 'tie',    name: 'MOBA Old Boys Tie',     price: 50000,  delivery: 'physical', image: null, blurb: 'Navy silk tie with the gold leopard crest.' },
  { id: 'polo',   name: 'MOBA Polo Shirt',       price: 70000,  delivery: 'physical', image: null, blurb: 'Navy polo with embroidered shield.' },
  { id: 'cap',    name: 'MOBA Cap',              price: 35000,  delivery: 'physical', image: null, blurb: 'Navy cap, gold crest.' },
  { id: 'pin',    name: 'Lapel Pin',             price: 20000,  delivery: 'physical', image: null, blurb: 'Enamel shield pin.' },
  { id: 'mug',    name: 'Commemorative Mug',     price: 25000,  delivery: 'physical', image: null, blurb: 'Est. 1911 commemorative mug.' },
]

// ---------- MEMBERSHIP ----------
// PRICES ARE PLACEHOLDERS (UGX) until costs are confirmed.
export const tiers = [
  { id: 'annual', name: 'Annual Member', price: 50000,  period: 'year',     perks: ['Membership register listing', 'Event invitations', 'Digital membership card'] },
  
  { id: 'life',   name: 'Life Member',   price: 1010000, period: 'one-off',  perks: ['Lifetime membership', 'Name on the Life Members roll', 'MOBA tie and pin'] },
]

// ---------- NEWS & EVENTS ----------
// date: YYYY-MM-DD. category must be one of newsCategories below (the News page filter uses them).
// Optional: series ('Throwback', 'Cohort spotlight'), image ('/news/name.webp'), place, body.
// Items dated today or later show as Upcoming. All entries are placeholders.
export const newsCategories = ['Reunion', 'Meeting', 'Cohort', 'Project', 'News']
export const news = [
  { date: '2026-12-05', category: 'Meeting', title: 'Annual General Meeting', place: 'Venue TBC', excerpt: 'Replace with details of the meeting.' },
  { date: '2026-11-14', category: 'Reunion', title: 'Old Boys Reunion', place: 'Venue TBC', excerpt: 'Replace with details of the reunion.' },
  { date: '2026-08-10', category: 'News', title: 'MOBA launches its new website', place: '', excerpt: 'The association now has an online home for news, history and memorabilia.' },
]

// ---------- BRANCHES & COHORTS ----------
// Branches: local chapters. Cohorts: named by the year the group joined school.
// Keep contact details to role names or association addresses while the repo is public.
// whatsapp: a full invite link ('https://chat.whatsapp.com/...') or null.
export const branches = [
  { name: 'Kampala', region: 'Uganda', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
  { name: 'Jinja', region: 'Uganda', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
  { name: 'United Kingdom', region: 'Diaspora', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
]

// Cohorts are named by the year of JOINING Mwiri. Every year from founded to now is shown
// on the page automatically. List a year here only when it has a known group.
// Years not listed show "No group yet".
// { year, contact: 'Role or name', email: null, whatsapp: 'https://chat.whatsapp.com/...' | null }
export const cohorts = [
  { year: 1985, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1994, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2002, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2010, contact: 'Cohort coordinator', email: null, whatsapp: null },
]

// ---------- LEADERSHIP ----------
// Put photos in /public/leaders and set photo: '/leaders/name.jpg'. All entries are placeholders.
export const leaders = [
  { name: 'Name Surname', role: 'President', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Vice President', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Secretary General', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Assistant Secretary General', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Treasurer', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Assistant Treasurer', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Publicity Secretary', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Executive Member', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Executive Member', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Executive Member', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Executive Member', cohort: 'Year', photo: null },
  { name: 'Name Surname', role: 'Executive Member', cohort: 'Year', photo: null },
]
