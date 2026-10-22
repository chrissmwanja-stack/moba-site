export default function PageHeader({ title, subtitle }) {
  return (
    <section className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-white/80 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  )
}
