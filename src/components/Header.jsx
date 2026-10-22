import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { site } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/history', label: 'Our History' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/projects', label: 'Projects' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/store', label: 'Store' },
  { to: '/membership', label: 'Membership' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const linkClass = ({ isActive }) =>
    `px-2.5 py-2 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-white/15 text-gold' : 'text-white/80 hover:text-white hover:bg-white/10'
    }`

  return (
    <header className="bg-brand-dark sticky top-0 z-40 shadow border-b-2 border-gold">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/moba-shield.png" alt="MOBA shield" className="h-11 w-auto" />
          <span className="text-gold font-bold text-xl tracking-widest">{site.name}</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>)}
          <Link to="/cart" className="ml-2 relative text-white px-3 py-2 rounded-md hover:bg-white/10" aria-label="Cart">
            🛒{count > 0 && <span className="absolute -top-1 -right-1 bg-gold text-brand-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </Link>
        </nav>
        <button className="lg:hidden text-white text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden px-4 pb-3 flex flex-col" onClick={() => setOpen(false)}>
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>)}
          <NavLink to="/cart" className={linkClass}>Cart{count > 0 && ` (${count})`}</NavLink>
        </nav>
      )}
    </header>
  )
}
