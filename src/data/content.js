// All site content lives here. Edit this file, not the pages.

export const site = {
  name: 'MOBA',
  fullName: 'Mwiri Old Boys Association',
  school: 'Mwiri',                  
  motto: 'Kulwa Katonda N’Eggwanga Lyaffe.', 
  tagline: 'Once a Mwirian, always a Mwirian.',
  founded: 1911,
  schoolYears: 6,                  // classes from S1 to S6; join in S1 in 2001, finish S6 in 2006
  website: 'www.mwirian.org',
  // Social media pages shown in the footer. Fill in the links you have; icons with no link are hidden.
  social: { linkedin: null, facebook: null, instagram: null, x: null }, // TODO
  email: 'info@mwirian.org',       // TODO
  address: 'P.O. Box 319, Jinja, Uganda',
  phone: null,                      // TODO: add the association phone number (hidden on the site while null)
  // Ways to give, shown on the Donate page. Each: { label: 'Bank transfer', lines: ['Account name: ...', 'Account no: ...'] }.
  // Leave empty until the executive confirms the official accounts; the page then explains that we will send details after a pledge.
  donate: [], // TODO: add the association's bank and mobile money details
  orderEmail: 'info@mwirian.org', // where store orders are emailed (same inbox as general enquiries)
}

// The nine school houses offered on member sign-up and admin forms. Keep in step with public.moba_houses in Supabase.
export const houses = ['Hannington', 'Nabikamba', 'Nadiope', 'Willis', 'Wilson', 'Wako', 'Presidents', 'Coates', 'Brewer']

export const stats = [
  { label: 'Years of brotherhood', value: new Date().getFullYear() - site.founded },
  { label: 'Projects delivered', value: '10+' },        // TODO
  { label: 'Members worldwide', value: '1,500+' },   // TODO
]

export const timeline = [
  { year: 1911, title: 'The beginning', text: 'The school was founded in January 1911 by Basoga princes who had studied at Kings College Budo, together with the Church Missionary Society, a group of Anglican missionaries. It first opened in Kamuli as Balangira High School, on land given by Prince Yosiya Nadiope.' },
  { year: 1920, title: 'A permanent site', text: 'Rev. A. Harry Brewer becomes headmaster and campaigns for a permanent home away from the original, unsuitable site.' },
  { year: 1930, title: 'Clearing the Hill', text: 'Charles Girling led 400 men to clear Mwiri Hill. The school operated from King’s College Budo from 1930 to 1933 while the hill buildings went up.' },
  { year: 1933, title: 'Home on the Hill', text: 'The school moves permanently to Mwiri Hill.' },
  { year: 1939, title: 'A milestone', text: 'Ezekiel Tenywa Wako, the first Kyabazinga of a united Busoga, enthroned in 1939, helped the school get its current location.' },
  { year: 1940, title: 'The Main Hall', text: 'The Main Hall opens.' },
  { year: 1943, title: 'The Golden Age begins', text: 'Rev. H. G. “Jack” Coates begins 22 years as headmaster, remembered as Mwiri’s Golden Age.' },
  { year: 1959, title: 'Hannington House', text: 'Hannington House is opened by Bishop Hannington’s daughter.' },
  { year: 1962, title: 'A national motto', text: 'Mwiri’s motto was adopted as Uganda’s national motto in 1962, when the country became independent.' },
  { year: 1964, title: 'A Level arrives', text: 'A Level education is introduced.' },
  { year: 1965, title: 'First African headmaster', text: 'Dan N. Okungu becomes the first African headmaster.' },
  { year: 1980, title: 'Coates House', text: 'Coates House is built.' },
  { year: 2011, title: 'A milestone', text: 'Centennial celebrations were held at the school in September.' },
  { year: 2018, title: 'A milestone', text: 'Mwiri won the Boys’ Schools’ Cricket week title for a record 17th time. This was also the 107th anniversary.' },
  { year: 2025, title: 'A record 20th title', text: 'Mwiri win a record 20th Schools Cricket Week title, unbeaten.' },
  { year: 2026, title: 'Representing Uganda', text: 'Mwiri represent Uganda at the FEASSA Games in Morogoro, Tanzania. The new MOBA Executive adopts “Reclaiming Our Greatness”.' },
  { year: 2026, title: 'Going digital', text: 'The association launches its online home.' },
]

