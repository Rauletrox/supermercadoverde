import { DEFAULT_ICON } from "../constants/inventory.js";
import { FIELD_RULES, validateProductFields } from "./productValidation.js";

export class ProductValidationError extends Error {
  constructor(errors) {
    super(Object.values(errors)[0]);
    this.name = "ProductValidationError";
    this.errors = errors;
  }
}
// PAUTA S2 · Criterio 6: valida todos los campos antes de crear o editar el artículo.
export function productFromForm(data, previous = {}) {
  const values = Object.fromEntries(
    Object.keys(FIELD_RULES).map((field) => [field, data.get(field)]),
  );
  const errors = validateProductFields(values);
  if (Object.keys(errors).length) throw new ProductValidationError(errors);
  return {
    id: previous.id ?? globalThis.crypto.randomUUID(),
    name: values.name.trim(),
    brand: values.brand.trim(),
    type: values.type.trim(),
    category: values.category,
    stock: Number(values.stock),
    minimum: Number(values.minimum),
    price: Number(values.price),
    icon: previous.icon ?? DEFAULT_ICON,
  };
}
