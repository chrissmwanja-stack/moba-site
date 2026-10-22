import { Link } from 'react-router-dom'
import { site } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70 mt-16 border-t-2 border-gold">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 items-start">
        <div className="flex items-center gap-4">
          <img src="/moba-shield.png" alt="" className="h-16 w-auto" />
          <div>
            <p className="text-gold font-semibold text-lg">{site.fullName}</p>
            <p className="text-sm">Est. {site.founded}</p>
          </div>
        </div>
        <nav className="text-sm grid grid-cols-2 gap-2">
          <Link to="/history" className="hover:text-gold">Our History</Link>
          <Link to="/leadership" className="hover:text-gold">Leadership</Link>
          <Link to="/projects" className="hover:text-gold">Projects</Link>
          <Link to="/news" className="hover:text-gold">News & Events</Link>
          <Link to="/store" className="hover:text-gold">Store</Link>
          <Link to="/membership" className="hover:text-gold">Membership</Link>
          <Link to="/contact" className="hover:text-gold">Contact</Link>
        </nav>
        <div className="text-sm md:text-right">
          <p>{site.email}</p>
          <p>{site.phone}</p>
        </div>
      </div>
      <p className="text-center text-xs py-4 border-t border-white/10">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  )
}
