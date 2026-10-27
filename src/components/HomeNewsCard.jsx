import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format.js'
import { newsPath } from '../lib/news.js'

export default function HomeNewsCard({ item }) {
  return (
    <Link
      to={newsPath(item)}
      className="group block h-full overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <article className="flex h-full flex-col">
        <div className="aspect-[2/1] overflow-hidden bg-[#e7e9ed]">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <span className="font-display text-lg italic text-brand/55">MOBA stories from the Hill</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-sm font-medium text-brand/70">
            {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
            {item.date && item.category && <span aria-hidden="true"> · </span>}
            {item.category}
          </p>
          <h3 className="mt-3 font-display text-[22px] font-semibold leading-[1.18] text-brand md:text-[25px]">
            {item.title}
          </h3>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand underline underline-offset-4 decoration-brand/50 group-hover:decoration-brand">
            Read more <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
