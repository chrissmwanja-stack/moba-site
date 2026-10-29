// Every photographic background used by a page hero, banner or photo band.
// CMS overrides live in the existing site settings record as backgrounds: { [key]: imageUrl }.
export const BACKGROUNDS = {
  default: { label: 'Shared default and portal banners', image: '/moba-campus.webp', imageSmall: '/moba-campus-640.webp' },
  home: { label: 'Home page hero', image: '/mwiri-hero.webp' },
  about: { label: 'About MOBA hero', image: '/about-hero.webp', imageSmall: '/about-hero-640.webp' },
  membership: { label: 'Membership hero', image: '/membership-hero.webp', imageSmall: '/membership-hero-640.webp' },
  history: { label: 'Our History banner', image: '/moba-campus.webp', imageSmall: '/moba-campus-640.webp' },
  projectSpotlight: { label: 'Project spotlight banners', image: '/moba-campus.webp', imageSmall: '/moba-campus-640.webp' },
  projects: { label: 'Projects banner', image: '/projects/court-aerial.webp' },
  gallery: { label: 'Photo Gallery banner', image: '/gallery/agm-2026-4.webp' },
  news: { label: 'News & Events banner', image: '/gallery/agm-2026-1.webp' },
  store: { label: 'Store banner', image: '/gallery/mwiri-today/campus-crane-sculpture.webp' },
  support: { label: 'Support MOBA banner', image: '/gallery/dedication-2025.webp' },
  donate: { label: 'Donate banner', image: '/gallery/refurb-2024.webp' },
  contact: { label: 'Contact banner', image: '/gallery/gate-2025.webp' },
  archives: { label: 'Archives banner', image: '/gallery/archive-thatched-buildings.webp' },
  cohorts: { label: 'Branches & Cohorts banner', image: '/gallery/archive-team-1947.webp' },
  mwirians: { label: 'Prominent Mwirians banner', image: '/gallery/mwiri-today/campus-hannington-house.webp' },
  funeralCover: { label: 'Funeral Cover banner', image: '/gallery/mwiri-today/campus-garden-path.webp' },
  cart: { label: 'Cart banner', image: '/gallery/mwiri-today/campus-campus-road.webp' },
  memberLogin: { label: 'Member login banner', image: '/gallery/mwiri-today/campus-main-entrance.webp' },
  adminLogin: { label: 'Staff login banner', image: '/gallery/mwiri-today/campus-main-block-steps.webp' },
}

export function getBackground(key, overrides = {}) {
  if (!key) return null
  const fallback = BACKGROUNDS[key] || BACKGROUNDS.default
  const custom = typeof overrides?.[key] === 'string' ? overrides[key].trim() : ''
  if (custom && custom !== fallback.image) return { ...fallback, image: custom, imageSmall: undefined }
  return fallback
}

// Existing page components can keep their original image props; the path identifies the editable setting.
export function backgroundKeyForImage(image) {
  if (!image) return 'default'
  return Object.entries(BACKGROUNDS).find(([, background]) => background.image === image)?.[0] || null
}

// Show the effective current pictures in the editor the first time site settings are opened.
export function withEditableBackgrounds(data = {}) {
  const backgrounds = Object.fromEntries(Object.keys(BACKGROUNDS).map(key => [key, getBackground(key, data.backgrounds).image]))
  return { ...data, backgrounds }
}
