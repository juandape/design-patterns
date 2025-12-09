import { CartDemo } from './CartDemo';
import { CartProvider } from './provider/cartProvider';

export default function App() {
  return (
    <CartProvider>
      <CartDemo />
    </CartProvider>
  );
}
