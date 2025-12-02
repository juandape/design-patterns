import { CartState, CartItem } from "../types";

export const initialState: CartState = {
  items: []
}

export type CartAction =
  | { type: "ADD_ITEM", payload: CartItem }
  | { type: "REMOVE_ITEM", payload: { id: number } }
  | { type: "INCREASE_QTY", payload: { id: number } }
  | { type: "DECREASE_QTY", payload: { id: number } }
  | { type: "CLEAR_CART" }

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      return {...state, items: [...state.items, action.payload]};
    case "REMOVE_ITEM":
      return {...state, items: state.items.filter(item => item.id !== action.payload.id)};
    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        )
      };
    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, qty: item.qty - 1 } : item
        )
      };
    case "CLEAR_CART":
      return {...state, items: []};
    default:
      return state;
  }
}