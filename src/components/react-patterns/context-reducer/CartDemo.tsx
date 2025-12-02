import { useCart } from './hooks'

export const CartDemo = () => {
  const { items, addItem, removeItem, increaseQty, decreaseQty, clearCart } = useCart();

  return (
    <div>
      <h2>Shopping Cart</h2>

      <button onClick={() => addItem({ id: Date.now(), name: 'New Item', qty: 1, price: 10 })}>Add Item</button>

      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} - Qty: {item.qty} - Price: ${item.price}
          <button onClick={()=>increaseQty(item.id)}>+</button>
          <button onClick={()=>decreaseQty(item.id)}>-</button>
          <button onClick={()=>removeItem(item.id)}>Remove</button>
          </li>
        ))}
    </ul>
        {items.length > 0 && (
          <button onClick={() => clearCart()}>Clear Cart</button>
        )}
    </div>
  )
}