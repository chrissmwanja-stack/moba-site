import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useContent } from '../lib/siteContent.js'
import { supabase } from '../lib/supabase.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About MOBA' },
  { to: '/history', label: 'Our Mwiri', also: ['/prominent-mwirians', '/archives'] },
  { to: '/projects', label: 'Projects & Impact' },
  { to: '/news', label: 'News & Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/support', label: 'Support MOBA' },
  { to: '/membership', label: 'Membership' },
  { to: '/contact', label: 'Contact' },
]

const loginBtn = 'rounded bg-gold px-3.5 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-brand-dark hover:brightness-110 whitespace-nowrap'

// Every main tab is always visible: a compact grid on narrow screens and one row from lg upwards.
// The header is not sticky on phones, so the tab grid does not consume screen space after scrolling.
export default function Header() {
  const { site } = useContent()
  const [signedIn, setSignedIn] = useState(false)
  const { pathname } = useLocation()
  const within = l => (l.also || []).some(p => pathname === p || pathname.startsWith(p + '/'))

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

  const mainLink = l => ({ isActive }) => {
    const active = isActive || within(l)
    return `flex min-h-10 items-center justify-center rounded px-1.5 py-1.5 text-center text-xs font-semibold leading-tight transition sm:px-2 sm:text-sm lg:min-h-0 lg:whitespace-nowrap lg:rounded-none lg:border-b-[3px] lg:px-0 lg:py-3 lg:font-medium ${
      active
        ? 'bg-white/15 text-gold lg:border-gold lg:bg-transparent'
        : 'text-white/85 hover:bg-white/10 hover:text-gold lg:border-transparent lg:hover:bg-transparent'
    }`
  }

  return (
    <header className="border-b-[3px] border-gold bg-brand text-white shadow lg:sticky lg:top-0 lg:z-40 xl:static">
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

      <nav aria-label="Main" className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-3 pb-2 pt-1 sm:grid-cols-5 lg:flex lg:items-center lg:gap-5 lg:px-4 lg:pb-0 xl:gap-6">
        {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={mainLink(l)}>{l.label}</NavLink>)}
      </nav>
    </header>
  )
}
