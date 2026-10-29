// Pure content-selection logic. Kept separate from browser storage and Supabase so it can be
// unit-tested in Node and reused without import.meta.env or a React runtime.
import * as base from '../data/content.js'

const items = (st, kind) => st.rows.filter(r => r.kind === kind && r.data).map(r => ({ ...r.data, _id: r.id }))

export function build(st) {
  const managed = kind => Boolean(st && st.managed.includes(kind))
  const list = (kind, fallback) => (managed(kind) ? items(st, kind) : fallback)

  const settings = managed('setting') ? st.rows.find(r => r.kind === 'setting' && r.key === 'site')?.data || {} : {}
  const site = { ...base.site, ...settings, social: { ...base.site.social, ...(settings.social || {}) } }
  if (!Array.isArray(site.donate)) site.donate = base.site.donate

  const aboutRow = st?.rows?.find(r => r.kind === 'about' && r.key === 'about')
  const about = managed('about') ? (aboutRow?.data || base.about) : base.about
  return {
    site,
    stats: about.stats || base.stats,
    leadersTerm: settings.leadersTerm || base.leadersTerm,
    news: list('news', base.news),
    photos: managed('photo') ? items(st, 'photo').map(p => ({ ...p, id: p._id })) : base.photos,
    projects: list('project', base.projects),
    leaders: list('leader', base.leaders),
    prominentMwirians: list('mwirian', base.prominentMwirians),
    archives: list('archive', base.archives),
    timeline: list('timeline', base.timeline),
    history: base.history,
    about,
    products: list('product', base.products),
    tiers: list('membership_plan', base.tiers),
    cohorts: list('cohort', base.cohorts),
  }
}
