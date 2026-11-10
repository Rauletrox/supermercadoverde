import { useMemo, useState } from "react";
import { DEFAULT_FILTERS, STATUS } from "../constants/inventory.js";
import { filterProducts } from "../utils/inventory.js";

export function useInventoryFilters(products) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const changeFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const showRestock = () => setFilters({ ...DEFAULT_FILTERS, status: STATUS.RESTOCK });
  return { filters, filtered, changeFilter, showRestock };
}
