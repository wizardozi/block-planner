// src/components/ModalWrapper.jsx
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root') || document.body;

export default function PortalWrapper({ children }) {
  return createPortal(children, modalRoot);
}
