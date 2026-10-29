import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const CartContext = createContext(null)
const LEGACY_KEY = 'moba-cart'
const cartKey = userId => userId ? `moba-cart:v2:user:${userId}` : 'moba-cart:v2:guest'

function load(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [owner, setOwner] = useState({ ready: false, id: null, key: null })
  const [cart, setCart] = useState({ key: null, items: [] })

  useEffect(() => {
    let mounted = true
    let authEventReceived = false

    // The previous global key had no owner, so it cannot be safely assigned to an account.
    // Discard it once rather than risk showing one person's items to the next signed-in user.
    try { localStorage.removeItem(LEGACY_KEY) } catch { /* storage unavailable */ }

    const adoptSession = session => {
      if (!mounted) return
      const id = session?.user?.id || null
      const key = cartKey(id)
      setOwner({ ready: true, id, key })
      setCart({ key, items: load(key) })
    }

    if (!supabase) {
      adoptSession(null)
      return () => { mounted = false }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true
      adoptSession(session)
    })
    supabase.auth.getSession().then(({ data, error }) => {
      if (!authEventReceived) adoptSession(error ? null : data.session)
    }).catch(() => {
      if (!authEventReceived) adoptSession(null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const ready = owner.ready && cart.key === owner.key
  const items = ready ? cart.items : []

  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(owner.key, JSON.stringify(cart.items)) } catch { /* ignore */ }
  }, [ready, owner.key, cart])

  // size (optional) makes a separate cart line per size: the line id and name carry it, so the order
  // email, the saved order and the admin orders table all show the size with no other changes.
  const add = (product, size) => setCart(current => {
    if (!ready || current.key !== owner.key) return current
    const id = size ? `${product.id}:${size}` : product.id
    const label = product.variant ? `${product.name} (${product.variant})` : product.name
    const found = current.items.find(i => i.id === id)
    const items = found
      ? current.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
      : [...current.items, { id, name: size ? `${label}, size ${size}` : label, price: product.price, delivery: product.delivery, qty: 1 }]
    return { ...current, items }
  })

  const setQty = (id, qty) => setCart(current => {
    if (!ready || current.key !== owner.key) return current
    return { ...current, items: current.items.map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0) }
  })
  const remove = id => setCart(current => {
    if (!ready || current.key !== owner.key) return current
    return { ...current, items: current.items.filter(i => i.id !== id) }
  })
  const clear = () => setCart(current => {
    if (!ready || current.key !== owner.key) return current
    return { ...current, items: [] }
  })

  const count = items.reduce((n, i) => n + i.qty, 0)
  const total = items.reduce((n, i) => n + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
