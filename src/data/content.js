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

// Optional: image: '/projects/name.webp' (put files in /public/projects). Without one the card shows the shield.
export const projects = [
  { year: 2025, title: 'Gate Project', summary: 'The Iconic Gate', status: 'Completed' },
  { year: 2019, title: 'Project title', summary: 'Replace with project summary.', status: 'Ongoing' },
  { year: 2015, title: 'Project title', summary: 'Replace with project summary.', status: 'Completed' },
]

// Publicly sourced photos. Please confirm reuse permission before launch.
// Image credits and original articles are recorded with each entry.
// Photos with a `thumb` load the small version in the grid and the full one in the lightbox.
// Optional per photo: alt (screen-reader text), focus (e.g. '50% 25%' = which part stays visible when cropped),
// featured (true = also shown in the home page strip).
// Reunion album files live in /gallery/2026-reunion (full) and /gallery/2026-reunion/thumbs (grid).
export const photos = [
  // AGM 2026 — photos supplied by the association (watermarked 'Mpala Clicks' where shown).
  { id: 206, src: '/gallery/agm-2026-6.webp', thumb: '/gallery/agm-2026-6-640.webp', caption: 'AGM 2026 — smiles from the audience', alt: 'A smiling member with arms crossed enjoying the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 25%', featured: true },
  { id: 201, src: '/gallery/agm-2026-1.webp', thumb: '/gallery/agm-2026-1-640.webp', caption: 'AGM 2026 — members gathered in the hall', alt: 'Old Boys in MOBA polo shirts seated in a hall during the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 40%', featured: true },
  { id: 203, src: '/gallery/agm-2026-3.webp', thumb: '/gallery/agm-2026-3-640.webp', caption: 'AGM 2026 — following the proceedings', alt: 'A senior member in a blue Mwirian polo listening during the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 25%' },
  { id: 204, src: '/gallery/agm-2026-4.webp', thumb: '/gallery/agm-2026-4-640.webp', caption: 'AGM 2026 — Old Boys and students together', alt: 'Old Boys sitting among students in the audience at the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 35%', featured: true },
  { id: 205, src: '/gallery/agm-2026-5.webp', thumb: '/gallery/agm-2026-5-640.webp', caption: 'AGM 2026 — members in attendance', alt: 'A member in a Mwirian polo seated at a yellow table in the school hall', year: 2026, source: 'Mpala Clicks', focus: '50% 25%' },
  { id: 202, src: '/gallery/agm-2026-2.webp', thumb: '/gallery/agm-2026-2-640.webp', caption: 'AGM 2026 — at the high table', alt: 'A member in a navy Mwirian polo seated at the high table with a microphone', year: 2026, source: 'MOBA', focus: '50% 30%' },
  {
    id: 1,
    src: '/gallery/gate-2025.webp',
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
    src: '/gallery/dedication-2025.webp',
    caption: 'Old Boys and clergy at the dedication of the new gate — Photo: New Vision',
    year: 2025,
    source: 'New Vision',
    sourceUrl: 'https://www.newvision.co.ug/category/education/busoga-college-mwiri-celebrates-114-years-com-NV_221954_082026',
  },
  {
    id: 4,
    src: '/gallery/refurb-2024.webp',
    caption: 'Staff and students during the refurbishment handover — Photo: Uganda Baati',
    year: 2024,
    source: 'Uganda Baati',
    sourceUrl: 'https://ugandabaati.com/uganda-baati-supports-busoga-college-mwiri-in-sight-to-refurbish-the-school/',
  },
  {
    id: 5,
    src: '/images/gallery/mwiri-library.jpg',
    caption: 'Muljibhai Madhvani Library, Busoga College Mwiri',
    year: 2026,
    source: 'MOBA',
  },
  {
    id: 6,
    src: '/images/gallery/moba-alumni-gathering.jpg',
    caption: 'MOBA members gathered at Busoga College Mwiri',
    year: 2026,
    source: 'MOBA',
  },
  { id: 7, src: '/gallery/campus-artwork.webp', caption: 'Mwiri at golden hour — illustration', year: 2026, source: 'MOBA' },
  { id: 8, src: '/gallery/crest-artwork.webp', caption: 'The leopard crest — association artwork', year: 2026, source: 'MOBA' },
  { id: 9, src: '/gallery/memorabilia-artwork.webp', caption: 'Tie, cap and pin — from the MOBA store', year: 2026, source: 'MOBA' },
  // Reunion at Mwiri, 19 Sept 2026 — 60 curated photos from the association album.
  ...Array.from({ length: 60 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      id: 100 + i,
      src: `/gallery/2026-reunion/${n}.webp`,
      thumb: `/gallery/2026-reunion/thumbs/${n}.webp`,
      caption: 'Reunion at Mwiri — 19 Sept 2026',
      year: 2026,
      source: 'MOBA',
    }
  }),
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
  { date: '2026-09-19', category: 'Reunion', title: 'Reunion and book launch at Mwiri', place: 'Busoga College Mwiri',
    excerpt: "Old Boys returned to the hill for a day of speeches, the launch of “A Lamp on a Hill”, choir performances and a shared meal. Browse the photos in the gallery.",
    image: '/gallery/2026-reunion/34.webp' },
  { date: '2026-08-10', category: 'News', title: 'MOBA launches its new website', place: '', excerpt: 'The association now has an online home for news, history and memorabilia.' },
]

// ---------- BRANCHES & COHORTS ----------
// Branches: local chapters. Cohorts: a cohort is a class (everyone who finished S6 together,
// including those who joined later, e.g. in S5), named by the year the class started S1.
// Keep contact details to role names or association addresses while the repo is public.
// whatsapp: a full invite link ('https://chat.whatsapp.com/...') or null.
export const branches = [
  { name: 'Kampala', region: 'Uganda', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
  { name: 'Jinja', region: 'Uganda', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
  { name: 'United Kingdom', region: 'Diaspora', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
]

// A cohort is named by the year its class started S1 (2001 cohort = S1 in 2001, S6 in 2006).
// The page lists every year from `founded` up to the newest cohort that has left school
// (this year minus schoolYears plus 1); later classes are still students. List a year here only
// when it has a known group; other years show "We do not have a group for this class yet".
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