// ---------- HISTORY PAGE (/history) ----------
// Narrative sections shown above the timeline. Photos reuse the "From the archive" gallery files.
// Anything not yet confirmed (headmaster dates, the 1970s, enrolment figures) is deliberately left out.
export const history = {
  intro: 'From its beginnings as a school for the sons of Busoga chiefs to its place among Uganda’s distinguished institutions, Busoga College Mwiri has shaped generations of leaders, professionals and citizens.',
  chapters: [
    {
      label: 'Chapter one · 1911 to 1930', title: 'The birth of a great institution',
      paragraphs: [
        'The story of Busoga College Mwiri begins in 1911. Founded through the efforts of Basoga princes and chiefs working with the Church Missionary Society, the school first opened in Kamuli as Balangira High School, primarily for the sons of Busoga chiefs. Prince Yosiya Nadiope provided the land.',
        'The early school emphasised discipline and self-reliance, and pupils grew cotton, coffee and rubber to help support the school. In time, admission broadened beyond the families of chiefs.',
        'Under the second headmaster, Reverend A. Harry Brewer (1920 to 1930), plans grew to leave the original, unsuitable site for a permanent home. His advocacy prepared the way for Mwiri Hill.',
      ],
      images: [
        { src: '/gallery/archive-thatched-buildings-640.webp', alt: 'Pupils outside the early thatched school buildings', caption: 'Pupils outside the early thatched school buildings.' },
        { src: '/gallery/archive-football-team-restored-640.webp', alt: 'The Busoga High School football team', caption: 'The Busoga High School football team, from the era when the school carried that name.' },
      ],
    },
    {
      label: 'Chapter two · 1930 to 1933', title: 'The move to Mwiri Hill',
      paragraphs: [
        'In 1930, Charles Girling supervised a workforce of some 400 men clearing the forested hill for the new campus. While the buildings went up, the school was housed at King’s College Budo.',
        'In 1933 the school moved permanently to the Hill. The name comes from Muyili, or Muyiri, the local name for the hill. Today the site, in Jinja District near Kakira, covers around 300 acres overlooking the Busoga countryside. Balangira High School became Busoga High School, and then Busoga College Mwiri.',
      ],
    },
    {
      label: 'Chapter three · 1943 to 1965', title: 'The Golden Age',
      paragraphs: [
        'The years under Reverend H. G. “Jack” Coates, headmaster from 1943 to 1965, are remembered as Mwiri’s Golden Age. The school earned a reputation for academic excellence, discipline, sport and character, and Coates’s 22 years left an enduring legacy.',
        'The Main Hall had opened in 1940, Hannington House opened in 1959 and A Level arrived in 1964. Apollo Milton Obote, a pupil from 1942 to 1948, went on to become Uganda’s first Prime Minister and President. In 1965 Dan N. Okungu became the first African headmaster, and Old Boys came to call Mwiri simply “The School”.',
      ],
      images: [
        { src: '/gallery/archive-wako-1965-640.webp', alt: 'Wako House in 1965 with its trophies beneath the school motto', caption: 'Wako House, 1965, at the end of the Golden Age, with its haul of trophies beneath the school motto.' },
        { src: '/gallery/archive-hannington-1981-640.webp', alt: 'Hannington House at the Main Hall in 1981', caption: 'Hannington House at the Main Hall, 1981.' },
      ],
    },
  ],
  // Only headmasters whose dates are confirmed. TODO: complete the list with the school archive.
  headmastersTitle: 'Headmasters through the years',
  headmasters: [
    { name: 'Rev. W. B. Gill', note: 'First headmaster, 1911 to 1912' },
    { name: 'Rev. W. S. R. Russell', note: 'Jan 1913 to July 1913' },
    { name: 'Rev. C. J. Burden', note: 'Jul 1913 to June 1914' },
    { name: 'Rev. F. S. Rogers', note: 'June 1914 to Oct 1918' },
    { name: 'Rev. Allen Wilson', note: 'Nov 1918 to Dec 1919' },
    { name: 'Rev. A. Harry Brewer', note: 'Jan 1920 to Dec 1930' },
    { name: 'Rev. K. V. Ball', note: 'Jan 1931 to Dec 1931' },
    { name: 'Rev. J. S. Butlin,Acting', note: 'Jan 1932 to Apr 1933' },
    { name: 'Mr. W. W. E. Giles', note: 'Jan 1933 to Aug 1935' },
    { name: 'Mr. T. W. Harrison', note: 'Aug 1935 to Apr 1938' },
    { name: 'C. H. Ronald Walker,Acting', note: 'Apr 1938 to Dec 1938' },
    { name: 'C. H. Ronald Walker', note: 'Jan 1939 to Dec 1942' },
   
    { name: 'Rev. F. G. “Jack” Coates', note: 'Jan 1943 to June 1965' },
    { name: 'Dan N. Okungu', note: 'From June 1965 to Dec 1967, first African headmaster' },
    { name: 'Mr.Y. Y. Okot', note: 'Jan 1968 to Feb 1971' },
    { name: 'Mr. J. B. Taylor,Acting', note: 'Feb 1971 to Dec 1971' },
    { name: 'Mr. P. O. Eraku', note: '1972 to 1974' },
    { name: 'Mr. E. Y. Fegayo', note: '1974 to 1975' },
    { name: 'Keith Mutengu', note: 'From 1976 to 1979' },
    { name: 'Mr. Waibi, Acting', note: '1979 to 1980' },
    { name: 'D. P.Kintu', note: 'From 1980 to 1981' },
    { name: 'Pithy Ndiko', note: '1981 to 1985' },
    { name: 'Mr. G. W. Kayondo', note: '1986 to 1994' },
    { name: 'Mr. B. F. Kagawa', note: '1994 to 1995' },
    { name: 'Mr. C. W. Kaziba, Acting', note: '1997 to 1998' },
    { name: 'G. W. Semivule', note: 'From 1998 to 2000' },
    { name: 'Mr. D. H. Mulongo, Acting', note: 'Jan 2000 to Dec 2000' },
    { name: 'Mr. D. P. Kintu ', note: 'From 2001 to 2004' },
    { name: 'Mr. John Mukubira', note: 'From 2005 to 2010' },
    { name: 'Mr. George Lule Wamala', note: '2011 to 2014' },
    { name: 'Mr. Wilson Charles kaziba', note: '2014 to 2016' },
    { name: 'Mr. Micheal Kisaame', note: 'From 2017 to 2019' },
    { name: 'Mr. Arthur Mbalule', note: 'From 2019 to 2024' },
    { name: 'Mr. Peter Sibukule', note: 'From 2024 to Current' },
  ],
  //headmastersNote: 'The full list of headmasters is being compiled with the school archive.',
  housesIntro: 'Named for founders, traditional leaders, missionaries and educators, the houses keep alive the memory of the people who shaped the school. House life has built belonging, discipline, leadership and friendships that last a lifetime.',
  // TODO: confirm each description with the school archive.
  houses: [
    { name: 'Brewer', text: 'For Rev. A. Harry Brewer, second headmaster (1920 to 1930), who championed the move from Kamuli to Mwiri Hill but died before it was completed.' },
    { name: 'Coates', text: 'For Rev. H. G. “Jack” Coates, headmaster from 1943 to 1965, whose tenure is remembered as the Golden Age. Built in 1980.' },
    { name: 'Hannington', text: 'For Bishop James Hannington, an early Anglican bishop killed in Busoga in 1885. Opened by his daughter in 1959.' },
    { name: 'Nabikamba', text: 'For Nabikamba, one of the founding Busoga chiefs.' },
    { name: 'Nadiope', text: 'For Prince Yosiya Nadiope, who gave the original land in Kamuli for Balangira High School in 1911.' },
    { name: 'Presidents', text: 'In honour of the presidents of the Busoga Lukiiko, the council of chiefs, recognising traditional leadership’s part in building the school.' },
    { name: 'Wako', text: 'For Ezekiel Tenywa Wako, the first Kyabazinga of a united Busoga, who helped the school secure its present site.' },
    { name: 'Willis', text: 'For the Rt Rev. John Jamieson Willis, Bishop of Uganda from 1912 to 1934, who helped raise funds for the school.' },
    { name: 'Wilson', text: 'For Rev. C. T. Wilson, one of the first Anglican missionaries to Uganda, who arrived in 1877.' },
  ],
  traditions: {
    title: 'The spirit of Mwiri',
    paragraphs: [
      'Mwiri’s traditions include the distinctive all-white O Level uniform, the long-running Mpala Magazine, the school songs, prefectural leadership and the roll call known as “Wampa”. New Senior One boys were also paired with Senior Three boys for guidance and protection.',
      'These shared experiences create an identity that lasts long after the final term. To be a Mwirian is to belong to a community shaped by service, loyalty and a common history.',
    ],
  },
  sport: {
    title: 'Sporting excellence',
    stat: '20', statLabel: 'Schools Cricket Week titles, a record',
    paragraphs: [
      'Sport has long sat alongside learning at Mwiri, from cricket, football and rugby to basketball, athletics and volleyball. In 2025 Mwiri won a record twentieth Schools Cricket Week title without losing a match, with captain Gerald Olipa named leading batsman on 298 runs.',
      'In 2026 the school represented Uganda at the FEASSA Games in Morogoro, Tanzania.',
    ],
    image: { src: '/gallery/archive-cricket-team-640.webp', alt: 'Mwiri cricketers in whites with their master', caption: 'Mwiri cricketers in whites with their master.' },
  },
  renewal: {
    title: 'Old Boys and the work of renewal',
    paragraphs: [
      'Old Boys have helped sustain the school through fundraising, renovation, sport, mentorship and mobilising alumni at home and abroad, with involvement in school affairs recorded as far back as the late 1960s.',
      'They have supported dormitory improvements, asbestos removal, sanitation works, painting, sports facilities and equipment. Friends of Mwiri UK have also given over many years, and the annual Homecoming keeps the generations connected.',
    ],
  },
  sources: 'Busoga College Mwiri: History of the School; Mwiri National Contribution; Friends of Mwiri UK (mwiri.sc.ug). Daily Monitor and NBS Sport coverage of the school and its cricket; Uganda Cricket: FEASSA Games 2026.',
}

