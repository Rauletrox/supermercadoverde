import React from "react";
import ProductEditor from "./ProductEditor";
import DeleteConfirmation from "./DeleteConfirmation";

// Orquestador de modales separado del resumen, los filtros y el panel de listado.
export default function InventoryDialogs({ dialog, onClose, onConfirmDelete }) {
  if (!dialog) return null;
  if (dialog.mode === "edit") {
    return <ProductEditor key={dialog.product.id} product={dialog.product} onClose={onClose} />;
  }
  if (dialog.mode === "delete") {
    return (
      <DeleteConfirmation
        pendingDelete={dialog.product}
        onClose={onClose}
        onConfirm={onConfirmDelete}
      />
    );
  }
  return null;
}
