import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useContent } from '../lib/siteContent.js'
import { supabase } from '../lib/supabase.js'

const links = [
  { to: '/', label: 'Home', priority: true },
  { to: '/about', label: 'About MOBA' },
  { to: '/history', label: 'Our Mwiri', priority: true, also: ['/prominent-mwirians', '/archives'] },
  { to: '/projects', label: 'Projects & Impact' },
  { to: '/news', label: 'News & Events', shortLabel: 'News', priority: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/support', label: 'Support MOBA' },
  { to: '/membership', label: 'Membership', priority: true },
  { to: '/contact', label: 'Contact' },
]

const priorityLinks = links.filter(l => l.priority)
const moreLinks = links.filter(l => !l.priority)
const loginBtn = 'rounded bg-gold px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-brand-dark hover:brightness-110 whitespace-nowrap'

// Small screens keep four priority tabs visible and put the other five under More.
// From lg upwards all nine tabs remain visible in one row.
export default function Header() {
  const { site } = useContent()
  const [open, setOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const moreButtonRef = useRef(null)
  const { pathname } = useLocation()
  const within = l => (l.also || []).some(p => pathname === p || pathname.startsWith(p + '/'))
  const matches = l => pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to + '/')) || within(l)
  const moreActive = moreLinks.some(matches)

  useEffect(() => {
    if (!supabase) return undefined
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.session))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session))
    })
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        moreButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const desktopLink = l => ({ isActive }) =>
    `whitespace-nowrap border-b-[3px] py-3 text-sm font-medium transition ${
      isActive || within(l) ? 'border-gold text-gold' : 'border-transparent text-white hover:text-gold'
    }`
  const mobileTab = active =>
    `flex min-h-11 items-center justify-center rounded px-1 py-2 text-center text-[11px] font-semibold leading-tight transition sm:text-sm ${
      active ? 'bg-white/15 text-gold' : 'text-white/85 hover:bg-white/10 hover:text-gold'
    }`
  const mobileLink = l => ({ isActive }) => mobileTab(isActive || within(l))
  const moreLink = l => ({ isActive }) =>
    `flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${
      isActive || within(l) ? 'bg-white/15 text-gold' : 'text-white/85 hover:bg-white/10 hover:text-gold'
    }`

  return (
    <header className="relative z-40 border-b-[3px] border-gold bg-brand text-white shadow lg:sticky lg:top-0 xl:static">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="MOBA, Mwiri Old Boys Association, 1911: home" className="shrink-0">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden border-l-[3px] border-gold pl-3 font-display text-[15px] italic text-[#f5e6c4] lg:block">{site.motto}</p>
          <Link to={signedIn ? '/member' : '/member/login'} className={loginBtn} aria-label={signedIn ? 'Return to My MOBA member dashboard' : 'Member login'}>
            <span className="sm:hidden">{signedIn ? 'My MOBA' : 'Login'}</span>
            <span className="hidden sm:inline">{signedIn ? 'My MOBA' : 'Member Login'}</span>
          </Link>
        </div>
      </div>

      <nav aria-label="Main" className="mx-auto grid max-w-6xl grid-cols-5 gap-1 px-3 pb-2 pt-1 lg:hidden">
        {priorityLinks.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={mobileLink(l)}>{l.shortLabel || l.label}</NavLink>
        ))}
        <button
          ref={moreButtonRef}
          type="button"
          className={mobileTab(open || moreActive)}
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-controls="more-navigation"
        >
          More <span aria-hidden="true" className={`ml-1 inline-block transition ${open ? 'rotate-180' : ''}`}>⌄</span>
        </button>
      </nav>

      <nav aria-label="Main" className="mx-auto hidden max-w-6xl items-center gap-5 px-4 pt-1 lg:flex xl:gap-6">
        {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={desktopLink(l)}>{l.label}</NavLink>)}
      </nav>

      <nav
        id="more-navigation"
        aria-label="More navigation"
        className={`${open ? 'grid' : 'hidden'} absolute inset-x-0 top-full z-50 max-h-[70vh] grid-cols-2 gap-1 overflow-y-auto border-b-[3px] border-gold bg-brand px-3 py-3 shadow-xl lg:hidden`}
      >
        {moreLinks.map(l => <NavLink key={l.to} to={l.to} className={moreLink(l)}>{l.label}</NavLink>)}
      </nav>
    </header>
  )
}
