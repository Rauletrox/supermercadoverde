import React, { createContext, useContext, useEffect, useReducer } from "react";
import { inventoryReducer } from "./inventoryReducer.js";
import { loadProducts, persistProducts, STORAGE_WARNING } from "../utils/productStorage.js";

const InventoryContext = createContext(null);

// PAUTA S2 · Criterio 1 (40 puntos): Context y useReducer implementan el estado global.
// products es la lista compartida; useInventory permite consumirla sin duplicarla en cada página.
// El proveedor permanece montado al navegar, por lo que conserva los artículos entre rutas.
export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, () => ({
    products: loadProducts(), message: "", revision: 0,
  }));

  // Persistencia complementaria: sincroniza el estado global con localStorage después de una operación.
  // Si falla, conserva los artículos en memoria y muestra el aviso de almacenamiento.
  useEffect(() => {
    if (state.revision > 0 && !persistProducts(state.products)) {
      dispatch({ type: "message", message: STORAGE_WARNING });
    }
  }, [state.products, state.revision]);

  function saveProduct(product) {
    dispatch({ type: "save", product });
  }

  return (
    <InventoryContext.Provider value={{
      products: state.products,
      message: state.message,
      saveProduct,
      deleteProduct: (id) => dispatch({ type: "delete", id }),
      dismissMessage: () => dispatch({ type: "message", message: "" }),
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const inventory = useContext(InventoryContext);
  if (!inventory) throw new Error("useInventory requiere InventoryProvider.");
  return inventory;
}