// ---------- ABOUT MOBA ----------
// DRAFT: everything marked TODO is placeholder wording to be confirmed by the executive.
// Used by the About page (/about) and, for `summary`, the About section on the Home page.
export const about = {
  // Short version, shown on the Home page.
  summary: 'The Mwiri Old Boys Association (MOBA) brings together everyone who has passed through Busoga College Mwiri. We keep the brotherhood alive, support the school that shaped us, and look after one another across cohorts, branches and borders.', // TODO: confirm wording
  // Longer version, shown on the About page. One string per paragraph.
  story: [
    'The Mwiri Old Boys Association (MOBA) brings together generations of Old Boys of Busoga College Mwiri. Our connection to Mwiri does not end when we leave the Hill. It continues through the relationships we build, the heritage we share and the responsibility we carry for one another and our school.',
    'Across cohorts, professions and geographies, MOBA provides a platform to stay connected, share knowledge and opportunities, support fellow Mwirians and contribute to the continued development of Busoga College Mwiri.',
  ],
  purpose: 'To connect generations of Mwirian brothers and harness the strength of our collective community to advance Mwiri and one another.',
  vision: 'A strong and connected Mwirian community, united across generations and committed to the enduring success of Mwiri and each other.',
  mission: 'To build an engaged and valuable alumni network that connects Mwirian brothers, creates opportunities to support one another, preserves our shared heritage and mobilises our collective strength in service of Busoga College Mwiri.',
  promise: 'Wherever life takes you, you remain connected to Mwiri and to a brotherhood that can make a difference.',
  // Priorities for the 2026–2028 executive. `link` is optional and points to a page on this site.
  priorities: [
    { title: 'Academic Excellence & Future Readiness', text: 'Support learning, mentorship and opportunities that prepare students for life beyond Mwiri.' },
    { title: 'Build the Mwiri We Want', text: 'Mobilise support for infrastructure, facilities and the long-term development of the school.', link: '/projects', linkLabel: 'See our projects' },
    { title: 'Competing to Win', text: 'Support sports and co-curricular activities that develop talent, teamwork and school pride.' },
    { title: 'Stronger, Self-Sustaining MOBA', text: 'Strengthen membership, participation and the resources needed to serve our community.', link: '/membership', linkLabel: 'Become a member' },
    { title: 'Get Mwiri Seen', text: 'Share our stories, celebrate achievements and raise the visibility of Mwiri and its Old Boys.', link: '/news', linkLabel: 'Read the latest news' },
    { title: 'Strong Institutions & Accountable Leadership', text: 'Strengthen governance, transparency and continuity beyond any one Executive term.' },
  ],
  // The school motto, which became Uganda's national motto in 1962.
  motto: {
    lusoga: 'Kulwa Katonda n’Eggwanga Lyaffe',
    english: 'For God and Our Country',
    note: 'Chosen for the school by the Chiefs of Busoga, and adopted in 1962 as Uganda’s national motto, “For God and My Country”.',
  },
  // Pillars (shown as "What we stand for"): a title, a short tagline and one line each.
  values: [
    { title: 'Brotherhood', tagline: 'Who we are.', text: 'The lifelong bond between Mwirian brothers, transcending cohorts, generations, professions and geography.' },
    { title: 'Heritage', tagline: 'What binds us.', text: 'Our shared history, traditions, experiences and connection to Busoga College Mwiri.' },
    { title: 'Service', tagline: 'How we contribute.', text: 'Giving our time, knowledge, expertise, influence and resources in service of one another and Mwiri.' },
    { title: 'Progress', tagline: 'What we seek to create.', text: 'Using our collective strength to create opportunity, strengthen MOBA and contribute to the continued advancement of Mwiri.' },
  ],
  // Committees and their mandates. Set `chair` to a name once announced; until then no chair line is shown.
  committees: [
    { name: 'Academic Affairs Committee', text: 'Supports academic excellence and future readiness at Busoga College Mwiri. Working with the school, the committee identifies learning needs and mobilises Old Boys’ expertise and resources for mentorship, career guidance, learning support and teacher development.', chair: null },
    { name: 'PR & Communications Committee', text: 'Keeps members informed and strengthens the visibility of MOBA and Mwiri through newsletters, digital platforms, media engagement and storytelling. The committee also safeguards our brand through consistent communication templates and preserves our history through an organised archive.', chair: null },
    { name: 'Legal Affairs Committee', text: 'Provides legal guidance to protect MOBA’s interests and strengthen its governance. Its work includes reviewing the constitution, policies, contracts and agreements, supporting statutory compliance and advising on legal matters affecting the association.', chair: null },
    { name: 'Endowment & Benevolent Fund Committee', text: 'Develops sustainable arrangements for long-term investment and member welfare. The committee reviews the existing Endowment Fund and recommends a structured, accountable approach for the future, while establishing a functioning Benevolent Fund with clear contribution, eligibility and support guidelines.', chair: null },
    { name: 'Infrastructure Projects Committee', text: 'Coordinates the planning and delivery of approved construction, refurbishment and facility improvement projects. Its mandate includes assessing needs, developing project scopes and budgets, mobilising technical expertise and monitoring delivery, quality and progress.', chair: null },
    { name: 'Finance Committee', text: 'Promotes sound financial management, accountability and the responsible use of MOBA’s resources. The committee coordinates budgeting, financial reporting and expenditure oversight, maintains clear financial records and supports compliance with the association’s financial management and procurement policy.', chair: null },
    { name: 'Land Committee', text: 'Protects MOBA’s land interests and guides the development and utilisation of its property, with particular attention to the clubhouse. The committee supports tenure documentation, boundary protection and development planning, assists the school in addressing encroachment and explores suitable land investments for future needs.', chair: null },
    { name: 'Cohort Engagement Committee', text: 'Strengthens connections between MOBA and its cohorts, bringing together older and younger generations of Mwirians. The committee encourages participation, identifies expertise and opportunities within cohorts and engages members in the diaspora so that location and generation do not limit involvement.', chair: null },
    { name: 'Sports & Co-curricular Activities Committee', text: 'Supports participation, talent development and competitive achievement in sports and co-curricular activities. Working with the school and Old Boys, the committee mobilises expertise, equipment and other support for activities including cricket, rugby, football, basketball, debate, public speaking, music, dance, drama and quiz.', chair: null },
    { name: 'Membership Committee', text: 'Builds an active and engaged MOBA membership through recruitment, registration and retention. The committee maintains accurate member records, promotes subscriptions, communicates membership benefits and helps members access opportunities to participate in and contribute to the association.', chair: null },
  ],
  // Governance. Put the constitution PDF in /public (for example /moba-constitution.pdf) and set constitutionUrl.
  governance: {
    text: 'MOBA is run by an elected executive committee and answers to its members at the Annual General Meeting.', // TODO: confirm election cycle and term
    constitutionUrl: null,
    constitutionLabel: 'Read the MOBA constitution',
  },
}

