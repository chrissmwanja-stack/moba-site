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
  { label: 'Projects delivered', value: 10 },        // TODO
  { label: 'Members worldwide', value: '1,500+' },   // TODO
]

export const timeline = [
  { year: 1911, title: 'The beginning', text: 'The school was founded in January 1911 by Basoga princes who had studied at Kings College Budo, together with the Church Missionary Society, a group of Anglican missionaries.' },
  { year: 1930, title: 'A milestone', text: 'Charles Girling led 400 men to clear Mwiri Hill. The school operated from King’s College Budo from 1930 to 1933 while the hill buildings went up.' },
  { year: 1939, title: 'A milestone', text: 'Ezekiel Tenywa Wako, the first Kyabazinga of a united Busoga, enthroned in 1939, helped the school get its current location.' },
  { year: 1962, title: 'A milestone', text: 'Mwiri’s motto was adopted as Uganda’s national motto in 1962, when the country became independent.' },
  { year: 2011, title: 'A milestone', text: 'Centennial celebrations were held at the school in September.' },
  { year: 2018, title: 'A milestone', text: 'Mwiri won the Boys’ Schools’ Cricket week title for a record 17th time. This was also the 107th anniversary.' },
  { year: 2026, title: 'Going digital', text: 'The association launches its online home.' },
]

// ---------- ABOUT MOBA ----------
// DRAFT: everything marked TODO is placeholder wording to be confirmed by the executive.
// Used by the About page (/about) and, for `summary`, the About section on the Home page.
export const about = {
  // Short version, shown on the Home page.
  summary: 'The Mwiri Old Boys Association (MOBA) brings together everyone who has passed through Busoga College Mwiri. We keep the brotherhood alive, support the school that shaped us, and look after one another across cohorts, branches and borders.', // TODO: confirm wording
  // Longer version, shown on the About page. One string per paragraph.
  story: [
    'Busoga College Mwiri has been educating boys on its hill above Jinja since 1911. The Mwiri Old Boys Association is the home of everyone who has walked through its gates, from the earliest classes to the newest leavers.', // TODO: confirm wording
    'We exist to keep that bond strong: to give Old Boys a place to reconnect, to give back to the school in practical ways, and to make sure the next generation of Mwirians inherits a school they can be proud of.', // TODO: confirm wording
  ],
  mission: 'To unite Old Boys of Busoga College Mwiri and mobilise their time, skills and resources in service of the school and one another.', // TODO: confirm
  vision: 'A strong, connected Mwiri family that keeps its school among the best in Uganda.', // TODO: confirm
  // Priorities: keep to 3 or 4. `link` is optional and points to a page on this site.
  priorities: [
    { title: 'Support the school', text: 'Fund and deliver practical improvements on the hill, from the new gate to the chapel, the mess and teacher housing.', link: '/projects', linkLabel: 'See our projects' },
    { title: 'Connect Old Boys', text: 'Reunions, branches and year-group cohorts that keep every generation in touch, at home and abroad.', link: '/cohorts', linkLabel: 'Find your branch or cohort' },
    { title: 'Serve current students', text: 'Mentorship, equipment and opportunities for the boys now on the hill.' }, // TODO: confirm programmes
    { title: 'Preserve our heritage', text: 'Record and share the history, traditions and stories that make Mwiri what it is.', link: '/history', linkLabel: 'Read our history' },
  ],
  // The school motto, which became Uganda's national motto in 1962.
  motto: {
    lusoga: 'Kulwa Katonda n’Eggwanga Lyaffe',
    english: 'For God and Our Country',
    note: 'Chosen for the school by the Chiefs of Busoga, and adopted in 1962 as Uganda’s national motto, “For God and My Country”.',
  },
  // Values: short words with one line each. TODO: confirm with the executive.
  values: [
    { title: 'Faith', text: 'God first, as our motto says.' },
    { title: 'Service', text: 'Giving back to the school and the nation.' },
    { title: 'Brotherhood', text: 'Once a Mwirian, always a Mwirian.' },
    { title: 'Excellence', text: 'Holding Mwiri to its highest standard.' },
  ],
  // Committees. All entries are placeholders until the executive confirms names and mandates.
  committees: [
    { name: 'Projects & Fundraising', text: 'Plans and funds projects at the school.', chair: null }, // TODO
    { name: 'Membership & Welfare', text: 'Keeps the register and looks after members.', chair: null }, // TODO
    { name: 'Publicity & Communications', text: 'News, social media and this website.', chair: null }, // TODO
    { name: 'Events & Reunions', text: 'Reunions, the AGM and cohort gatherings.', chair: null }, // TODO
  ],
  // Governance. Put the constitution PDF in /public (for example /moba-constitution.pdf) and set constitutionUrl.
  governance: {
    text: 'MOBA is run by an elected executive committee and answers to its members at the Annual General Meeting.', // TODO: confirm election cycle and term
    constitutionUrl: null,
    constitutionLabel: 'Read the MOBA constitution',
  },
}

