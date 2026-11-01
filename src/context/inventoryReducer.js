// PAUTA S2 · Criterios 1 y 6: actualiza la lista global al agregar, editar o eliminar.
// Devuelve nuevos objetos y arreglos para que React detecte los cambios sin mutar el estado anterior.
export function inventoryReducer(state, action) {
  switch (action.type) {
    case "save": {
      const exists = state.products.some((p) => p.id === action.product.id);
      return {
        products: exists
          ? state.products.map((p) => p.id === action.product.id ? action.product : p)
          : [...state.products, action.product],
        message: exists ? "Producto actualizado correctamente." : "Producto agregado correctamente.",
        revision: state.revision + 1,
      };
    }
    case "delete":
      return {
        products: state.products.filter((p) => p.id !== action.id),
        message: "Producto eliminado.",
        revision: state.revision + 1,
      };
    case "message":
      return { ...state, message: action.message };
    default:
      return state;
  }
}
