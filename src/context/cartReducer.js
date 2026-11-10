import { ACTIONS, MESSAGES } from "../constants/inventory.js";

// S3: stock y reservas se actualizan en la misma transición del reducer.
export function reduceCart(state, action) {
  const cart = state.cart ?? [];
  if (action.type === ACTIONS.CART_CLEAR) {
    if (!cart.length) return state;
    return {
      ...state,
      cart: [],
      revision: state.revision + 1,
      message: MESSAGES.CART_CLEARED,
      products: state.products.map((product) => ({
        ...product,
        stock: product.stock + (cart.find((line) => line.productId === product.id)?.quantity ?? 0),
      })),
    };
  }
  const product = state.products.find((p) => p.id === action.id);
  if (!product) return { ...state, message: MESSAGES.NOT_FOUND };
  const current = cart.find((line) => line.productId === action.id)?.quantity ?? 0;
  let quantity;
  if (action.type === ACTIONS.CART_ADD) {
    if (!Number.isSafeInteger(action.quantity) || action.quantity < 1)
      return { ...state, message: MESSAGES.CART_QUANTITY };
    quantity = current + action.quantity;
  } else if (action.type === ACTIONS.CART_REMOVE) {
    quantity = 0;
  } else {
    if (!current) return state;
    quantity = action.quantity;
  }
  if (!Number.isSafeInteger(quantity) || quantity < 0)
    return { ...state, message: MESSAGES.CART_QUANTITY };
  const delta = quantity - current;
  if (delta === 0) return state;
  if (delta > product.stock) return { ...state, message: MESSAGES.CART_STOCK };
  const stock = product.stock - delta;
  if (!Number.isSafeInteger(stock)) return { ...state, message: MESSAGES.CART_LIMIT };
  const nextCart = cart.filter((line) => line.productId !== product.id);
  if (quantity > 0) nextCart.push({ productId: product.id, quantity });
  return {
    ...state,
    products: state.products.map((p) => (p.id === product.id ? { ...p, stock } : p)),
    cart: nextCart,
    revision: state.revision + 1,
    message:
      quantity === 0
        ? MESSAGES.CART_REMOVED
        : action.type === ACTIONS.CART_ADD
          ? MESSAGES.CART_ADDED
          : MESSAGES.CART_UPDATED,
  };
}
