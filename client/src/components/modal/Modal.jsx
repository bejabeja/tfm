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
  type = "confirm",
}) => {
  if (!isOpen) return null;

  const confirmClass =
    type === "danger" ? "btn btn__danger" : "btn btn__primary";

  return (
    <div className="modal__backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="modal__actions">
          <button className="btn btn__secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={confirmClass} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
