import { Component } from 'react'

// Catches a rendering error anywhere below it so visitors see a message instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error('MOBA site error:', error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-brand">Something went wrong</h1>
        <p className="mt-3 text-ink/70">Sorry, this page failed to load. Please refresh, or go back to the home page.</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-brand-dark">Back to home</a>
      </main>
    )
  }
}
