import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

const tiles = [
  { to: '/donate', title: 'Donate', text: 'Give to a MOBA project, or let the executive direct your gift to the greatest need.', cta: 'Make a pledge' },
  { to: '/store', title: 'Shop memorabilia', text: 'Ties, blazers, caps and more. Wear the crest and support the association.', cta: 'Visit the store' },
  { to: '/membership', title: 'Join MOBA', text: 'Become an annual or life member and stay connected to the brotherhood.', cta: 'See membership plans' },
]

const steps = [
  { title: 'Choose your items', text: 'Browse the store and add what you like to your cart.' },
  { title: 'Place your order', text: 'Review your cart, then send your name, phone number and delivery address.' },
  { title: 'We confirm delivery', text: 'We call you to arrange delivery. You pay when your order arrives.' },
]

export default function Support() {
  return (
    <>
      <PageHeader title="Support MOBA" subtitle="Three ways to give back to the association and to Mwiri." image="/gallery/dedication-2025.webp" position="50% 30%" />

      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 md:grid-cols-3" aria-label="Ways to support MOBA">
        {tiles.map(t => (
          <Link
            key={t.to}
            to={t.to}
            className="group flex flex-col rounded-lg border-t border-brand/10 bg-white p-6 shadow transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <h2 className="text-xl font-bold text-brand">{t.title}</h2>
            <p className="mt-2 flex-1 text-ink/80">{t.text}</p>
            <span className="mt-5 font-semibold text-brand group-hover:underline">{t.cta} →</span>
          </Link>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16" aria-labelledby="ordering-heading">
        <h2 id="ordering-heading" className="text-2xl font-bold text-brand">How ordering works</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-gold">{i + 1}</span>
              <div>
                <h3 className="font-semibold text-brand">{s.title}</h3>
                <p className="mt-1 text-sm text-ink/80">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/75">
          Questions? <Link to="/contact" className="font-medium text-brand underline">Write to us</Link>.
        </p>
      </section>
    </>
  )
}
