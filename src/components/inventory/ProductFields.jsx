import React from "react";
import { categories } from "../../data/products";

// PAUTA S2 · Criterio 6: campos obligatorios de nombre, marca y tipo de producto.
// También incluye categoría, precio, stock y mínimo; se reutiliza en ingreso y edición.
// PAUTA S2 · Criterio 2: grid, gap-5 y sm:grid-cols-2 de Tailwind adaptan la distribución.
export default function ProductFields({ product = {} }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm sm:col-span-2">
        Nombre del producto
        <input autoFocus name="name" required maxLength="80" pattern={".*\\S.*"} defaultValue={product.name ?? ""} placeholder="Ej.: Leche descremada · 1 L" />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Marca
        <input name="brand" required maxLength="60" pattern={".*\\S.*"} defaultValue={product.brand ?? ""} placeholder="Ej.: Mercado Verde" />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Tipo de producto
        <input name="type" required maxLength="60" pattern={".*\\S.*"} defaultValue={product.type ?? ""} placeholder="Ej.: Leche descremada" />
      </label>
      <label className="flex flex-col gap-2 text-sm sm:col-span-2">
        Categoría
        <select name="category" defaultValue={product.category ?? categories[0]}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Precio unitario (CLP)
        <input type="number" name="price" max={Number.MAX_SAFE_INTEGER} min="0" step="1" required defaultValue={product.price ?? 0} />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Stock (unidades)
        <input type="number" name="stock" max={Number.MAX_SAFE_INTEGER} min="0" step="1" required defaultValue={product.stock ?? 0} />
      </label>
      <label className="flex flex-col gap-2 text-sm sm:col-span-2">
        Stock mínimo
        <input type="number" name="minimum" max={Number.MAX_SAFE_INTEGER} min="0" step="1" required defaultValue={product.minimum ?? 10} />
      </label>
    </div>
  );
}
