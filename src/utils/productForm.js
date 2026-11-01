import { categories } from "../data/products.js";

// PAUTA S2 · Criterio 6: construye el artículo con nombre, marca y tipo del formulario.
// Valida textos obligatorios, categoría y cantidades enteras no negativas antes de guardarlo.
export function productFromForm(data, previous = {}) {
  const product = {
    id: previous.id ?? Date.now(),
    name: String(data.get("name") ?? "").trim(),
    brand: String(data.get("brand") ?? "").trim(),
    type: String(data.get("type") ?? "").trim(),
    category: data.get("category"),
    stock: Number(data.get("stock")),
    minimum: Number(data.get("minimum")),
    price: Number(data.get("price")),
    icon: previous.icon ?? "🛒",
  };
  if (!product.name || !product.brand || !product.type ||
    product.name.length > 80 || product.brand.length > 60 || product.type.length > 60 ||
    !categories.includes(product.category) ||
    !["stock", "minimum", "price"].every((key) =>
      data.get(key) !== null && String(data.get(key)).trim() !== "" &&
      Number.isSafeInteger(product[key]) && product[key] >= 0
    )) throw new Error("Completa nombre, marca y tipo. Los valores numéricos deben ser enteros iguales o mayores que cero.");
  return product;
}
