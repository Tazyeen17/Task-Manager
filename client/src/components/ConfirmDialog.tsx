import React from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true"
      aria-labelledby="confirm-heading"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal modal--sm">
        <div className="confirm-icon" aria-hidden="true">🗑️</div>
        <h2 id="confirm-heading" className="modal-title confirm-title">Delete Task</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button
            id="cancel-delete-btn"
            className="btn btn-ghost"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
