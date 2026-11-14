import { pastLeaderGroups } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'

const GROUP_INTRO = {
  Presidents: 'In order of service, oldest first.',
  Patrons: 'Old Boys who have lent their name and support to the association.',
  Chapters: 'Leaders of MOBA chapters beyond the Hill.',
}

function PastCard({ l }) {
  const meta = [l.period, l.house && `${l.house} House`].filter(Boolean)
  return (
    <article>
      <div className="aspect-4/5 overflow-hidden border-b-4 border-gold bg-brand">
        {l.photo
          ? <img src={l.photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: '50% 20%' }} />
          : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
              <img src="/moba-shield.webp" alt="" className="h-16 w-auto" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Portrait to come</span>
            </div>
          )}
      </div>
      <h4 className="mt-3 font-semibold text-brand">{l.name}</h4>
      <p className="text-sm font-medium text-gold-dark">{l.role}</p>
      {meta.map(m => <p key={m} className="text-xs text-ink/65">{m}</p>)}
      {l.note && <p className="mt-1 text-xs leading-relaxed text-ink/70">{l.note}</p>}
    </article>
  )
}

// Presidents, patrons and chapter leaders from earlier years. The list is edited under "Past leadership" in /admin/content.
export default function PastLeadership() {
  const { pastLeaders, site } = useContent()
  if (!pastLeaders?.length) return null
  const groups = [...new Set([...pastLeaderGroups, ...pastLeaders.map(l => l.group).filter(Boolean)])]
    .map(group => ({ group, people: pastLeaders.filter(l => l.group === group) }))
    .filter(g => g.people.length)

  return (
    <section id="past-leadership" aria-labelledby="past-leadership-heading" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">Leadership through the years</p>
        <h2 id="past-leadership-heading" className="mt-3 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">Those who have led MOBA</h2>
        <div className="mt-5 h-0.75 w-14 bg-gold" aria-hidden="true" />
        <p className="mt-5 leading-relaxed text-ink/75">
          MOBA has been led by Old Boys from every generation. Some details are still being confirmed.
          {site?.email && <> If you can help fill a gap, please write to <a href={`mailto:${site.email}`} className="font-medium text-brand underline">{site.email}</a>.</>}
        </p>
      </div>

      {groups.map(({ group, people }) => (
        <div key={group} className="mt-10">
          <h3 className="font-display text-xl font-bold text-brand">{group}</h3>
          {GROUP_INTRO[group] && <p className="mt-1 text-sm text-ink/65">{GROUP_INTRO[group]}</p>}
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {people.map(l => <PastCard key={`${group}-${l.name}`} l={l} />)}
          </div>
        </div>
      ))}
    </section>
  )
}
