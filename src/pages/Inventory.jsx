import React from "react";
import { Link } from "react-router";
import { useProducts } from "../context/InventoryContext";
import { useInventoryFilters } from "../hooks/useInventoryFilters";
import { needsRestock } from "../utils/inventory.js";
import { ROUTES } from "../constants/inventory.js";
import InventorySummary from "../components/inventory/InventorySummary";
import InventoryPanel from "../components/inventory/InventoryPanel";
import RestockNotice from "../components/inventory/RestockNotice";
import InventoryDialogs from "../components/inventory/InventoryDialogs";
import { useInventoryDialogs } from "../hooks/useInventoryDialogs";

// PAUTA S2 · Criterios 1 y 6: la página coordina componentes especializados con el inventario global.
export default function Inventory({ showSummary = true }) {
  const products = useProducts();
  const { filters, filtered, changeFilter, showRestock } = useInventoryFilters(products);
  const { dialog, openEdit, openDelete, close, confirmDelete } = useInventoryDialogs();
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="eyebrow">TU SUPERMERCADO, EN ORDEN</div>
          <h1>
            {showSummary ? "Control de inventario" : "Listado de artículos"}
            <span>.</span>
          </h1>
          <p>Todo lo que necesitas para mantener tus estantes al día.</p>
        </div>
        <Link className="button" to={ROUTES.NEW}>
          ＋ Ingresar artículo
        </Link>
      </section>
      {showSummary && <InventorySummary products={products} />}
      {showSummary && (
        <RestockNotice count={products.filter(needsRestock).length} onShow={showRestock} />
      )}
      <InventoryPanel
        products={products}
        filtered={filtered}
        filters={filters}
        onFilter={changeFilter}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <p className="local-note">
        ◈ Los cambios se guardan en este navegador cuando el almacenamiento está disponible.
      </p>
      <InventoryDialogs dialog={dialog} onClose={close} onConfirmDelete={confirmDelete} />
    </>
  );
}