// Optional: image: '/projects/name.webp' (put files in /public/projects). Without one the card shows the shield.
// Optional, for ongoing projects: progress (0-100), goal and raised (UGX). Each is only shown once set.
export const projects = [
  { year: 2025, title: 'Gate Project', summary: 'The Iconic Gate', status: 'Completed' },
  { year: 2022, title: 'Mess Reroofing', summary: 'Reroofing of the main mess building', status: 'Completed' },
  { year: 2024, title: 'Chapel Renovation', summary: 'Renovation of the chapel', status: 'Completed' },
  { year: 2025, title: 'Dispensary Renovation', summary: 'Renovation of the dispensary by Solida Cohort', status: 'Completed' },
  { year: 2025, title: 'Teacher Houses', summary: 'Renovation of the teacher houses', status: 'Completed' },
  { year: 2026, title: 'Basketball Reconstruction', summary: 'Basketball court reconstruction', status: 'Ongoing',
    progress: null, goal: null, raised: null }, // TODO: progress is 0-100, goal and raised are in UGX
  { year: 2026, title: 'Mwiri Development Master Plan', summary: 'Priority infrastructure that gives future Mwirians a better place to learn.', status: 'Ongoing',
    progress: null, goal: null, raised: null }, // TODO: confirm scope, goal and raised
  { year: 2026, title: 'MOBA Mentorship Series', summary: 'Old Boys giving students mentorship, internships and career guidance. Learn, connect, grow.', status: 'Ongoing' }, // TODO: confirm launch
]

