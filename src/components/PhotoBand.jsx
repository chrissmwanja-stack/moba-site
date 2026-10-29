import { useBackground } from '../lib/useBackground.js'

// A navy band with an editable campus photo behind it.
export default function PhotoBand({ children, className = '', position = '50% 65%' }) {
  const background = useBackground('history')
  return (
    <section className={`relative isolate overflow-hidden bg-brand-dark text-white ${className}`}>
      <img
        src={background.image}
        srcSet={background.imageSmall ? `${background.imageSmall} 640w, ${background.image} 1080w` : undefined}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      {/* Navy wash keeps white text readable and ties the photo to the brand colours */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(6,31,71,0.94) 0%, rgba(6,31,71,0.82) 45%, rgba(10,42,94,0.55) 100%)',
        }}
      />
      <div className="relative">{children}</div>
    </section>
  )
}
