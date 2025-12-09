export type CartItem = {
  id: number,
  name: string,
  price: number,
  qty: number
}

export type CartState = {
  items: CartItem[]
}