import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useCart } from '../context/CartContext.jsx'
import { site } from '../data/content.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About MOBA' },
  { to: '/history', label: 'Our Mwiri' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/projects', label: 'Projects & Impact' },
  { to: '/news', label: 'News & Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/store', label: 'Support MOBA' },
  { to: '/membership', label: 'Membership' },
  { to: '/contact', label: 'Contact' },
]

const loginBtn = 'rounded bg-gold px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-brand-dark hover:brightness-110 whitespace-nowrap'

// Two rows on desktop: brand + motto + Member Login, then the main navigation.
// On smaller screens: brand + Member Login + a menu button.
export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  const desktopLink = ({ isActive }) =>
    `whitespace-nowrap border-b-[3px] py-3 text-sm font-medium transition ${
      isActive ? 'border-gold text-gold' : 'border-transparent text-white hover:text-gold'
    }`
  const mobileLink = ({ isActive }) =>
    `rounded-md px-2.5 py-2.5 text-sm font-medium ${isActive ? 'bg-white/15 text-gold' : 'text-white/85 hover:bg-white/10 hover:text-white'}`

  const cart = (
    <span className="relative">
      🛒
      {count > 0 && <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-brand-dark">{count}</span>}
    </span>
  )

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-gold bg-brand text-white shadow xl:static">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="MOBA, Mwiri Old Boys Association, 1911: home" className="shrink-0">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden border-l-[3px] border-gold pl-3 font-display text-[15px] italic text-[#f5e6c4] lg:block">{site.motto}</p>
          <Link to="/member" className={loginBtn}><span className="sm:hidden">Login</span><span className="hidden sm:inline">Member Login</span></Link>
          <button className="text-2xl xl:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <nav aria-label="Main" className="mx-auto hidden max-w-6xl items-center gap-6 px-4 pt-1 xl:flex">
        {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={desktopLink}>{l.label}</NavLink>)}
        <Link to="/cart" aria-label="Cart" className="ml-auto py-2 hover:opacity-80">{cart}</Link>
      </nav>

      {open && (
        <nav aria-label="Main" className="flex flex-col px-4 pb-3 xl:hidden" onClick={() => setOpen(false)}>
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={mobileLink}>{l.label}</NavLink>)}
          <NavLink to="/cart" className={mobileLink}>Cart{count > 0 && ` (${count})`}</NavLink>
          <p className="mt-3 border-l-[3px] border-gold pl-3 font-display text-[15px] italic text-[#f5e6c4]">{site.motto}</p>
        </nav>
      )}
    </header>
  )
}
