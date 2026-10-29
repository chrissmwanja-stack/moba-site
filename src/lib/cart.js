// Pure cart operations shared by the React provider and unit tests.
// A size, when present, is part of the line identity so sizes remain separate throughout checkout.
export function addCartItem(items, product, size) {
  const id = size ? `${product.id}:${size}` : product.id
  const label = product.variant ? `${product.name} (${product.variant})` : product.name
  const found = items.find(i => i.id === id)
  return found
    ? items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
    : [...items, {
        id,
        name: size ? `${label}, size ${size}` : label,
        price: product.price,
        delivery: product.delivery,
        qty: 1,
      }]
}

export const cartCount = items => items.reduce((n, i) => n + i.qty, 0)
export const cartTotal = items => items.reduce((n, i) => n + i.qty * i.price, 0)
