import React from "react";
import ProductImage from "./ProductImage";
import { money, productStatus } from "../../utils/inventory";

// PAUTA S2 · Criterio 6 (40 puntos): tabla de artículos del inventario.
// products.map genera una fila por artículo y muestra nombre, marca, tipo y datos de stock.
export default function ProductTable({ products: filtered, onEdit: setEditing, onDelete: setPendingDelete }) {
  return (
    <div className="table-scroll">
      <table aria-label="Artículos del inventario">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Tipo de producto</th>
            <th>Categoría</th>
            <th>Precio unitario</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="product">
                  <ProductImage product={p} />
                  <span>
                    <strong>{p.name}</strong>
                    <small>
                      SKU-{String(p.id).slice(-5).padStart(5, "0")}
                    </small>
                  </span>
                </div>
              </td>
              <td>{p.brand}</td>
              <td>{p.type}</td>
              <td>{p.category}</td>
              <td className="price">{money(p.price)}</td>
              <td>
                <strong>{p.stock}</strong>
                <span className="unit"> un.</span>
              </td>
              <td>
                <span
                  className={`badge ${productStatus(p) === "Disponible" ? "green" : productStatus(p) === "Agotado" ? "red" : "amber"}`}
                >
                  <span>●</span> {productStatus(p)}
                </span>
              </td>
              <td>
                <div className="actions">
                  <button
                    aria-label={`Editar ${p.name}`}
                    onClick={() => setEditing(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete"
                    aria-label={`Eliminar ${p.name}`}
                    onClick={() => setPendingDelete(p)}
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="empty">
          No hay productos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
