import { ACTIONS, MESSAGES } from "../constants/inventory.js";
import { reduceCart } from "./cartReducer.js";
import { isValidProduct } from "../utils/productValidation.js";

// PAUTA S2 · Criterios 1 y 6: acciones explícitas y actualizaciones inmutables.
export function inventoryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.CART_ADD:
    case ACTIONS.CART_SET:
    case ACTIONS.CART_REMOVE:
    case ACTIONS.CART_CLEAR:
      return reduceCart(state, action);
    case ACTIONS.ADD:
      if (!isValidProduct(action.product)) return state;
      if (state.products.some((p) => p.id === action.product.id))
        return { ...state, message: MESSAGES.DUPLICATE };
      return {
        ...state,
        products: [...state.products, action.product],
        message: MESSAGES.ADDED,
        revision: state.revision + 1,
      };
    case ACTIONS.UPDATE:
      if (!isValidProduct(action.product)) return state;
      if (!state.products.some((p) => p.id === action.product.id))
        return { ...state, message: MESSAGES.NOT_FOUND };
      if (
        !Number.isSafeInteger(
          action.product.stock +
            ((state.cart ?? []).find((line) => line.productId === action.product.id)?.quantity ??
              0),
        )
      ) {
        return { ...state, message: MESSAGES.CART_LIMIT };
      }
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.product.id ? action.product : p)),
        message: MESSAGES.UPDATED,
        revision: state.revision + 1,
      };
    case ACTIONS.DELETE:
      if ((state.cart ?? []).some((line) => line.productId === action.id))
        return { ...state, message: MESSAGES.CART_DELETE };
      if (!state.products.some((p) => p.id === action.id)) return state;
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.id),
        message: MESSAGES.DELETED,
        revision: state.revision + 1,
      };
    case ACTIONS.MESSAGE:
      return state.message === action.message ? state : { ...state, message: action.message };
    default:
      return state;
  }
}
