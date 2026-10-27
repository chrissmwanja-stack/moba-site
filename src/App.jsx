import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import History from './pages/History.jsx'
import Projects from './pages/Projects.jsx'
import Gallery from './pages/Gallery.jsx'
import Store from './pages/Store.jsx'
import Cart from './pages/Cart.jsx'
import Membership from './pages/Membership.jsx'
import FuneralCover from './pages/FuneralCover.jsx'
import Contact from './pages/Contact.jsx'
import News from './pages/News.jsx'
import NewsArticle from './pages/NewsArticle.jsx'
import Leadership from './pages/Leadership.jsx'
import UpdateDetails from './pages/UpdateDetails.jsx'
import Privacy from './pages/Privacy.jsx'
import Cohorts from './pages/Cohorts.jsx'
import Support from './pages/Support.jsx'
import Donate from './pages/Donate.jsx'
import Archives from './pages/Archives.jsx'
import Mwirians from './pages/Mwirians.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import MemberLogin from './pages/MemberLogin.jsx'
import Member from './pages/Member.jsx'
import MemberReset from './pages/MemberReset.jsx'
import Admin from './pages/Admin.jsx'
import { site, news } from './data/content.js'
import { newsSlug } from './lib/news.js'

// One title and description per page, so browser tabs, shares and search results are specific.
const meta = {
  '/': { title: `${site.name} | ${site.fullName}` },
  '/about': { title: 'About MOBA', description: `Who we are, what we stand for and who leads the ${site.fullName}.` },
  '/history': { title: 'Our History', description: `The milestones that made ${site.name} what it is today.` },
  '/leadership': { title: 'Leadership', description: 'The executive committee serving MOBA.' },
  '/projects': { title: 'Projects', description: 'What the Mwiri Old Boys Association has built and supported over the years.' },
  '/news': { title: 'News & Events', description: 'Reunions, meetings and news from the MOBA family.' },
  '/gallery': { title: 'Photo Gallery', description: 'Moments from MOBA reunions, projects and events.' },
  '/store': { title: 'Store', description: 'MOBA memorabilia: ties, polos, caps and more. Order online, pay on delivery.' },
  '/cart': { title: 'Your Cart' },
  '/membership': { title: 'Membership', description: 'Join the Mwiri Old Boys Association as an annual or life member.' },
  '/funeral-cover': { title: 'MOBA Funeral Insurance', description: 'Enrol for the MOBA Funeral Insurance scheme for yourself and your family.' },
  '/contact': { title: 'Contact Us', description: 'Write to the Mwiri Old Boys Association.' },
  '/cohorts': { title: 'Branches & Cohorts', description: 'Find your MOBA branch or your year group.' },
  '/support': { title: 'Support MOBA', description: 'Donate, shop for memorabilia or join the association.' },
  '/donate': { title: 'Donate', description: 'Give to MOBA projects and help build the Mwiri we want.' },
  '/archives': { title: 'Archives', description: 'MOBA reports, minutes, newsletters and records from across the years.' },
  '/prominent-mwirians': { title: 'Prominent Mwirians', description: 'Old Boys whose service and achievements have made Mwiri proud.' },
  '/update-details': { title: 'Update Your Details', description: 'Keep your contact details current on the MOBA register.' },
  '/privacy': { title: 'Privacy' },
  '/member': { title: 'Your Membership' },
  '/member/login': { title: 'Member Login', description: 'Sign in or create your MOBA member account.' },
  '/member/reset': { title: 'Reset Password' },
}
const defaultDescription = 'The home of the Mwiri Old Boys Association: our history, our projects and our community since 1911.'

// Fixed pages use the table above; each news article uses its own title and excerpt.
function metaFor(pathname) {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path.startsWith('/news/')) {
    const item = news.find(n => newsSlug(n) === path.slice('/news/'.length))
    return item && { title: item.title, description: item.excerpt?.slice(0, 160) }
  }
  return meta[path]
}

function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = metaFor(pathname)
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/reset" element={<MemberReset />} />
          <Route path="/member" element={<Member />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/funeral-cover" element={<FuneralCover />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/update-details" element={<UpdateDetails />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cohorts" element={<Cohorts />} />
          <Route path="/support" element={<Support />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/prominent-mwirians" element={<Mwirians />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
