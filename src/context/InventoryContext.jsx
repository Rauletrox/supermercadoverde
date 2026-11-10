import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { inventoryReducer } from "./inventoryReducer.js";
import { loadInventory, persistProducts } from "../utils/productStorage.js";
import { ACTIONS, MESSAGES } from "../constants/inventory.js";

const CartContext = createContext(null);
const ProductsContext = createContext(null);
const ActionsContext = createContext(null);
const MessageContext = createContext(null);

// PAUTA S2 · Criterio 1: contextos separados evitan propagar avisos a los consumidores de productos.
export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, () => ({
    ...loadInventory(),
    revision: 0,
  }));
  useEffect(() => {
    if (state.revision === 0) return;
    if (!state.canPersist || !persistProducts(state.products, state.cart)) {
      dispatch({
        type: ACTIONS.MESSAGE,
        message: state.canPersist ? MESSAGES.STORAGE : MESSAGES.FUTURE_STORAGE,
      });
    }
  }, [state.products, state.cart, state.revision, state.canPersist]);
  const addProduct = useCallback((product) => dispatch({ type: ACTIONS.ADD, product }), []);
  const updateProduct = useCallback((product) => dispatch({ type: ACTIONS.UPDATE, product }), []);
  const deleteProduct = useCallback((id) => dispatch({ type: ACTIONS.DELETE, id }), []);
  const dismissMessage = useCallback(() => dispatch({ type: ACTIONS.MESSAGE, message: "" }), []);
  const addToCart = useCallback(
    (id, quantity) => dispatch({ type: ACTIONS.CART_ADD, id, quantity }),
    [],
  );
  const setCartQuantity = useCallback(
    (id, quantity) => dispatch({ type: ACTIONS.CART_SET, id, quantity }),
    [],
  );
  const removeFromCart = useCallback((id) => dispatch({ type: ACTIONS.CART_REMOVE, id }), []);
  const clearCart = useCallback(() => dispatch({ type: ACTIONS.CART_CLEAR }), []);
  const actions = useMemo(
    () => ({
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
    ],
  );
  const notification = useMemo(
    () => ({ message: state.message, dismissMessage }),
    [state.message, dismissMessage],
  );
  return (
    <ActionsContext.Provider value={actions}>
      <ProductsContext.Provider value={state.products}>
        <CartContext.Provider value={state.cart}>
          <MessageContext.Provider value={notification}>{children}</MessageContext.Provider>
        </CartContext.Provider>
      </ProductsContext.Provider>
    </ActionsContext.Provider>
  );
}
function useRequiredContext(context) {
  const value = useContext(context);
  if (value === null) throw new Error("El inventario requiere InventoryProvider.");
  return value;
}
export function useProducts() {
  return useRequiredContext(ProductsContext);
}
export function useInventoryActions() {
  return useRequiredContext(ActionsContext);
}
export function useInventoryMessage() {
  return useRequiredContext(MessageContext);
}

export function useCart() {
  return useRequiredContext(CartContext);
}
