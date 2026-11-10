import { ALL_CATEGORIES, DEFAULT_FILTERS, STATUS } from "../constants/inventory.js";
const formatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});
export const money = (value) => formatter.format(value);
export const needsRestock = (product) => product.stock <= product.minimum;
export const productStatus = (product) =>
  product.stock === 0 ? STATUS.EMPTY : needsRestock(product) ? STATUS.LOW : STATUS.AVAILABLE;
export const matchesStatus = (product, status) =>
  status === STATUS.ALL ||
  (status === STATUS.RESTOCK ? needsRestock(product) : productStatus(product) === status);
export function filterProducts(products, filters = DEFAULT_FILTERS) {
  const search = filters.search.trim().toLocaleLowerCase("es");
  return products.filter(
    (product) =>
      [product.name, product.brand, product.type].some((value) =>
        value.toLocaleLowerCase("es").includes(search),
      ) &&
      (filters.category === ALL_CATEGORIES || product.category === filters.category) &&
      matchesStatus(product, filters.status),
  );
}
