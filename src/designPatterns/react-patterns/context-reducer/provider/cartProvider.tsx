import { useReducer, useMemo, ReactNode } from 'react';
import { CartContext } from '../context/cartContext';
import { cartReducer, initialState } from '../reducer/cartReducer';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
