import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import MemberCard from '../components/MemberCard.jsx'
import { supabase } from '../lib/supabase.js'
import { fetchMyMember, isSubscribed, longDate } from '../lib/members.js'
import { useContent } from '../lib/siteContent.js'
import { useCart } from '../context/CartContext.jsx'
import { ugx } from '../lib/format.js'

export default function Member() {
  const { site } = useContent()
  const navigate = useNavigate()
  const { count, total } = useCart()
  const [state, setState] = useState('loading') // loading | ready | error
  const [user, setUser] = useState(null)
  const [member, setMember] = useState(null)

  useEffect(() => {
    if (!supabase) { navigate('/member/login', { replace: true }); return }
    let live = true
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/member/login', { replace: true }); return }
      const { member: row, error } = await fetchMyMember(session.user.id)
      if (!live) return
      setUser(session.user); setMember(row); setState(error ? 'error' : 'ready')
    }
    load()
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate('/member/login', { replace: true }) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [navigate])

  async function signOut() { await supabase.auth.signOut(); navigate('/member/login', { replace: true }) }

  if (state === 'loading') return <><PageHeader variant="functional" title="My MOBA dashboard" /><p className="max-w-5xl mx-auto px-4 py-12">Loading your member details…</p></>

  const active = member?.status === 'active'
  const mail = `mailto:${site.email}`

  return (
    <>
      <PageHeader variant="functional" title="My MOBA dashboard" subtitle={member ? `Welcome back, ${member.name}. Manage your member details and services here.` : user?.email} />
      <section className="max-w-5xl mx-auto px-4 py-10">
        {state === 'error' && <p role="alert" className="rounded-md bg-red-50 text-red-800 p-4">We could not load your membership. Please refresh, or <a className="underline" href={mail}>contact us</a>.</p>}

        {state === 'ready' && !member && (
          <p className="rounded-md bg-gold/20 border border-gold p-4">We could not find a membership record for {user.email}. Please <a className="underline" href={mail}>contact the secretary</a> so we can fix this.</p>
        )}

        {state === 'ready' && member && (
          <section aria-label="Your member details" className="mb-8 rounded-lg border border-brand/10 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-brand">My member profile</h2>
                <p className="mt-1 text-sm text-ink/70">Your details on the MOBA member register.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-800' : member.status === 'pending' ? 'bg-gold/25 text-brand-dark' : 'bg-red-100 text-red-800'}`}>{member.status === 'pending' ? 'Awaiting verification' : member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}</span>
                <Link to="/update-details" className="rounded-md border border-brand/40 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">Request a correction</Link>
              </div>
            </div>
            <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ['Full name', member.name],
                ['Email', member.email || user?.email],
                ['Phone', member.phone],
                ['Cohort', member.cohort],
                ['House', member.house ? `${member.house} House` : null],
                ['MOBA number', member.moba_number],
                ['Status', member.status === 'pending' ? 'Awaiting verification' : member.status?.charAt(0).toUpperCase() + member.status?.slice(1)],
                ['Subscription paid until', member.paid_until ? longDate(member.paid_until) : null],
              ].filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</dt>
                  <dd className="mt-1 wrap-break-word text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {member?.status === 'pending' && (
          <div className="rounded-lg bg-white shadow border-l-4 border-gold p-6">
            <h2 className="font-semibold text-lg text-brand">Awaiting verification</h2>
            <p className="mt-2 text-ink/80">Thank you for registering. The secretary checks each new member against the register. Once approved, your permanent MOBA number and digital card appear here. This normally takes a few days.</p>
            <p className="mt-3 text-sm text-ink/70">Registered as cohort {member.cohort ?? '?'}{member.house ? `, ${member.house} House` : ''}. Something wrong? <Link to="/update-details" className="underline text-brand">Send us the correct details</Link>.</p>
          </div>
        )}

        {(member?.status === 'suspended' || member?.status === 'rejected') && (
          <p className="rounded-md bg-white shadow border-l-4 border-red-400 p-6">Your membership is not active at the moment. Please <a className="underline text-brand" href={mail}>contact the secretary</a> for help.</p>
        )}

        {active && (
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-start">
            <MemberCard member={member} />
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-brand">Subscription</h2>
                {isSubscribed(member)
                  ? <p className="text-ink/80">Paid up to {longDate(member.paid_until)}. Thank you for keeping MOBA running.</p>
                  : <p className="text-ink/80">No active subscription. <Link to="/membership" className="underline text-brand font-medium">See membership plans</Link> to become a Subscribed Member.</p>}
              </div>
              <p className="text-xs text-ink/60">Your MOBA number is permanent. If your cohort or house is wrong, use the correction link in your profile.</p>
            </div>
          </div>
        )}

        {state === 'ready' && member && (
          <section aria-label="Member services" className="mt-8">
            <h2 className="text-xl font-semibold text-brand">Member services</h2>
            <p className="mt-1 text-sm text-ink/70">Quick access to membership, benefits and MOBA activities.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['/membership', 'Membership plans', 'Review annual and life membership options.'],
                ['/funeral-cover', 'Funeral insurance', 'View cover information and enrolment.'],
                ['/store', 'MOBA store', 'Browse merchandise and your cart.'],
                ['/donate', 'Support Mwiri', 'Contribute to a project or school priority.'],
              ].map(([to, title, description]) => (
                <Link key={to} to={to} className="group rounded-lg border border-brand/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <span className="font-semibold text-brand group-hover:text-brand-dark">{title} <span aria-hidden="true">→</span></span>
                  <span className="mt-2 block text-sm text-ink/70">{description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {state === 'ready' && member && (
          <div className="mt-8 rounded-lg bg-white shadow border-l-4 border-gold p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-brand">Your cart</h2>
              <p className="text-sm text-ink/80">
                {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}, ${ugx(total)}` : 'Your cart is empty.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/store" className="rounded-md border border-brand/40 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">Browse the store</Link>
              {count > 0 && <Link to="/cart" className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-brand-dark hover:brightness-110">View cart &amp; checkout</Link>}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-ink/10 flex items-center gap-4 text-sm">
          <span className="text-ink/60">Signed in as {user?.email}</span>
          <button onClick={signOut} className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Sign out</button>
        </div>
      </section>
    </>
  )
}
