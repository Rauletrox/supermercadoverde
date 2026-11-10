import { initialProducts } from "../data/products.js";
import { DEFAULT_ICON, MESSAGES, STORAGE } from "../constants/inventory.js";
import { isValidCart } from "./cart.js";
import { isValidInventory } from "./productValidation.js";

// El formato anterior era un arreglo sin versión e identificadores numéricos.
function migrateLegacy(products) {
  if (!Array.isArray(products)) return null;
  return products.map((p) => {
    if (!p || typeof p !== "object" || Array.isArray(p)) return null;
    if (!(typeof p.id === "string" || (Number.isSafeInteger(p.id) && p.id >= 0))) return null;
    return {
      ...p,
      id: String(p.id),
      brand: p.brand === undefined ? "Sin marca" : p.brand,
      type: p.type === undefined ? p.category : p.type,
      icon: p.icon === undefined ? DEFAULT_ICON : p.icon,
    };
  });
}
export function loadInventory() {
  const fallback = { products: initialProducts, cart: [], message: "", canPersist: true };
  try {
    const raw = localStorage.getItem(STORAGE.KEY);
    if (raw === null) return fallback;
    const saved = JSON.parse(raw);
    if (
      saved &&
      !Array.isArray(saved) &&
      Number.isInteger(saved.version) &&
      saved.version > STORAGE.VERSION
    ) {
      return { ...fallback, message: MESSAGES.FUTURE_STORAGE, canPersist: false };
    }
    const products = Array.isArray(saved)
      ? migrateLegacy(saved)
      : [1, STORAGE.VERSION].includes(saved?.version)
        ? saved.products
        : null;
    const cart = saved?.version === STORAGE.VERSION ? saved.cart : [];
    if (!isValidInventory(products) || !isValidCart(cart, products))
      return { ...fallback, message: MESSAGES.INVALID_STORAGE };
    return { products, cart, message: "", canPersist: true };
  } catch (error) {
    return {
      ...fallback,
      message: error instanceof SyntaxError ? MESSAGES.INVALID_STORAGE : MESSAGES.STORAGE,
    };
  }
}
export function persistProducts(products, cart = []) {
  if (!isValidInventory(products) || !isValidCart(cart, products)) return false;
  try {
    localStorage.setItem(STORAGE.KEY, JSON.stringify({ version: STORAGE.VERSION, products, cart }));
    return true;
  } catch {
    return false;
  }
}
