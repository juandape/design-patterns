import { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { CartItem } from '../types';

export const useCart = () => {
  const { state, dispatch } = useContext(CartContext);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const increaseQty = (id: number) => {
    dispatch({ type: 'INCREASE_QTY', payload: { id } });
  };

  const decreaseQty = (id: number) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return {
    items: state.items,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  };
};
