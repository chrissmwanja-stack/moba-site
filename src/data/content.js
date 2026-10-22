// All site content lives here. Edit this file, not the pages.

export const site = {
  name: 'MOBA',
  fullName: 'Mwiri Old Boys Association',
  school: 'Mwiri',                  // TODO: confirm official school name
  tagline: 'Once a Mwirian, always a Mwirian.', // TODO: confirm motto/tagline
  founded: 1911,
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

// Put images in /public/gallery and set src: '/gallery/photo1.jpg'
export const photos = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  src: null,
  caption: `Photo ${i + 1} caption`,
  year: 2026 - i,
}))

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
// date: YYYY-MM-DD. category: 'Reunion', 'Meeting', 'Cohort', 'Project', 'News'.
// Optional: series ('Throwback', 'Cohort spotlight'), image ('/news/name.webp'), place, body.
// Items dated today or later show as Upcoming. All entries are placeholders.
export const news = [
  { date: '2026-12-05', category: 'Meeting', title: 'Annual General Meeting', place: 'Venue TBC', excerpt: 'Replace with details of the meeting.' },
  { date: '2026-11-14', category: 'Reunion', title: 'Old Boys Reunion', place: 'Venue TBC', excerpt: 'Replace with details of the reunion.' },
  { date: '2026-08-10', category: 'News', title: 'MOBA launches its new website', place: '', excerpt: 'The association now has an online home for news, history and memorabilia.' },
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
