import { Link } from 'react-router-dom'

// "Help us preserve Mwiri's story": invites Old Boys to contribute photographs and records to the archive.
// The Hannington House 1981 photograph lives here, so ArchivePhotos leaves it out of its own grid.
export default function ArchiveAppeal() {
  return (
    <section className="bg-[#f5e6c4] py-14 md:py-16" aria-labelledby="archive-appeal-title">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        <figure>
          <img
            src="/gallery/archive-hannington-1981.webp"
            alt="Hannington House members on the steps of the Main Hall in 1981"
            loading="lazy"
            decoding="async"
            className="w-full rounded-md border-b-4 border-brand object-cover"
          />
          <figcaption className="mt-3 text-sm italic text-brand/80">
            Hannington House at the Main Hall, 1981. Among those pictured is Mr. Pithy Ndiko, Headmaster of Busoga College Mwiri.
          </figcaption>
        </figure>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Archives</p>
          <h2 id="archive-appeal-title" className="mt-3 font-display text-3xl font-bold leading-tight text-brand md:text-4xl">
            Help us preserve Mwiri&rsquo;s story
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand/80">
            Do you have old photographs, copies of Mpala Magazine, house records or memories of the Hill? Share them with the PR &amp; Communications Committee so they can be kept for future generations of Mwirians.
          </p>
          <Link
            to="/contact?topic=Contribute to the archives"
            className="mt-6 inline-block rounded-md bg-brand px-7 py-4 font-semibold text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Share your archives
          </Link>
        </div>
      </div>
    </section>
  )
}
