import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { loadContent } from './lib/siteContent.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

loadContent() // published content from Supabase; the built-in content shows until it arrives

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)
