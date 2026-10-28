import { NavLink } from 'react-router-dom'

// Sub-navigation shared by the pages that sit under "Our Mwiri".
const items = [
  { to: '/history', label: 'Our History' },
  { to: '/prominent-mwirians', label: 'Prominent Mwirians' },
  { to: '/archives', label: 'Archives' },
]

export default function OurMwiriNav() {
  return (
    <nav aria-label="Our Mwiri" className="border-b border-brand/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4">
        <span className="py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Our Mwiri</span>
        {items.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `border-b-[3px] py-3 text-sm font-semibold transition ${isActive ? 'border-gold text-brand' : 'border-transparent text-brand/65 hover:text-brand'}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
