import React from "react";
import "./Modal.scss";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal__backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="modal__actions">
          <button className="btn btn__secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn btn__danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
