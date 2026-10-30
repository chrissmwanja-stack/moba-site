import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import OurMwiriNav from '../components/OurMwiriNav.jsx'
import ArchivePhotos from '../components/ArchivePhotos.jsx'
import ArchiveAppeal from '../components/ArchiveAppeal.jsx'
import { archiveCategories } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'
import { safeUrl } from '../lib/safeUrl.js'
import { archiveSearchText, archiveStory, archiveWhen, archiveYear, archiveYears, isPhotoOnly, sortArchives, yearHeading } from '../lib/archives.js'

const chip =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand '

export default function Archives() {
  const { archives } = useContent()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const requested = params.get('category')
  const category = archiveCategories.includes(requested) ? requested : 'All'
  const choose = c => (c === 'All' ? setParams({}) : setParams({ category: c }))

  const countOf = c => (c === 'All' ? archives.length : archives.filter(a => a.category === c).length)
  // Only offer categories that hold at least one record, so visitors never land on an empty list.
  const offered = archiveCategories.filter(c => countOf(c) > 0)

  const q = query.trim().toLowerCase()
  const shown = useMemo(
    () =>
      sortArchives(
        archives
          .filter(a => category === 'All' || a.category === category)
          .filter(a => !q || archiveSearchText(a).includes(q)),
      ),
    [archives, category, q],
  )

  // Group by year, newest first, with undated records last.
  const years = archiveYears(shown)

  return (
    <>
      <PageHeader
        eyebrow="Our Mwiri"
        title="Archives"
        image="/gallery/archive-thatched-buildings.webp"
        position="50% 55%"
        subtitle="Reports, minutes, newsletters, photographs and records that tell the story of the association."
      />
      <OurMwiriNav />

      {archives.length === 0 ? (
        <section className="max-w-3xl mx-auto px-4 mt-10 text-center">
          <p className="text-ink/75">
            Reports, minutes and newsletters will be added here as they are gathered. For older stories, see{' '}
            <Link to="/history" className="font-medium text-brand underline">Our History</Link> and the{' '}
            <Link to="/gallery" className="font-medium text-brand underline">Photo Gallery</Link>.
          </p>
        </section>
      ) : (
        <>
          <section className="max-w-6xl mx-auto px-4 mt-10 space-y-4">
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {['All', ...offered].map(c => {
                const active = c === category
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => choose(c)}
                    aria-pressed={active}
                    className={chip + (active ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/25 hover:bg-gold/20')}
                  >
                    {c} <span className={active ? 'text-white/70' : 'text-ink/70'}>({countOf(c)})</span>
                  </button>
                )
              })}
            </div>
            <div>
              <label htmlFor="archive-search" className="sr-only">Search the archives</label>
              <input
                id="archive-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, year or story"
                className="w-full max-w-md rounded-md border border-ink/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 mt-8 space-y-10" aria-live="polite">
            {shown.length === 0 && <p className="text-ink/70">Nothing matches your search. Try a different word or category.</p>}
            {years.map(y => (
              <div key={y ?? 'undated'}>
                <h2 className="mb-4 border-b-2 border-gold pb-1 text-xl font-bold text-brand">{yearHeading(y)}</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {shown.filter(a => archiveYear(a) === y).map(a => (
                    <li key={(a._id || a.file || a.cover) + a.title} className={`rounded-md border border-brand/10 bg-white ${isPhotoOnly(a) ? 'flex flex-col overflow-hidden' : 'flex gap-4 p-5'}`}>
                      {isPhotoOnly(a) && safeUrl(a.coverThumb || a.cover) && (
                        <img
                          src={safeUrl(a.coverThumb || a.cover)}
                          alt={a.title}
                          loading="lazy"
                          decoding="async"
                          className="h-56 w-full border-b border-brand/10 object-cover"
                        />
                      )}
                      {!isPhotoOnly(a) && safeUrl(a.coverThumb || a.cover) && (
                        <img
                          src={safeUrl(a.coverThumb || a.cover)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-28 w-20 shrink-0 rounded border border-brand/10 object-cover"
                        />
                      )}
                      <div className={`flex min-w-0 flex-1 flex-col ${isPhotoOnly(a) ? 'p-5' : ''}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-gold-dark">{a.category}{a.period ? ` · ${a.period}` : ''}</p>
                        <h3 className="mt-1 text-lg font-semibold text-brand">{a.title}</h3>
                        {a.summary && <p className="mt-1 text-sm text-ink/75">{a.summary}</p>}
                        {archiveStory(a).length > 0 && (
                          <details className="mt-3 text-sm">
                            <summary className="cursor-pointer font-semibold text-brand underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                              Read the story<span className="sr-only"> of {a.title}</span>
                            </summary>
                            <div className="mt-2 space-y-2 leading-relaxed text-ink/80">
                              {archiveStory(a).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                            </div>
                          </details>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <a
                            href={safeUrl(isPhotoOnly(a) ? a.cover : a.file) || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand underline hover:text-brand-dark"
                          >
                            {isPhotoOnly(a) ? 'View full photo' : 'Open'}<span className="sr-only"> {a.title} ({archiveWhen(a)})</span>
                          </a>
                          {!isPhotoOnly(a) && a.size && <span className="text-ink/70">{a.size}</span>}
                          {a.source && <span className="text-ink/70">Supplied by {a.source}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="max-w-6xl mx-auto px-4 mt-12">
            <p className="text-sm text-ink/75">
              Missing something? <Link to="/contact?topic=Contribute to the archives" className="font-medium text-brand underline">Help us complete the archive</Link>.
            </p>
          </section>
        </>
      )}

      <ArchivePhotos />
      <ArchiveAppeal />
    </>
  )
}
