export const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export const needsRestock = (product) => product.stock <= product.minimum;

export const productStatus = (product) =>
  product.stock === 0 ? "Agotado" : needsRestock(product) ? "Stock bajo" : "Disponible";

export function matchesStatus(product, status) {
  return status === "Todos los estados" ||
    (status === "Por reponer" ? needsRestock(product) : productStatus(product) === status);
}
