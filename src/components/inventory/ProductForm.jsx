import React from "react";
import ProductFields from "./ProductFields";

export default function ProductForm({ editing, onClose, onSave, error }) {
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        <div className="modal-heading">
          <h2 id="product-title">
            {editing.id ? "Editar producto" : "Agregar producto"}
          </h2>
          <button
            aria-label="Cerrar formulario"
            onClick={() => onClose()}
          >
            ×
          </button>
        </div>
        <form onSubmit={onSave}>
          <ProductFields product={editing} />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="modal-buttons">
            <button
              type="button"
              className="secondary"
              onClick={() => onClose()}
            >
              Cancelar
            </button>
            <button className="button" type="submit">
              Guardar producto
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
