// Page header with a photo behind it. Every page gets the campus photo by default;
// pass `image` (and optionally `imageSmall` / `position`) to give a page its own.
// <PageHeader title="..." subtitle="..." image="/gallery/gate-2025.webp" position="50% 40%" />
const DEFAULT_IMAGE = '/moba-campus.webp'
const DEFAULT_IMAGE_SMALL = '/moba-campus-640.webp'

function HeaderPhoto({ image, imageSmall, position, strong }) {
  return (
    <>
      <img
        src={image}
        srcSet={imageSmall ? `${imageSmall} 640w, ${image} 1400w` : undefined}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      {/* Navy wash keeps the text readable and ties every photo to the brand colours */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: strong
            ? 'linear-gradient(90deg, rgba(6,31,71,0.96) 0%, rgba(6,31,71,0.9) 100%)'
            : 'linear-gradient(90deg, rgba(6,31,71,0.93) 0%, rgba(6,31,71,0.8) 48%, rgba(10,42,94,0.5) 100%)',
        }}
      />
    </>
  )
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow = 'Mwiri Old Boys Association',
  variant = 'editorial',
  image,
  imageSmall,
  position = '50% 50%',
}) {
  // Pages that pick their own photo use it; the rest fall back to the campus photo.
  const src = image || DEFAULT_IMAGE
  const small = image ? imageSmall : DEFAULT_IMAGE_SMALL

  if (variant === 'functional') {
    return (
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <HeaderPhoto image={src} imageSmall={small} position={position} strong />
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
        </div>
      </section>
    )
  }
  return (
    <section className="relative isolate overflow-hidden border-b-4 border-gold bg-brand-dark text-white">
      <HeaderPhoto image={src} imageSmall={small} position={position} />
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
        <div className="mt-5 h-0.75 w-16 bg-gold" aria-hidden="true" />
        {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
