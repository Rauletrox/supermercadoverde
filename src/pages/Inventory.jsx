import React, { useState } from "react";
import { categories } from "../data/products";
import { money, needsRestock, matchesStatus } from "../utils/inventory";
import { Link } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import { productFromForm } from "../utils/productForm";
import Stat from "../components/inventory/Stat";
import ProductTable from "../components/inventory/ProductTable";
import ProductForm from "../components/inventory/ProductForm";
import DeleteConfirmation from "../components/inventory/DeleteConfirmation";

// Criterios Semana 02 - 1 y 6: consume el inventario global mediante useInventory.
// Reutiliza la tabla en el inicio y en /articulos, con búsqueda, filtros, edición y eliminación.
export default function Inventory({ showSummary = true }) {
  const { products, saveProduct, deleteProduct } = useInventory();
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [status, setStatus] = useState("Todos los estados");
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const filtered = products.filter(
    (p) =>
      p.name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")) &&
      (category === "Todas las categorías" || p.category === category) &&
      matchesStatus(p, status),
  );
  const low = products.filter(needsRestock).length;
  function save(event) {
    event.preventDefault();
    try {
      saveProduct(productFromForm(new FormData(event.currentTarget), editing));
      setEditing(null);
      setFormError("");
    } catch (error) {
      setFormError(error.message);
    }
  }

  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">TU SUPERMERCADO, EN ORDEN</div>
          <h1>
            {showSummary ? "Control de inventario" : "Listado de artículos"}<span>.</span>
          </h1>
          <p>Todo lo que necesitas para mantener tus estantes al día.</p>
        </div>
        <Link className="button" to="/articulos/nuevo">
          ＋ Ingresar artículo
        </Link>
      </section>
      {showSummary && <section className="stats" aria-label="Resumen del inventario">
        <Stat
          label="Productos registrados"
          value={products.length}
          icon="▦"
          detail="Variedad en tu catálogo"
        />
        <Stat
          label="Unidades disponibles"
          value={products.reduce((n, p) => n + p.stock, 0)}
          icon="▤"
          detail="Stock total del supermercado"
        />
        <Stat
          label="Productos por reponer"
          value={low}
          icon="↗"
          detail="Stock bajo o agotado"
          warning
        />
        <Stat
          label="Valor del inventario"
          value={money(products.reduce((n, p) => n + p.price * p.stock, 0))}
          icon="$"
          detail="Calculado a precio de venta"
        />
      </section>}
      {showSummary && low > 0 && (
        <div className="notice">
          <span className="notice-icon">!</span>
          <p>
            <strong>Un vistazo a tus estantes.</strong> Tienes {low} productos
            que necesitan reposición.
          </p>
          <button
            onClick={() => {
              setCategory("Todas las categorías");
              setSearch("");
              setStatus("Por reponer");
            }}
          >
            Ver productos por reponer →
          </button>
        </div>
      )}
      <section className="inventory-panel">
        <div className="panel-title">
          <div>
            <h2>Listado de productos</h2>
            <p>Consulta y administra los productos de tu supermercado.</p>
          </div>
          <span className="count">{products.length} productos</span>
        </div>
        <div className="filters">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Buscar producto"
              placeholder="Buscar un producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["Todas las categorías", ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Todos los estados", "Por reponer", "Disponible", "Stock bajo", "Agotado"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </div>
        {/* Criterios Semana 02 - 6: tabla de artículos del estado global, según los filtros seleccionados. */}
        <ProductTable products={filtered} onEdit={(product) => { setFormError(""); setEditing(product); }} onDelete={setPendingDelete} />
        <div className="table-footer">
          Mostrando {filtered.length} de {products.length} productos
          <span>Precios en pesos chilenos (CLP)</span>
        </div>
      </section>
      <div className="local-note">
        <span>◈</span> Tu inventario se guarda automáticamente en este
        navegador.
      </div>
      {editing && (
        <ProductForm editing={editing} onClose={() => setEditing(null)} onSave={save} error={formError} />
      )}
      {pendingDelete && (
        <DeleteConfirmation
          pendingDelete={pendingDelete}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteProduct(pendingDelete.id);
            setPendingDelete(null);
          }}
        />
      )}
    </>
  );
}
