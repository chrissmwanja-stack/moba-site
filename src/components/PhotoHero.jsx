import { Link } from 'react-router-dom'
import { backgroundKeyForImage } from '../lib/backgrounds.js'
import { useBackground } from '../lib/useBackground.js'

// Page hero with an editable campus photo on the right that fades into navy behind the text.
export default function PhotoHero({
  title,
  subtitle,
  crumb,
  eyebrow = 'Mwiri Old Boys Association',
  backgroundKey,
  image,
  imageSmall,
  position = '50% 50%',
}) {
  const key = backgroundKey || backgroundKeyForImage(image)
  const background = useBackground(key)
  const src = key ? background.image : image
  const small = key ? background.imageSmall : imageSmall

  return (
    <section className="relative isolate overflow-hidden bg-brand text-white">
      <img
        src={src}
        srcSet={small ? `${small} 640w, ${src} 1400w` : undefined}
        sizes="(min-width: 768px) 62vw, 100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute right-0 top-0 -z-20 h-full w-full object-cover md:w-[62%]"
        style={{ objectPosition: position }}
      />
      {/* Phones: an even navy wash. Larger screens: solid navy behind the text, fading to the photo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand/85 md:hidden" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden md:block"
        style={{ backgroundImage: 'linear-gradient(90deg, #0a2a5e 0%, #0a2a5e 42%, rgba(10,42,94,0.72) 60%, rgba(10,42,94,0.1) 100%)' }}
      />
      {/* Gold corner stripes */}
      <div
        aria-hidden="true"
        className="absolute -bottom-14 -right-10 -z-10 hidden h-65 w-65 md:block"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 26px, var(--color-gold) 26px 38px, transparent 38px 56px)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        {crumb && (
          <nav aria-label="Breadcrumb" className="text-sm text-white/85">
            <Link to="/" className="underline underline-offset-2 hover:text-gold">Home</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{crumb}</span>
          </nav>
        )}
        {eyebrow && <p className={`text-xs font-bold uppercase tracking-[0.28em] text-gold ${crumb ? 'mt-5' : ''}`}>{eyebrow}</p>}
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.08] md:text-6xl">{title}</h1>
        <div className="mt-6 h-0.75 w-16 bg-gold" aria-hidden="true" />
        {subtitle && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">{subtitle}</p>}
      </div>
    </section>
  )
}
