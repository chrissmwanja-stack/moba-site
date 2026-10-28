import { useRef, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import { Link } from 'react-router-dom'
import MemberCard from '../components/MemberCard.jsx'
import { benefits } from '../data/content.js'
import { useContent } from '../lib/siteContent.js'
import { ugx } from '../lib/format.js'
import { lifeMembers } from '../data/lifeMembers.js'

export default function Membership() {
  const { tiers } = useContent()
  const [selected, setSelected] = useState('')
  const checkoutRef = useRef(null)
  const activeTier = tiers.find(t => t.id === selected) || tiers[0]
  const selectedId = activeTier?.id
  const tier = activeTier
  const lifeTier = tiers.find(t => t.id === 'life') || tiers.find(t => /life/i.test(t.name || ''))
  const lifeMemberColumns = [
    { start: 1, names: lifeMembers.slice(0, 16) },
    { start: 17, names: lifeMembers.slice(16, 31) },
    { start: 32, names: lifeMembers.slice(31, 47) },
    { start: 48, names: lifeMembers.slice(47) },
  ]

  function chooseLifeMembership() {
    if (!lifeTier) return
    setSelected(lifeTier.id)
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHeader
        title="Membership"
        subtitle="Stay connected and support the association. Choose a plan, pay directly to MOBA, and submit your transaction reference for verification."
      />

      {/* Centred, equal-height cards; the column count follows the number of plans */}
      {tiers.length > 0 && <section
        aria-label="Membership plans"
        className={`max-w-3xl mx-auto px-4 mt-12 grid gap-6 items-stretch ${tiers.length > 1 ? 'sm:grid-cols-2' : ''}`}
      >
        {tiers.map(t => {
          const on = selectedId === t.id
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(t.id)}
              className={`flex h-full flex-col text-left bg-white rounded-md shadow-sm p-6 border border-brand/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                on ? 'border-gold' : 'border-transparent hover:border-gold/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold text-brand">{t.name}</h3>
                {on && <span className="shrink-0 rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold text-brand-dark">Selected</span>}
              </div>
              <p className="mt-2 text-3xl font-bold">{ugx(t.price)}</p>
              <p className="text-sm text-ink/70">{t.period === 'one-off' ? 'one-off payment' : `per ${t.period}`}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80">
                {t.perks.map(p => <li key={p}>✓ {p}</li>)}
              </ul>
            </button>
          )
        })}
      </section>}

      {lifeMembers.length > 0 && (
        <section className="mx-auto mt-14 max-w-6xl px-4" aria-labelledby="life-members-heading">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">Life membership</p>
              <h2 id="life-members-heading" className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-brand sm:text-4xl">
                Distinguished Lifetime Members Club
              </h2>
              <span className="mt-4 block h-1 w-14 bg-gold" aria-hidden="true" />
              <p className="mt-4 max-w-3xl leading-7 text-ink/75">
                These Mwirians have made a lifelong commitment to the brotherhood. Thank you for leading the way.
              </p>
            </div>
            {lifeTier && (
              <aside className="border-l-4 border-gold bg-gold/20 p-6">
                <h3 className="font-display text-xl font-semibold text-brand">Add your name</h3>
                <p className="mt-2 text-sm text-brand">Life membership: {ugx(lifeTier.price)}</p>
                <button
                  type="button"
                  onClick={chooseLifeMembership}
                  className="mt-4 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Become a life member
                </button>
              </aside>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
            {lifeMemberColumns.map(column => (
              <ol key={column.start} className="list-none">
                {column.names.map((name, index) => (
                  <li key={`${column.start + index}-${name}`} className="flex min-h-10 items-center gap-4 border-b border-ink/10 py-2 text-sm font-medium text-brand">
                    <span className="w-5 shrink-0 font-bold text-gold-dark" aria-hidden="true">{column.start + index}</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Your member card" className="max-w-3xl mx-auto px-4 mt-14 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand">One identity. A lifelong connection.</h2>
          <p className="mt-3 text-ink/80 leading-relaxed">Create a member account and, once the secretary has verified you, you get a permanent MOBA number built from your cohort year and first house. You belong to your class, whenever you joined Mwiri.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/member/login" className="bg-gold text-brand-dark font-semibold px-5 py-2.5 rounded-md hover:brightness-110">Create your account</Link>
            <Link to="/member/login" className="border border-brand/40 text-brand font-semibold px-5 py-2.5 rounded-md hover:bg-brand/5">Member login</Link>
          </div>
        </div>
        <div className="flex justify-center"><MemberCard sample /></div>
      </section>

      {benefits.length > 0 && (
        <section aria-label="Member benefits" className="max-w-3xl mx-auto px-4 mt-14">
          <h2 className="text-2xl font-bold text-brand">Member benefits</h2>
          <div className="mt-4 grid gap-6">
            {benefits.map(b => (
              <div key={b.id} className="bg-white rounded-md shadow-sm p-6 border-l-2 border-gold">
                <h3 className="font-display text-2xl font-semibold text-brand">{b.title}</h3>
                <p className="mt-2 text-ink/80">{b.text}</p>
                <Link
                  to={b.to}
                  className="mt-4 inline-block rounded-md bg-gold px-5 py-2.5 font-bold text-brand-dark hover:bg-[#f0c653] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {b.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {tier && <section ref={checkoutRef} id="membership-checkout" className="max-w-3xl mx-auto px-4 mt-10 mb-4 scroll-mt-8">
        <p className="mb-3 font-medium">Joining as: <span className="text-brand">{tier.name}</span></p>
        <CheckoutForm
          key={tier.id}
          kind="subscription"
          items={[{ id: tier.id, name: tier.name, price: tier.price, qty: 1 }]}
          total={tier.price}
        />
        <p className="mt-4 text-sm text-ink/70">
          Already a member? <Link to="/update-details" className="font-semibold text-brand underline">Update your details</Link> so we can keep the register current.
        </p>
      </section>}
    </>
  )
}
