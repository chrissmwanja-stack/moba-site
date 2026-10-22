import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'moba-cart'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])

  const add = product =>
    setItems(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) return prev.map(i => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { id: product.id, name: product.name, price: product.price, delivery: product.delivery, qty: 1 }]
    })

  const setQty = (id, qty) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty } : i)).filter(i => i.qty > 0))

  const remove = id => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const total = items.reduce((n, i) => n + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
