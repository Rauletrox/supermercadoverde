import React from "react";
import InventoryFilters from "./InventoryFilters";
import ProductTable from "./ProductTable";
export default function InventoryPanel({
  products,
  filtered,
  filters,
  onFilter,
  onEdit,
  onDelete,
}) {
  return (
    <section className="inventory-panel">
      <div className="panel-title">
        <div>
          <h2>Listado de productos</h2>
          <p>Consulta y administra los productos de tu supermercado.</p>
        </div>
        <span className="count">{products.length} productos</span>
      </div>
      <InventoryFilters filters={filters} onChange={onFilter} />
      <ProductTable products={filtered} onEdit={onEdit} onDelete={onDelete} />
      <div className="table-footer">
        Mostrando {filtered.length} de {products.length} productos
        <span>Precios en pesos chilenos (CLP)</span>
      </div>
    </section>
  );
}
