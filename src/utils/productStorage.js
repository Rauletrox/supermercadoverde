import { initialProducts, categories } from "../data/products.js";

export const STORAGE_KEY = "mercado-verde-products";
export const STORAGE_WARNING = "Los cambios se conservarán durante esta sesión. El navegador no permitió guardarlos.";

export function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved) || !saved.every((p) =>
      p && typeof p.name === "string" && categories.includes(p.category) &&
      [p.stock, p.minimum, p.price].every((n) => Number.isFinite(n) && n >= 0) &&
      Number.isFinite(p.id) &&
      (p.brand === undefined || typeof p.brand === "string") &&
      (p.type === undefined || typeof p.type === "string")
    )) return initialProducts;
    // Compatibilidad con el inventario de la primera actividad.
    return saved.map((p) => ({
      ...p,
      brand: p.brand?.trim() || "Sin marca",
      type: p.type?.trim() || p.category,
    }));
  } catch {
    return initialProducts;
  }
}

export function persistProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch {
    return false;
  }
}
