import { createContext } from 'react'
import { CartAction, initialState } from '../reducer/cartReducer'
import { CartState } from '../types';

export type CartContextType = {
  state: CartState,
  dispatch: React.Dispatch<CartAction>
}

export const CartContext = createContext<CartContextType>({
  state: initialState,
  dispatch: () => {}
});