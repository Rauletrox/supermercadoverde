import React from "react";
import ProductFields from "./ProductFields";
import { useProductForm } from "../../hooks/useProductForm";

// El mismo formulario y hook se usan en la página de ingreso y en el diálogo de edición.
export default function ProductForm({ product, onSaved, onCancel }) {
  const { errors, handleSubmit, handleChange } = useProductForm(product, onSaved);
  return (
    <form noValidate onSubmit={handleSubmit} onChange={handleChange}>
      <ProductFields product={product} errors={errors} />
      <div className="modal-buttons">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="button" type="submit">
          {product ? "Guardar producto" : "Agregar al inventario"}
        </button>
      </div>
    </form>
  );
}
