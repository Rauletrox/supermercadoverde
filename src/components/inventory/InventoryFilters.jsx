import React from "react";
import { ALL_CATEGORIES, CATEGORIES, STATUS } from "../../constants/inventory.js";
export default function InventoryFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <label className="search">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label="Buscar producto"
          placeholder="Buscar por nombre, marca o tipo…"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
      </label>
      <select
        aria-label="Filtrar por categoría"
        value={filters.category}
        onChange={(event) => onChange("category", event.target.value)}
      >
        {[ALL_CATEGORIES, ...CATEGORIES].map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <select
        aria-label="Filtrar por estado"
        value={filters.status}
        onChange={(event) => onChange("status", event.target.value)}
      >
        {Object.values(STATUS).map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </div>
  );
}