// Optional: image: '/projects/name.webp' (put files in /public/projects). Without one the card shows the shield.
export const projects = [
  { year: 2025, title: 'Gate Project', summary: 'The Iconic Gate', status: 'Completed' },
  { year: 2022, title: 'Mess Reroofing', summary: 'Reroofing of the main mess building', status: 'Completed' },
  { year: 2024, title: 'Chapel Renovation', summary: 'Renovation of the chapel', status: 'Completed' },
  { year: 2025, title: 'Dispensary Renovation', summary: 'Renovation of the dispensary by Solida Cohort', status: 'Completed' },
  { year: 2025, title: 'Teacher Houses', summary: 'Renovation of the teacher houses', status: 'Completed' },
  { year: 2026, title: 'Basketball Reconstruction', summary: 'Basketball court reconstruction', status: 'Ongoing' },
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
  { id: 'polo',   name: 'MOBA Polo Shirt',       price: 50000,  delivery: 'physical', image: null, blurb: 'Navy polo with embroidered shield.' },
  { id: 'cap',    name: 'MOBA Cap',              price: 25000,  delivery: 'physical', image: null, blurb: 'Navy cap, gold crest.' },
  { id: 'pin',    name: 'Lapel Pin',             price: 10000,  delivery: 'physical', image: null, blurb: 'Enamel shield pin.' },
  { id: 'mug',    name: 'Commemorative Mug',     price: 15000,  delivery: 'physical', image: null, blurb: 'Est. 1911 commemorative mug.' },
]

// ---------- MEMBERSHIP ----------
// PRICES ARE PLACEHOLDERS (UGX) until costs are confirmed.
export const tiers = [
  { id: 'annual', name: 'Annual Member', price: 50000,  period: 'year',     perks: ['Membership register listing', 'Event invitations', 'Digital membership card'] },
  
  { id: 'life',   name: 'Life Member',   price: 1010000, period: 'one-off',  perks: ['Lifetime membership', 'Name on the Life Members roll', 'MOBA tie and pin'] },
]

// ---------- MEMBER BENEFITS ----------
// Shown on the Membership page. Add more entries here as new benefits launch.
// to: the page that handles sign-up for the benefit.
export const benefits = [
  {
    id: 'funeral',
    title: 'MOBA Funeral Insurance',
    text: 'Support for the family when a member or a covered dependant passes away. Enrol online and we will send you payment instructions.',
    to: '/funeral-cover',
    cta: 'Enrol for funeral cover',
  },
]

// Funeral Insurance scheme settings. TODO: confirm every value with the scheme committee.
// premium / period: leave premium as null until it is confirmed; the page then says the
// amount will be given on enrolment instead of showing a made-up figure.
export const funeralCover = {
  name: 'MOBA Funeral Insurance',
  premium: null,          // TODO: contribution in UGX, e.g. 60000
  period: 'year',         // TODO: 'year' or 'month'
  maxDependants: 6,       // TODO: how many dependants one member may cover
  waitingPeriod: null,    // TODO: e.g. '3 months', or leave null to hide it
  payout: null,           // TODO: e.g. 'UGX 5,000,000', or leave null to hide it
  paymentNote: 'MTN MoMo or Airtel Money. Details are sent to you after you enrol.', // TODO: confirm
  contactEmail: null,     // TODO: scheme secretary email; falls back to the association email
}