// Publicly sourced photos. Please confirm reuse permission before launch.
// Image credits and original articles are recorded with each entry.
// Photos with a `thumb` load the small version in the grid and the full one in the lightbox.
// Optional per photo: alt (screen-reader text), focus (e.g. '50% 25%' = which part stays visible when cropped),
// featured (true = also shown in the home page strip).
// Reunion album files live in /gallery/2026-reunion (full) and /gallery/2026-reunion/thumbs (grid).
export const photos = [
  // AGM 2026 — photos supplied by the association (watermarked 'Mpala Clicks' where shown).
  { id: 206, src: '/gallery/agm-2026-6.webp', thumb: '/gallery/agm-2026-6-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — smiles from the audience', alt: 'A smiling member with arms crossed enjoying the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 25%', featured: true },
  { id: 201, src: '/gallery/agm-2026-1.webp', thumb: '/gallery/agm-2026-1-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — members gathered in the hall', alt: 'Old Boys in MOBA polo shirts seated in a hall during the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 40%', featured: true },
  { id: 203, src: '/gallery/agm-2026-3.webp', thumb: '/gallery/agm-2026-3-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — following the proceedings', alt: 'A senior member in a blue Mwirian polo listening during the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 25%' },
  { id: 204, src: '/gallery/agm-2026-4.webp', thumb: '/gallery/agm-2026-4-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — Old Boys and students together', alt: 'Old Boys sitting among students in the audience at the AGM', year: 2026, source: 'Mpala Clicks', focus: '50% 35%', featured: true },
  { id: 205, src: '/gallery/agm-2026-5.webp', thumb: '/gallery/agm-2026-5-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — members in attendance', alt: 'A member in a Mwirian polo seated at a yellow table in the school hall', year: 2026, source: 'Mpala Clicks', focus: '50% 25%' },
  { id: 202, src: '/gallery/agm-2026-2.webp', thumb: '/gallery/agm-2026-2-640.webp', category: 'AGM & meetings', caption: 'AGM 2026 — at the high table', alt: 'A member in a navy Mwirian polo seated at the high table with a microphone', year: 2026, source: 'MOBA', focus: '50% 30%' },
  {
    id: 1,
    src: '/gallery/gate-2025.webp',
    category: 'Projects & campus', caption: 'Busoga College Mwiri’s new main gate — Photo: Donald Kiirya / New Vision',
    year: 2025,
    source: 'New Vision',
    sourceUrl: 'https://www.newvision.co.ug/category/education/busoga-college-mwiri-celebrates-114-years-com-NV_221954_082026',
  },
  {
    id: 2,
    src: 'https://mwiri.sc.ug/wp-content/uploads/Sports-equipment-handover2-1.jpg',
    category: 'Projects & campus', caption: 'MOBA alumni sports equipment handover at Busoga College Mwiri',
    year: 2025,
    source: 'Busoga College Mwiri',
    sourceUrl: 'https://mwiri.sc.ug/busoga-college-mwiri-leadership-from-alumni-to-future-leaders-inspiration/',
  },
  {
    id: 3,
    src: '/gallery/dedication-2025.webp',
    category: 'Projects & campus', caption: 'Old Boys and clergy at the dedication of the new gate — Photo: New Vision',
    year: 2025,
    source: 'New Vision',
    sourceUrl: 'https://www.newvision.co.ug/category/education/busoga-college-mwiri-celebrates-114-years-com-NV_221954_082026',
  },
  {
    id: 4,
    src: '/gallery/refurb-2024.webp',
    category: 'Projects & campus', caption: 'Staff and students during the refurbishment handover — Photo: Uganda Baati',
    year: 2024,
    source: 'Uganda Baati',
    sourceUrl: 'https://ugandabaati.com/uganda-baati-supports-busoga-college-mwiri-in-sight-to-refurbish-the-school/',
  },
  {
    id: 5,
    src: '/images/gallery/mwiri-library.jpg',
    category: 'Projects & campus', caption: 'Muljibhai Madhvani Library, Busoga College Mwiri',
    year: 2026,
    source: 'MOBA',
  },
  {
    id: 6,
    src: '/images/gallery/moba-alumni-gathering.jpg',
    category: 'Projects & campus', caption: 'MOBA members gathered at Busoga College Mwiri',
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
      category: 'Reunions', caption: 'Reunion at Mwiri — 19 Sept 2026',
      year: 2026,
      source: 'MOBA',
    }
  }),
  // From the archive. Old photographs; add the year, who is pictured and a photo credit as members identify them.
  { id: 301, src: '/gallery/archive-team-1947.webp', thumb: '/gallery/archive-team-1947-640.webp', category: 'From the archive', caption: 'A Mwiri team with its trophy and masters, about 1947', alt: 'Boys in white seated and standing on the steps of a building with two masters, about 1947', year: 1947, focus: '50% 40%' },
  { id: 302, src: '/gallery/archive-wako-1965.webp', thumb: '/gallery/archive-wako-1965-640.webp', category: 'From the archive', caption: 'Wako House with its trophies, 1965, at the end of the Golden Age', alt: 'Members and masters of Wako House posed on the steps with trophies and the school motto above the door', year: 1965, focus: '50% 40%' },
  { id: 303, src: '/gallery/archive-hannington-1981.webp', thumb: '/gallery/archive-hannington-1981-640.webp', category: 'From the archive', caption: 'Hannington House at the Main Hall, 1981 — Headmaster Mr Pithy Ndiko is among those pictured', alt: 'A large group of Hannington House members on the steps of the Main Hall', year: 1981, focus: '50% 35%' },
  { id: 304, src: '/gallery/archive-cricket-1990s.webp', thumb: '/gallery/archive-cricket-1990s-640.webp', category: 'From the archive', caption: 'A Mwiri cricket XI in the 1990s', alt: 'A Mwiri cricket team in whites, standing and kneeling on the field', focus: '50% 35%' }, // TODO: add year (date stamp on the photo looks like 96)
  { id: 305, src: '/gallery/archive-cricket-team.webp', thumb: '/gallery/archive-cricket-team-640.webp', category: 'From the archive', caption: 'A Mwiri cricket team in whites with their master', alt: 'Cricketers in whites on the steps of a building beside their master, who holds a bat', focus: '50% 30%' }, // TODO: add year
  { id: 306, src: '/gallery/archive-football-team-restored.webp', thumb: '/gallery/archive-football-team-restored-640.webp', category: 'From the archive', caption: 'The Busoga High School football team, from the era when the school carried that name', alt: 'A football team seated on wide steps holding a ball, with a caption reading Busoga High School Football Team', focus: '50% 40%' }, // TODO: add year
  { id: 307, src: '/gallery/archive-thatched-buildings.webp', thumb: '/gallery/archive-thatched-buildings-640.webp', category: 'From the archive', caption: 'Pupils outside the early thatched school buildings', alt: 'Long thatched school buildings with pupils gathered in the distance under a large tree', focus: '50% 50%' }, // TODO: add year and location
]

