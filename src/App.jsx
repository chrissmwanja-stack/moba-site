import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import History from './pages/History.jsx'
import Projects from './pages/Projects.jsx'
import Gallery from './pages/Gallery.jsx'
import Store from './pages/Store.jsx'
import Cart from './pages/Cart.jsx'
import Membership from './pages/Membership.jsx'
import Contact from './pages/Contact.jsx'
import News from './pages/News.jsx'
import Leadership from './pages/Leadership.jsx'
import UpdateDetails from './pages/UpdateDetails.jsx'
import Privacy from './pages/Privacy.jsx'
import Cohorts from './pages/Cohorts.jsx'
import NotFound from './pages/NotFound.jsx'
import { site } from './data/content.js'

// One title and description per page, so browser tabs, shares and search results are specific.
const meta = {
  '/': { title: `${site.name} | ${site.fullName}` },
  '/history': { title: 'Our History', description: `The milestones that made ${site.name} what it is today.` },
  '/leadership': { title: 'Leadership', description: 'The executive committee serving MOBA.' },
  '/projects': { title: 'Projects', description: 'What the Mwiri Old Boys Association has built and supported over the years.' },
  '/news': { title: 'News & Events', description: 'Reunions, meetings and news from the MOBA family.' },
  '/gallery': { title: 'Photo Gallery', description: 'Moments from MOBA reunions, projects and events.' },
  '/store': { title: 'Store', description: 'MOBA memorabilia: ties, polos, caps and more. Order online, pay on delivery.' },
  '/cart': { title: 'Your Cart' },
  '/membership': { title: 'Membership', description: 'Join the Mwiri Old Boys Association as an annual or life member.' },
  '/contact': { title: 'Contact Us', description: 'Write to the Mwiri Old Boys Association.' },
  '/cohorts': { title: 'Branches & Cohorts', description: 'Find your MOBA branch or your year group.' },
  '/update-details': { title: 'Update Your Details', description: 'Keep your contact details current on the MOBA register.' },
  '/privacy': { title: 'Privacy' },
}
const defaultDescription = 'The home of the Mwiri Old Boys Association: our history, our projects and our community since 1911.'

function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = meta[pathname.replace(/\/$/, '') || '/']
    document.title = !m ? `Page not found | ${site.name}` : pathname === '/' ? m.title : `${m.title} | ${site.name}`
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', m?.description || defaultDescription)
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <PageMeta />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/update-details" element={<UpdateDetails />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cohorts" element={<Cohorts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
