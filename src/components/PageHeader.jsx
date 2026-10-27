export default function PageHeader({ title, subtitle, eyebrow = 'Mwiri Old Boys Association', variant = 'editorial' }) {
  if (variant === 'functional') {
    return (
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
        </div>
      </section>
    )
  }
  return (
    <section className="border-b border-brand/10 bg-[#f4f5f7]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand/65">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-brand md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand/70 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