// ---------- STORE ----------
// PRICES ARE PLACEHOLDERS (UGX) until costs are confirmed. Items with preview: true use designer concept
// images (not photos of stock) and show a "Preview design" label; remove the flag once real photos exist.
// delivery: 'digital' = instant download/e-mail, 'physical' = needs an address.
// image: put files in /public/store and use '/store/tie.webp'
// category: the Store page builds its filter buttons from these. variant: colour/style, shown under the name.
export const products = [
  { id: 'book-lamp-on-a-hill', name: 'A Lamp on a Hill', variant: 'A centenary history of Busoga College Mwiri, 1911–2011, by Rev. Canon Dr. Tom Tuma', category: 'Books', price: 50000, delivery: 'physical', image: '/store/book-lamp-on-a-hill.webp' }, // TODO: confirm price
  { id: 'blazer-navy', name: 'MOBA Blazer', variant: 'Navy with gold buttons and crest pocket', category: 'Blazers', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/blazer-navy.webp', preview: true }, // TODO: confirm price
  { id: 'tie-navy', name: 'MOBA Old Boys Tie', variant: 'Navy with gold stripes and leopard crests', category: 'Ties & pins', price: 50000, delivery: 'physical', image: '/store/tie-navy.webp', preview: true },
  { id: 'cufflinks-formal', name: 'Crest Cufflinks', variant: 'Gold-edged enamel leopard shield', category: 'Ties & pins', price: 50000, delivery: 'physical', image: '/store/cufflinks-formal.webp', preview: true }, // TODO: confirm price
  { id: 'pin-shield', name: 'Lapel Pin', variant: 'Enamel leopard shield', category: 'Ties & pins', price: 10000, delivery: 'physical', image: '/store/pin-shield.webp', preview: true },
  { id: 'tee-white', name: 'Heritage Tee', variant: 'White with navy and gold trim', category: 'T-shirts', price: 80000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/tee-white.webp', preview: true },
  { id: 'tee-navy', name: 'Heritage Tee', variant: 'Signature navy, tone-on-tone leopard', category: 'T-shirts', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/tee-navy.webp', preview: true },
  { id: 'tee-sash', name: 'Stripe Tee', variant: 'White and navy with gold sash', category: 'T-shirts', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/tee-sash.webp', preview: true },
  { id: 'cap-crest-white', name: 'Crest Baseball Cap', variant: 'Classic white', category: 'Caps', price: 70000, delivery: 'physical', image: '/store/cap-crest-white.webp', preview: true },
  { id: 'cap-crest-navy', name: 'Crest Baseball Cap', variant: 'Signature navy', category: 'Caps', price: 70000, delivery: 'physical', image: '/store/cap-crest-navy.webp', preview: true },
  { id: 'cap-crest-twotone', name: 'Crest Baseball Cap', variant: 'White and navy two-tone', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/cap-crest-twotone.webp', preview: true },
  { id: 'trucker-crest-white', name: 'Crest Trucker Cap', variant: 'White front, navy mesh', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-crest-white.webp', preview: true },
  { id: 'trucker-crest-navy', name: 'Crest Trucker Cap', variant: 'All navy', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-crest-navy.webp', preview: true },
  { id: 'trucker-crest-gold', name: 'Crest Trucker Cap', variant: 'Navy and gold mesh', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-crest-gold.webp', preview: true },
  { id: 'trucker-mwiri-white', name: 'Mwiri Est. 1911 Trucker', variant: 'White and navy', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-mwiri-white.webp', preview: true },
  { id: 'trucker-mwiri-navy', name: 'Mwiri Est. 1911 Trucker', variant: 'Signature navy', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-mwiri-navy.webp', preview: true },
  { id: 'trucker-mwiri-gold', name: 'Mwiri Est. 1911 Trucker', variant: 'White, navy and gold', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/trucker-mwiri-gold.webp', preview: true },
  { id: 'cap-mwiri-white', name: 'Mwiri Est. 1911 Baseball Cap', variant: 'Classic white', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/cap-mwiri-white.webp', preview: true },
  { id: 'cap-mwiri-navy', name: 'Mwiri Est. 1911 Baseball Cap', variant: 'Signature navy', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/cap-mwiri-navy.webp', preview: true },
  { id: 'cap-mwiri-khaki', name: 'Mwiri Est. 1911 Baseball Cap', variant: 'Khaki', category: 'Caps', price: 50000, delivery: 'physical', image: '/store/cap-mwiri-khaki.webp', preview: true },
  { id: 'bucket-navy', name: 'Crest Bucket Hat', variant: 'Classic navy', category: 'Bucket hats', price: 50000, delivery: 'physical', image: '/store/bucket-navy.webp', preview: true },
  { id: 'bucket-white', name: 'Crest Bucket Hat', variant: 'White', category: 'Bucket hats', price: 50000, delivery: 'physical', image: '/store/bucket-white.webp', preview: true },
  { id: 'bucket-twotone', name: 'Crest Bucket Hat', variant: 'Navy with gold brim', category: 'Bucket hats', price: 50000, delivery: 'physical', image: '/store/bucket-twotone.webp', preview: true },
  { id: 'hoodie-white', name: 'Crest Hoodie', variant: 'Classic white', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/hoodie-white.webp', preview: true },
  { id: 'hoodie-navy', name: 'Mwiri Est. 1911 Hoodie', variant: 'Signature navy', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/hoodie-navy.webp', preview: true },
  { id: 'hoodie-twotone', name: 'Crest Hoodie', variant: 'Navy with white sleeves', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/hoodie-twotone.webp', preview: true },
  { id: 'gilet-navy', name: 'Crest Gilet', variant: 'Signature navy', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/gilet-navy.webp', preview: true },
  { id: 'gilet-white', name: 'Crest Gilet', variant: 'Classic white', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/gilet-white.webp', preview: true },
  { id: 'gilet-mwiri', name: 'Mwiri Est. 1911 Gilet', variant: 'Navy with gold lining', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/gilet-mwiri.webp', preview: true },
  { id: 'gilet-twotone', name: 'Crest Gilet', variant: 'Navy, white and gold', category: 'Hoodies & gilets', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/gilet-twotone.webp', preview: true },
  { id: 'vest-navy', name: 'Running Vest', variant: 'Classic navy', category: 'Running vests', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/vest-navy.webp', preview: true },
  { id: 'vest-white', name: 'Running Vest', variant: 'Classic white', category: 'Running vests', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/vest-white.webp', preview: true },
  { id: 'vest-navy-modern', name: 'Running Vest', variant: 'Modern navy, gold piping', category: 'Running vests', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/vest-navy-modern.webp', preview: true },
  { id: 'vest-white-sporty', name: 'Running Vest', variant: 'Sporty white, navy panels', category: 'Running vests', price: 50000, delivery: 'physical', sizes: 'S, M, L, XL, XXL', image: '/store/vest-white-sporty.webp', preview: true },
  { id: 'bag-gym', name: 'Crest Gym Bag', variant: 'Navy with gold zips', category: 'Bags', price: 50000, delivery: 'physical', image: '/store/bag-gym.webp', preview: true },
  { id: 'bag-backpack', name: 'Crest Backpack', variant: 'Navy with gold zips', category: 'Bags', price: 50000, delivery: 'physical', image: '/store/bag-backpack.webp', preview: true },
  { id: 'bag-string', name: 'Crest String Bag', variant: 'Navy', category: 'Bags', price: 50000, delivery: 'physical', image: '/store/bag-string.webp', preview: true },
  { id: 'mug-white', name: 'Crest Mug', variant: 'Classic white', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/mug-white.webp', preview: true },
  { id: 'mug-navy', name: 'Mwiri Est. 1911 Mug', variant: 'Signature navy', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/mug-navy.webp', preview: true },
  { id: 'mug-twotone', name: 'Crest Mug', variant: 'White and navy two-tone', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/mug-twotone.webp', preview: true },
  { id: 'mug-lid', name: 'Premium Lid Mug', variant: 'Navy with bamboo lid', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/mug-lid.webp', preview: true },
  { id: 'thermos-navy', name: 'Mwiri Est. 1911 Thermos', variant: 'Signature navy', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/thermos-navy.webp', preview: true },
  { id: 'thermos-white', name: 'Mwiri Est. 1911 Thermos', variant: 'Classic white', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/thermos-white.webp', preview: true },
  { id: 'thermos-minimal', name: 'Crest Thermos', variant: 'Minimalist navy', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/thermos-minimal.webp', preview: true },
  { id: 'bottle-sport', name: 'Mwiri Est. 1911 Water Bottle', variant: 'Navy sport cap', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/bottle-sport.webp', preview: true },
  { id: 'bottle-twotone', name: 'Crest Water Bottle', variant: 'White and navy two-tone', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/bottle-twotone.webp', preview: true },
  { id: 'bottle-clear', name: 'Mwiri Est. 1911 Water Bottle', variant: 'Clear', category: 'Mugs & bottles', price: 50000, delivery: 'physical', image: '/store/bottle-clear.webp', preview: true },
]

// ---------- MEMBERSHIP ----------
// PRICES ARE PLACEHOLDERS (UGX) until costs are confirmed.
export const tiers = [
  { id: 'annual', name: 'Annual Member', price: 50000,  period: 'year',     perks: ['Membership register listing', 'Event invitations', 'Digital membership card', 'Voting rights at MOBA general meetings'] },
  
  { id: 'life',   name: 'Life Member',   price: 1010000, period: 'one-off',  perks: ['Lifetime membership', 'Name on the Life Members roll', 'MOBA tie and pin', 'Voting rights at MOBA general meetings'] },
]

// ---------- MEMBER BENEFITS ----------
// Shown on the Membership page. Add more entries here as new benefits launch.
// to: the page that handles sign-up for the benefit.
export const benefits = [
  {
    id: 'funeral',
    title: 'MOBA Group Last Expense Insurance',
    text: 'Annual family cover for you and eligible dependants, in partnership with Kenbright and Prudential. View the benefits and enrol online.',
    to: '/funeral-cover',
    cta: 'View cover and enrol',
  },
]

// Group Last Expense Insurance settings supplied by the association.
// waitingPeriod stays hidden until the scheme committee confirms it.
export const funeralCover = {
  name: 'MOBA Group Last Expense Insurance',
  premium: 120000,
  period: 'year',
  maxDependants: 9,       // one spouse + four children + two parents + two parents-in-law
  waitingPeriod: null,    // TODO: confirm with the scheme committee, or leave null to hide it
  payout: null,           // individual benefits are listed in the benefits array below
  benefits: [
    { label: 'Principal member', amount: 10000000 },
    { label: 'Spouse', amount: 5000000 },
    { label: 'Children', amount: 1500000, note: 'per child, up to four children' },
    { label: 'Parents and parents-in-law', amount: 1000000, note: 'per person, up to four people in total—the principal member’s two parents and the spouse’s two parents' },
  ],
  paymentNote: 'MTN MoMoPay, Airtel Pay or Standard Chartered bank transfer. Details are below.',
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

// ---------- ARCHIVES ----------
// The association's records: reports, minutes, newsletters, the constitution and old programmes.
// Put each file in /public/archives and point `file` at it (e.g. '/archives/agm-2019-minutes.pdf'),
// or use a full https:// link if the file is hosted elsewhere.
// Required: title, year, category (one of archiveCategories), file.
// Optional: year (leave out if unknown: the record is listed as Undated), period (shown on the card, e.g. '1988/89'
// or '1950s'), summary (one line), size (e.g. '1.2 MB'), cover (a picture of the front page), source (who supplied it).
// Only add records the executive is happy to make public. Members-only papers do not belong here.
export const archiveCategories = ['Annual reports', 'Minutes', 'Newsletters', 'Constitution & policies', 'Mpala Magazine', 'Programmes & magazines', 'Photographs', 'Registers & rolls', 'House records', 'Other']
export const archives = [
  // { year: 2019, category: 'Minutes', title: 'Annual General Meeting minutes', summary: 'Minutes of the 2019 AGM.', file: '/archives/agm-2019-minutes.pdf', size: '1.2 MB' },
]

// ---------- PROMINENT MWIRIANS ----------
// Old Boys whose work has made the school proud. Add only people (or families) who have agreed to be listed.
// Required: name, field (one of mwirianFields), knownFor (one line shown on the card).
// Optional: cohort (year the class started S1), cohortName, houses (array), photo ('/mwirians/name.webp'),
//           bio (array of paragraphs), featured (true = listed first), deceased (true = shows "Late" before the name).
// Put photos in /public/mwirians.
export const mwirianFields = [
  'Public service & politics', 'Law & justice', 'Business & industry', 'Medicine & science',
  'Education & academia', 'Sports', 'Arts & media', 'Faith & community',
]
export const prominentMwirians = [
  // Portraits are publicly sourced. Please confirm reuse permission before launch.
  // `cohort` is only set where the start year is known; add it (and cohortName / houses) as members confirm.
  { name: 'Apollo Milton Obote', field: 'Public service & politics', knownFor: 'Uganda’s first Prime Minister and later President', cohort: '1942', photo: '/mwirians/obote.webp', deceased: true },
  { name: 'Ruhakana Rugunda', field: 'Public service & politics', knownFor: 'Former Prime Minister of Uganda', photo: '/mwirians/rugunda.webp' },
  { name: 'William Gabula Nadiope IV', field: 'Faith & community', knownFor: 'Kyabazinga of Busoga', photo: '/mwirians/nadiope.webp' }, // TODO: confirm field (cultural leadership)
  { name: 'Samwiri Wako Wambuzi', field: 'Law & justice', knownFor: 'Three-time Chief Justice of Uganda', photo: '/mwirians/wambuzi.webp' },
  { name: 'Fred Egonda-Ntende', field: 'Law & justice', knownFor: 'Chief Justice of Seychelles (2009–2014) and Justice of Uganda’s Court of Appeal', photo: '/mwirians/ntende.webp' },
  { name: 'George Kanyeihamba', field: 'Law & justice', knownFor: 'Justice of the Supreme Court of Uganda and former Attorney General', photo: '/mwirians/kanyeihamba.webp', deceased: true },
  { name: 'Francis Joash Ayume', field: 'Public service & politics', knownFor: 'Speaker of Uganda’s 6th Parliament (1998–2001) and Attorney General', photo: '/mwirians/ayume.webp', deceased: true },
  { name: 'Dr. Yefusa Okullo Epak', field: 'Public service & politics', knownFor: 'Former Member of Parliament and Government Chief Planner', photo: '/mwirians/epak.webp' }, // TODO: confirm role and spelling of the surname
  { name: 'Barnabas Nawangwe', field: 'Education & academia', knownFor: 'Professor and academic', photo: '/mwirians/nawangwe.webp' }, // TODO: confirm the role line
  { name: 'Andrew Mwenda', field: 'Arts & media', knownFor: 'Journalist', photo: '/mwirians/mwenda.webp' },
  { name: 'Daniel Kalinaki', field: 'Arts & media', knownFor: 'Journalist', photo: '/mwirians/kalinaki.webp' },
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
    name: 'Collins Hinamundi', role: 'Vice President', cohort: '2004', cohortName: 'Blue Dollar', houses: ['Hannington'], photo: '/leaders/collins-hinamundi.webp', focus: '50% 50%',
    bio: [
      'Collins Hinamundi is a seasoned Product Marketing professional with over 14 years of experience across telecommunications and media. He specialises in product strategy, market development and brand growth. He is passionate about sustainability, long-term value creation and building systems that deliver lasting impact beyond immediate gains.',
      'As Vice President of MOBA, Collins brings a strategic, forward-looking perspective focused on strengthening alumni engagement, mobilising collective resources and championing sustainable solutions that secure Mwiri’s future. He believes in building institutions that can thrive for generations through shared ownership, strategic investment and a strong sense of brotherhood.',
    ],
  },
  {
    name: 'Arthur Abaliwano', role: 'Secretary General', cohort: '2003', cohortName: 'Kombora', houses: ['Waako'], photo: '/leaders/arthur-abaliwano.webp',
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
  { name: 'Davis Lado', role: 'Assistant Treasurer', cohort: '2005',cohortName: 'Lukambwe', houses: ['Waako'], photo: '/leaders/davis-lado.webp',
    bio: [
      'Davis Lado is a Professional Accountant with over 10 years of professional experience and a proud son of Mwiri.',
      'His contribution to the Mwiri community reflects a passion for bringing people together, strengthening connections, and turning shared aspirations into meaningful action.',
      'As Assistant Hon. Treasurer of MOBA, Davis brings valuable accounting expertise and financial management experience to support sound financial decision-making and the successful implementation of the Association’s strategic initiatives. He is committed to promoting financial transparency, accountability, prudent resource management, and timely financial reporting to ensure members remain informed and confident in how the Association’s resources are managed.',
      'In addition to his treasury responsibilities, Davis serves on the MOBA Academic Committee, contributing to initiatives that promote academic excellence and support the continued growth and development of the Mwiri community.',
      'Through these roles, Davis is committed to strengthening MOBA’s financial stewardship, advancing its strategic objectives, and preserving the values and legacy of Mwiri for current and future generations.'
    ],
   },
  {
    name: 'Henry Mugisha Rodney', role: 'Publicity Secretary', cohort: '1988', cohortName: 'Ruga Ruga', houses: ['Coates'], photo: '/leaders/rodney-mugisha.webp',
    bio: [
      'Henry Mugisha Rodney is a banker and insurer by profession, and a risk adviser, digital strategist and brand influencer. He has played an active role in the Mwiri community and MOBA for many years.',
      'In 2011, Rodney served as Chief Mobiliser for the Old Boys’ Mwiri 100 celebrations. He later chaired Mwiri Cricket Club during its time in the national league from 2011 to 2016. As team manager, he helped Busoga College Mwiri win ten National Cricket Week trophies. The Uganda Cricket Association named him Manager of the Year in 2014 and runner-up in 2015.',
      'Rodney has served as MOBA Publicity Secretary since 2014. He has also worked with the executive and the Mwiri brotherhood on a range of initiatives, including school projects launched in 2015, the sold-out 2017 Mwiri Endowment Fund Dinner, and the introduction of Mwirian-branded merchandise. In 2017, he and MOBA President Dr Patrick Ibembe invited the Kyabazinga of Busoga to attend a Mwiri homecoming as Chief Guest.',
      'His contributions have included helping secure recognition for Paramount Chief Yosia Nadiope, who established the school, and mobilising support for the Mess Roofing Drive, the MOBA Life Membership campaign and the Mwiri Gate Project in 2024.',
    ],
  },
  {
    name: 'Chris Mwanja', role: 'Executive Member', cohort: '2001', cohortName: 'Buliti', houses: ['Hannington'], photo: '/leaders/chris-mwanja.webp',
    bio: [
      'Chris Mwanja is an Electronics and Communication Engineer and web developer, and a proud Mwirian from Hannington House. He brings the discipline and attention to detail of his engineering profession to his service within MOBA.',
      'Chris served as Chairman of the Mwiri League for the 2024–2025 term, where he helped coordinate alumni sporting activities and strengthen engagement across cohorts. He also sits on the Mwiri Basketball Reconstruction Committee, where he has been directly involved in driving the revival of competitive basketball at the school.',
      'As an Executive Committee member, Chris is committed to serving Mwiri with the same dedication he has shown to date.',
    ],
  },
  { name: 'Arthur Kyagaba', role: 'Executive Member', cohort: '2003',cohortName: 'Kombora', houses: ['Hannington'], photo: '/leaders/arthur-kyagaba.webp',
    bio: [
      'Arthur is a Procurement Professional and a Businessman - Luba Modern Market which offer low-cost commercial space for low-income earners and LMM Media which offers digital visual advertising services to businesses.',
      'His passion for MOBA and Mwiri reflects in being a founding Vice Chairman of Mwiri League; Chairman Electoral Commission Mwiri League; Founding member of the MOBA Academic Committee since 2023; Member of Mwiri Cricket Committee; Member of Mwiri Cricket Oval Development Project and an advocate of change in the academic space of Mwiri since 2020',
      'As a Committee member; his desire is self sustainability of MOBA and Mwiri League, Transparency in service delivery and Support academic improvement strategies',
    ],
   },
  {
    name: 'Joshua Bizimungu', role: 'Executive Member', cohort: '2011', cohortName: 'Shadow', houses: ['Willis'], photo: '/leaders/joshua-bizimungu.webp',
    bio: [
      'Joshua Bizimungu is a Management Analyst in Uganda’s Ministry of Public Service. He brings experience in leadership, public administration, organisational management and alumni mobilisation.',
      'Joshua served as President of the MOBA Makerere Chapter and MOBA Special Envoy for Asia, Joshua chaired the 2024 MOBA Homecoming Organizing Committee, which attracted thousands of attendees. A former School Volleyball Captain and Entertainment Prefect, he has also coached Mwiri’s volleyball team and continues to champion alumni engagement, sports development and the Mwiri spirit. As Chief Whip, he is committed to strengthening campus mobilization and active participation in MOBA.',
    ],
  },
  { name: 'Allan Senyonga', role: 'Executive Member', cohort: '1995', cohortName: 'Solida', houses: ['Wilson'], photo: '/leaders/allan-senyonga.webp', focus: '50% 50%',
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