// ---------- NEWS & EVENTS ----------
// date: YYYY-MM-DD. category must be one of newsCategories below (the News page filter uses them).
// Optional: series ('Throwback', 'Cohort spotlight'), image ('/news/name.webp'), place,
// body (an array of paragraphs for the full article), link ({ label, to } button under the article).
// Every item opens at /news/<date>-<title>; set slug: 'my-link' to choose the address yourself.
// Items dated today or later show as Upcoming. All entries are placeholders.
export const newsCategories = ['Reunion', 'Meeting', 'Cohort', 'Project', 'News']
export const news = [
  { date: '2026-12-05', category: 'Meeting', title: 'Annual General Meeting', place: 'Venue TBC', excerpt: 'Replace with details of the meeting.' },
  { date: '2026-11-14', category: 'Reunion', title: 'Old Boys Reunion', place: 'Venue TBC', excerpt: 'Replace with details of the reunion.' },
  { date: '2026-09-19', category: 'Reunion', title: 'Reunion and book launch at Mwiri', place: 'Busoga College Mwiri',
    excerpt: "Old Boys returned to the hill for a day of speeches, the launch of “A Lamp on a Hill”, choir performances and a shared meal. Browse the photos in the gallery.",
    image: '/gallery/2026-reunion/34.webp',
    link: { label: 'Browse the reunion photos', to: '/gallery' } },
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
  { name: 'United States', region: 'Diaspora', meets: 'Meeting schedule TBC', contact: 'Branch chairperson', email: null, whatsapp: null },
]

// A cohort is named by the year its class started S1 (2001 cohort = S1 in 2001, S6 in 2006).
// The page lists every year from `founded` up to the newest cohort that has left school
// (this year minus schoolYears plus 1); later classes are still students. List a year here only
// when it has a known group; other years show "We do not have a group for this class yet".
// { year, contact: 'Role or name', email: null, whatsapp: 'https://chat.whatsapp.com/...' | null }
export const cohorts = [
  { year: 1988, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1989, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1990, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1991, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1992, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1993, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1994, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1995, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1996, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1997, contact: 'Cohort coordinator', email: null, whatsapp: null }, 
  { year: 1998, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 1999, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2000, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2001, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2002, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2003, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2004, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2005, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2006, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2007, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2008, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2009, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2010, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2011, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2012, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2013, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2014, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2015, contact: 'Cohort coordinator', email: null, whatsapp: null },
  { year: 2016, contact: 'Cohort coordinator', email: null, whatsapp: null },

]




// ---------- LEADERSHIP ----------
// Current executive term, shown on the Leadership page.
export const leadersTerm = '2026–2028'

