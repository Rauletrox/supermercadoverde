export const CATEGORIES = Object.freeze([
  "Frutas y verduras",
  "Lácteos",
  "Panadería",
  "Abarrotes",
  "Otros",
]);
export const STATUS = Object.freeze({
  ALL: "Todos los estados",
  RESTOCK: "Por reponer",
  AVAILABLE: "Disponible",
  LOW: "Stock bajo",
  EMPTY: "Agotado",
});
export const ALL_CATEGORIES = "Todas las categorías";
export const DEFAULT_FILTERS = Object.freeze({
  search: "",
  category: ALL_CATEGORIES,
  status: STATUS.ALL,
});
export const ACTIONS = Object.freeze({
  ADD: "add",
  UPDATE: "update",
  DELETE: "delete",
  MESSAGE: "message",
  CART_ADD: "cart/add",
  CART_SET: "cart/set",
  CART_REMOVE: "cart/remove",
  CART_CLEAR: "cart/clear",
});
export const MESSAGES = Object.freeze({
  ADDED: "Producto agregado correctamente.",
  UPDATED: "Producto actualizado correctamente.",
  DELETED: "Producto eliminado.",
  CART_ADDED: "Artículo agregado al carrito. Stock actualizado.",
  CART_UPDATED: "Cantidad del carrito e inventario actualizados.",
  CART_REMOVED: "Artículo retirado del carrito. Stock devuelto al inventario.",
  CART_CLEARED: "Carrito vaciado. Stock devuelto al inventario.",
  CART_QUANTITY: "Ingresa una cantidad entera válida.",
  CART_STOCK: "No hay stock suficiente para esa cantidad.",
  CART_DELETE: "Retira este artículo del carrito antes de eliminarlo del inventario.",
  CART_LIMIT: "La cantidad total del producto supera el límite permitido.",
  DUPLICATE: "No se pudo agregar: el identificador ya está registrado.",
  NOT_FOUND: "El producto ya no se encuentra en el inventario.",
  STORAGE: "Los cambios se conservarán durante esta sesión. El navegador no permitió guardarlos.",
  INVALID_STORAGE:
    "El inventario guardado no es válido. Se cargaron los productos de demostración.",
  FUTURE_STORAGE:
    "El inventario guardado pertenece a otra versión. Los cambios de esta sesión no reemplazarán esos datos.",
});
export const ROUTES = Object.freeze({
  HOME: "/",
  ARTICLES: "/articulos",
  NEW: "/articulos/nuevo",
  DETAIL: "/articulos/:productId",
  CART: "/carrito",
  ABOUT: "/quienes-somos",
  STORES: "/tiendas",
});
export const STORAGE = Object.freeze({ KEY: "mercado-verde-products", VERSION: 2 });
export const DEFAULT_ICON = "🛒";

export const articlePath = (id) => `${ROUTES.ARTICLES}/${encodeURIComponent(id)}`;
