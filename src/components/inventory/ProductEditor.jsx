import React from "react";
import ProductForm from "./ProductForm";

export default function ProductEditor({ product, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="product-title">
        <div className="modal-heading">
          <h2 id="product-title">Editar producto</h2>
          <button aria-label="Cerrar formulario" onClick={onClose}>
            ×
          </button>
        </div>
        <ProductForm product={product} onSaved={onClose} onCancel={onClose} />
      </section>
    </div>
  );
}
