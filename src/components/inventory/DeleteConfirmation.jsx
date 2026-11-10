import React from "react";
export default function DeleteConfirmation({ pendingDelete, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <h2 id="delete-title">Eliminar producto</h2>
        <p>¿Quieres eliminar “{pendingDelete.name}” del inventario?</p>
        <div className="modal-buttons">
          <button className="secondary" autoFocus onClick={() => onClose()}>
            Cancelar
          </button>
          <button className="button danger" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </section>
    </div>
  );
}
