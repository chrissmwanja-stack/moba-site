import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { site } from '../data/content.js'

// Footer columns. Every page on the site is reachable from here.
const columns = [
  { title: 'MOBA', links: [
    { to: '/about', label: 'About MOBA' },
    { to: '/leadership', label: 'Leadership & committees' },
    { to: '/projects', label: 'Projects & Impact' },
    { to: '/contact', label: 'Contact' },
  ] },
  { title: 'Our Mwiri', links: [
    { to: '/history', label: 'Our History' },
    { to: '/gallery', label: 'Photo Gallery' },
    { to: '/news', label: 'News & Events' },
    { to: '/cohorts', label: 'Branches & Cohorts' },
  ] },
  { title: 'Get involved', links: [
    { to: '/membership', label: 'Membership' },
    { to: '/funeral-cover', label: 'Funeral Insurance' },
    { to: '/store', label: 'Donate & shop' },
    { to: '/update-details', label: 'Update your details' },
  ] },
]

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const icons = {
  linkedin: { label: 'LinkedIn', svg: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v6M8 7.5v.01M12 17v-6m0 3c0-2 1.5-3 3-3s2 1 2 3v3" /></svg> },
  facebook: { label: 'Facebook', svg: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke}><path d="M14 8h2V4h-2.5C11 4 10 5.5 10 7.5V10H8v4h2v6h4v-6h2.2l.6-4H14V8.5c0-.3.2-.5.5-.5z" /></svg> },
  instagram: { label: 'Instagram', svg: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></svg> },
  x: { label: 'X', svg: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke}><path d="M5 5l14 14M19 5L5 19" /></svg> },
}

export default function Footer() {
  const socials = Object.entries(site.social || {}).filter(([, url]) => url)
  const linkClass = 'text-white/85 hover:text-gold transition'

  return (
    <footer className="mt-16 border-t-[3px] border-gold bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" aria-label="MOBA, Mwiri Old Boys Association: home" className="inline-block"><Logo /></Link>
          <address className="mt-6 space-y-1 text-sm not-italic text-white/85">
            <p>{site.address}</p>
            <p><a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a></p>
            {site.website && <p><a href={`https://${site.website}`} className="hover:text-gold">{site.website}</a></p>}
            {site.phone && <p>{site.phone}</p>}
          </address>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3" aria-label="Social media">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label={icons[key]?.label || key}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-gold hover:border-gold hover:bg-white/10">
                    {icons[key]?.svg}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          {columns.map(col => (
            <div key={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map(l => <li key={l.to}><Link to={l.to} className={linkClass}>{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName} Ltd
            <span aria-hidden="true"> · </span>
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/member" className="hover:text-gold">Member login</Link>
          </p>
          <p className="font-display text-[15px] italic text-[#f5e6c4]">One Heritage. Many Generations. A Stronger Mwiri.</p>
        </div>
      </div>
    </footer>
  )
}