// cohort: the year the class started S1 (the site works out the S6 year). cohortName: the class nickname.
// houses: school house(s). bio: an array of paragraphs; the first is the short teaser on the card.
// Put photos in /public/leaders and set photo: '/leaders/name.jpg'.
// Entries without a bio are still placeholders until the details are confirmed.
export const leaders = [
  {
    name: 'Sam Hooper', role: 'President', cohort: '1995', cohortName: 'Solida', houses: ['Hannington', 'Wilson'], photo: '/leaders/sam-hooper.webp',
    bio: [
      'Sam is a seasoned marketer with extensive experience leading marketing teams in the fast-moving consumer goods (FMCG) sector. He brings expertise in strategy, brand building and team leadership to his role as MOBA President.',
      'For over a decade, Sam has supported Mwiri through donations, community initiatives and school development projects. His contributions include chairing the Homecoming organising committee, spearheading the school dispensary refurbishment and, most recently, chairing the basketball court reconstruction initiative. As President, he is focused on strengthening the brotherhood and mobilising collective support to reclaim Mwiri’s greatness.',
    ],
  },
  {
    name: 'Collins Hinamundi', role: 'Vice President', cohort: '2004', cohortName: 'Blue Dollar', houses: ['Hannington'], photo: null,
    bio: [
      'Collins Hinamundi is a seasoned Product Marketing professional with over 14 years of experience across telecommunications and media. He specialises in product strategy, market development and brand growth. He is passionate about sustainability, long-term value creation and building systems that deliver lasting impact beyond immediate gains.',
      'As Vice President of MOBA, Collins brings a strategic, forward-looking perspective focused on strengthening alumni engagement, mobilising collective resources and championing sustainable solutions that secure Mwiri’s future. He believes in building institutions that can thrive for generations through shared ownership, strategic investment and a strong sense of brotherhood.',
    ],
  },
  {
    name: 'Arthur Abaliwano', role: 'Secretary General', cohort: '2003', cohortName: 'Kombora', houses: ['Wako'], photo: '/leaders/arthur-abaliwano.webp',
    bio: [
      'Arthur Abaliwano is a lawyer with over 10 years of professional experience and a proud son of Mwiri. His contribution to the Mwiri community reflects a passion for bringing people together, strengthening connections and turning shared aspirations into meaningful action.',
      'As the founding Chairman of the Mwiri League, Arthur has championed a platform that brings Mwirians together through sport, fellowship and a shared commitment to their alma mater. He has also spearheaded initiatives in support of Mwiri, including the Mwiri Insurance Scheme and the Mwiri Oval Construction Project, demonstrating his commitment to both the welfare of the brotherhood and the development of the school.',
      'As Secretary General, Arthur’s focus is on harnessing the full potential of the brotherhood: growing MOBA’s membership, encouraging active participation and strengthening the connections that unite Mwirians across generations.',
    ],
  },
  { name: 'Francis Obbo', role: 'Assistant Secretary General', cohort: '2004',cohortName: 'Blue Dollar', houses: ['Nadiope'], photo:'/leaders/francis-obbo.webp',
    bio: [
      'Francis Obbo is an accomplished legal professional and a dedicated alumnus who currently serves as the Assistant Secretary of the Old Boys Association. With over 10 years of experience as a practicing lawyer, he brings a wealth of legal expertise, organizational governance, and strategic leadership to the association.',
      'He leverages his exceptional mobilization skills to actively engage, inspire, and rally members across all graduating cohorts, bridging the gap between older and younger generations.',
      'Together with his boss the Hon, Secretary they are driving the modernization of the association by spearheading the creation and maintenance of a fully digitized members register, ensuring seamless communication and networking.',
    ],
  },
  {
    name: 'Samson Kakoma', role: 'Treasurer', cohort: '2002', cohortName: 'Atletico Muniga', houses: ['Presidents'], photo: '/leaders/samson-kakoma.webp',
    bio: [
      'Kakoma Kakos Samson is a businessman with a strong commitment to alumni leadership, sports development and community building. He has actively contributed to Mwiri through alumni mobilisation, the Mwiri League, the basketball court reconstruction initiative, the Mwiri Gate Project and the Mwiri Funeral Insurance Plan.',
      'Having served as Assistant Treasurer during the 2024–2026 term, Kakos brings experience in financial management and resource mobilisation to his current role. As Treasurer, he is committed to transparency, accountability and building a financially sustainable MOBA that unites Old Boys and advances Mwiri’s development.',
    ],
  },
  { name: 'Davis Lado', role: 'Assistant Treasurer', cohort: '2005',cohortName: 'Lukambwe', houses: ['Wako'], photo: '/leaders/davis-lado.webp',
    bio: [
      'Davis Lado is a Professional Accountant with over 10 years of professional experience and a proud son of Mwiri.',
      'His contribution to the Mwiri community reflects a passion for bringing people together, strengthening connections, and turning shared aspirations into meaningful action.',
      'As Assistant Hon. Treasurer of MOBA, Davis brings valuable accounting expertise and financial management experience to support sound financial decision-making and the successful implementation of the Association’s strategic initiatives. He is committed to promoting financial transparency, accountability, prudent resource management, and timely financial reporting to ensure members remain informed and confident in how the Association’s resources are managed.',
      'In addition to his treasury responsibilities, Davis serves on the MOBA Academic Committee, contributing to initiatives that promote academic excellence and support the continued growth and development of the Mwiri community.',
      'Through these roles, Davis is committed to strengthening MOBA’s financial stewardship, advancing its strategic objectives, and preserving the values and legacy of Mwiri for current and future generations.'
    ],
   },
  { name: 'Rodney Mugisha', role: 'Publicity Secretary', cohort: '1988', cohortName: 'Ruga Ruga', houses: ['Wako'], photo: null },
  {
    name: 'Chris Mwanja', role: 'Executive Member', cohort: '2001', cohortName: 'Buliti', houses: ['Hannington'], photo: '/leaders/chris-mwanja.webp',
    bio: [
      'Chris Mwanja is an Electronics and Communication Engineer and web developer, and a proud Mwirian from Hannington House. He brings the discipline and attention to detail of his engineering profession to his service within MOBA.',
      'Chris served as Chairman of the Mwiri League for the 2024–2025 term, where he helped coordinate alumni sporting activities and strengthen engagement across cohorts. He also sits on the Mwiri Basketball Reconstruction Committee, where he has been directly involved in driving the revival of competitive basketball at the school.',
      'As an Executive Committee member, Chris is committed to serving Mwiri with the same dedication he has shown to date.',
    ],
  },
  { name: 'Arthur Kyagaba', role: 'Executive Member', cohort: '2003',cohortName: 'Kombora', houses: ['Hannington'], photo: null },
  {
    name: 'Joshua Bizimungu', role: 'Executive Member', cohort: '2011', cohortName: 'Shadow', houses: ['Willis'], photo: '/leaders/joshua-bizimungu.webp',
    bio: [
      'Joshua Bizimungu is a Management Analyst in Uganda’s Ministry of Public Service. He brings experience in leadership, public administration, organisational management and alumni mobilisation.',
      'Joshua served as President of the MOBA Makerere Chapter and chaired the 2024 MOBA Homecoming Organising Committee, which attracted thousands of attendees. A former School Volleyball Captain and Entertainment Prefect, he has also coached Mwiri’s volleyball team and continues to champion alumni engagement, sports development and the Mwiri spirit. As Chief Whip, he is committed to strengthening campus mobilisation and active participation in MOBA.',
    ],
  },
  { name: 'Allan Senyonga', role: 'Executive Member', cohort: '1995', cohortName: 'Solida', houses: ['Wilson'], photo: '/leaders/allan-senyonga.webp',
    bio: [
      'Allan is seasoned media and communications practitioner with a wealth of experience from around the East African region. He has been an active member on various MOBA platforms as a mobilizer and advisor on various aspects aimed at bringing old boys together and improving on their welfare and networking capacities.',
      'Through his passion for MOBA and Mwiri, Allan was one of the founder members of the Solida Investment Club and has remained a key mobiliser, administrator and treasurer at the cohort level for various projects and initiatives undertaken by his classmates. ',
      'As a Committee member he is determined to support the current MOBA leadership to achieve its goals while enhancing the spirit of brotherhood nurtured at the great school, Mwiri.'
    ],
   }, 
  {
    name: 'Godfrey Mazige', role: 'Executive Member', cohort: '2017', cohortName: 'Wampa', houses: ['Wilson'], photo: '/leaders/godfrey-mazige.webp',
    bio: [
      'Mazige Godfrey is a finalist at Makerere University Business School pursuing a Bachelor’s degree in Marketing. He serves on the Executive Committee of the Mwiri Old Boys Association (MOBA) and has interests in leadership, marketing, networking and community development. He is passionate about strengthening alumni relationships and encouraging youth participation.',
      'He advocates for unity, inclusivity, mentorship and active participation within MOBA. He is committed to connecting recent and older alumni and supporting initiatives that contribute to Mwiri’s continued development.',
    ],
  },
]