// Pure cart operations shared by the React provider and unit tests.
// A size, when present, is part of the line identity so sizes remain separate throughout checkout.
// A product marked availability 'coming-soon' cannot be added (the Store disables the button; this is the safety net).
// A product marked 'preorder' is added as its own line, named "Pre-order: ...", so the saved order and the
// order email show it with no other changes. Payment is always on delivery.
export function addCartItem(items, product, size) {
  if (product.availability === 'coming-soon') return items
  const preorder = product.availability === 'preorder'
  const id = (size ? `${product.id}:${size}` : product.id) + (preorder ? ':preorder' : '')
  const base = product.variant ? `${product.name} (${product.variant})` : product.name
  const label = preorder ? `Pre-order: ${base}` : base
  const found = items.find(i => i.id === id)
  return found
    ? items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
    : [...items, {
        id,
        name: size ? `${label}, size ${size}` : label,
        price: product.price,
        delivery: product.delivery,
        qty: 1,
        ...(preorder ? { preorder: true } : {}),
      }]
}

export const cartCount = items => items.reduce((n, i) => n + i.qty, 0)
export const cartTotal = items => items.reduce((n, i) => n + i.qty * i.price, 0)

export const hasPreorder = items => items.some(i => i.preorder)
