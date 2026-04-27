"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useBodyScrollLock from "@/hooks/useBodyScrollLock.js";
import styles from "./Modal.module.css";

const Modal = ({ children, isOpen, onClose, title }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.dialog} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Join the beta</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
