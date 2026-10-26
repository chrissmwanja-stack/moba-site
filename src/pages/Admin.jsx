import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { supabase } from '../lib/supabase.js'

export default function Admin() {
  const [state, setState] = useState('Checking administrator access…')
  const navigate = useNavigate()
  useEffect(() => {
    let live = true
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/admin/login', { replace: true }); return }
      const { data, error } = await supabase.rpc('moba_is_admin')
      if (!live) return
      if (error || !data) { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }); return }
      setState(`Signed in as ${session.user.email}`)
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) navigate('/admin/login', { replace: true }) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [navigate])
  async function signOut() { await supabase.auth.signOut(); navigate('/admin/login', { replace: true }) }
  return <>
    <PageHeader title="MOBA Administration" subtitle="Private administration area." />
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow p-6">
        <p>{state}</p>
        <p className="mt-4 text-ink/70">Your admin sign-in is connected. Admin content and management tools can be added here next.</p>
        <div className="flex gap-4 mt-6"><button onClick={signOut} className="bg-brand text-white px-5 py-2 rounded-md">Sign out</button><Link to="/" className="text-brand underline self-center">View website</Link></div>
      </div>
    </section>
  </>
}
