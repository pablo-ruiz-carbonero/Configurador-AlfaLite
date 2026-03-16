import React from "react";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({ onCancel, onConfirm }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div
      className="modal-content glass-panel confirm-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="danger-text">⚠️ Confirmar Borrado</h2>
      <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
      <div className="confirm-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn-delete-confirm" onClick={onConfirm}>
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;
