import { CATEGORIES } from "../constants/inventory.js";

// Reglas compartidas por el formulario y la validación del inventario persistido.
export const PATTERNS = Object.freeze({
  TEXT: /\S/u,
  INTEGER: /^\d+$/u,
  ID: /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/u,
});
export const FIELD_RULES = Object.freeze({
  name: {
    label: "Nombre del producto",
    maxLength: 80,
    required: "Ingresa el nombre del producto.",
  },
  brand: { label: "Marca", maxLength: 60, required: "Ingresa la marca del producto." },
  type: { label: "Tipo de producto", maxLength: 60, required: "Ingresa el tipo de producto." },
  category: { label: "Categoría" },
  price: { label: "Precio unitario (CLP)", numeric: true },
  stock: { label: "Stock (unidades)", numeric: true },
  minimum: { label: "Stock mínimo", numeric: true },
});
export function validateProductFields(values) {
  const errors = {};
  for (const [field, rule] of Object.entries(FIELD_RULES)) {
    const value = values[field];
    if (field === "category") {
      if (!CATEGORIES.includes(value)) errors[field] = "Selecciona una categoría válida.";
    } else if (rule.numeric) {
      if (
        (typeof value !== "string" && typeof value !== "number") ||
        !PATTERNS.INTEGER.test(String(value)) ||
        !Number.isSafeInteger(Number(value))
      ) {
        errors[field] =
          `${rule.label}: ingresa un entero igual o mayor que cero, hasta ${Number.MAX_SAFE_INTEGER}.`;
      }
    } else if (typeof value !== "string" || !PATTERNS.TEXT.test(value)) {
      errors[field] = rule.required;
    } else if (value.trim().length > rule.maxLength) {
      errors[field] = `${rule.label}: usa un máximo de ${rule.maxLength} caracteres.`;
    }
  }
  return errors;
}
export function isValidProduct(product) {
  return Boolean(
    product &&
    typeof product === "object" &&
    !Array.isArray(product) &&
    typeof product.id === "string" &&
    PATTERNS.ID.test(product.id) &&
    typeof product.icon === "string" &&
    PATTERNS.TEXT.test(product.icon) &&
    product.icon.length <= 16 &&
    ["stock", "price", "minimum"].every((field) => typeof product[field] === "number") &&
    ["name", "brand", "type"].every(
      (field) => typeof product[field] === "string" && product[field] === product[field].trim(),
    ) &&
    Object.keys(validateProductFields(product)).length === 0,
  );
}
export function isValidInventory(products) {
  return (
    Array.isArray(products) &&
    products.every(isValidProduct) &&
    new Set(products.map((p) => p.id)).size === products.length
  );
}
