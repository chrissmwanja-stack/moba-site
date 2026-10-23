import { Link } from "react-router-dom";

export function readingMinutes(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * item: { title, date, excerpt, body?, image?, category?, series?, minutes?, to? }
 * category: "Reunion" | "Cohort" | "Project" | "News" ...
 * series:   "Throwback" | "Cohort spotlight" ... (recurring features)
 */
export default function NewsCard({ item }) {
  const { title, date, excerpt, body, image, category, series, minutes, place, to } = item;
  const mins = minutes ?? (body ? readingMinutes(body) : null);

  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-brand/15 bg-white">
      {image ? (
        <img src={image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-brand">
          <img src="/moba-shield.webp" alt="" className="h-16 w-auto opacity-90" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {(category || series) && (
          <p className="mb-2 flex flex-wrap gap-2 text-sm font-semibold text-gold-dark">
            {category && <span>{category}</span>}
            {series && (
              <span className="rounded-full bg-gold/25 px-2 text-brand-dark">{series}</span>
            )}
          </p>
        )}
        <h3 className="text-lg font-bold leading-snug text-brand">{title}</h3>
        {place && <p className="mt-1 text-sm text-brand-dark/65">{place}</p>}
        {excerpt && <p className="mt-2 line-clamp-3 text-brand-dark/80">{excerpt}</p>}
        <p className="mt-auto pt-4 text-sm text-brand-dark/65">
          {date && <time dateTime={date}>{formatDate(date)}</time>}
          {date && mins ? ", " : ""}
          {mins ? `${mins} min read` : ""}
        </p>
      </div>
    </article>
  );

  return to ? (
    <Link
      to={to}
      className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}
