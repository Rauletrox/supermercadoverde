import { useState } from "react";
import { useInventoryActions } from "../context/InventoryContext";

// Un único estado impide abrir edición y eliminación simultáneamente.
export function useInventoryDialogs() {
  const { deleteProduct } = useInventoryActions();
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);
  function confirmDelete() {
    if (dialog?.mode !== "delete") return;
    deleteProduct(dialog.product.id);
    close();
  }
  return {
    dialog,
    openEdit: (product) => setDialog({ mode: "edit", product }),
    openDelete: (product) => setDialog({ mode: "delete", product }),
    close,
    confirmDelete,
  };
}
