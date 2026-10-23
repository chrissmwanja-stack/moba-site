import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto px-4 py-24 text-center">
      <img src="/moba-shield.webp" alt="" className="h-28 mx-auto opacity-90" />
      <h1 className="text-3xl font-bold text-brand mt-6">Page not found</h1>
      <p className="mt-2 text-ink/70">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="inline-block mt-6 bg-gold text-brand-dark font-semibold px-6 py-3 rounded-md hover:brightness-110">Back to home</Link>
    </section>
  )
}
