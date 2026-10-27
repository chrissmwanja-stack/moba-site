import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useCart } from '../context/CartContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About MOBA' },
  { to: '/history', label: 'Our Mwiri' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/projects', label: 'Projects' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/store', label: 'Support MOBA' },
  { to: '/membership', label: 'Membership' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const linkClass = ({ isActive }) =>
    `px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${
      isActive ? 'bg-white/15 text-gold' : 'text-white/80 hover:text-white hover:bg-white/10'
    }`

  return (
    <header className="bg-brand-dark sticky top-0 z-40 shadow border-b-2 border-gold">
      <div className="max-w-6xl mx-auto px-4 py-2 min-h-16 flex items-center justify-between">
        <Link to="/" aria-label="MOBA, Mwiri Old Boys Association, 1911: home" className="shrink-0 mr-4">
          <Logo />
        </Link>
        <nav className="hidden xl:flex items-center gap-0.5">
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>)}
          <Link to="/member" className="ml-2 rounded-md border border-gold/70 px-3 py-1.5 text-sm font-semibold text-gold hover:bg-gold hover:text-brand-dark">Login</Link>
          <Link to="/cart" className="ml-1 relative text-white px-3 py-2 rounded-md hover:bg-white/10" aria-label="Cart">
            🛒{count > 0 && <span className="absolute -top-1 -right-1 bg-gold text-brand-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </Link>
        </nav>
        <button className="xl:hidden text-white text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <nav className="xl:hidden px-4 pb-3 flex flex-col" onClick={() => setOpen(false)}>
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>)}
          <NavLink to="/member" className={linkClass}>Member login</NavLink>
          <NavLink to="/cart" className={linkClass}>Cart{count > 0 && ` (${count})`}</NavLink>
        </nav>
      )}
    </header>
  )
}
