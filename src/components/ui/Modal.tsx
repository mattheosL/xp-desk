import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="window auth-window">
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button type="button" aria-label="Fechar" onClick={onClose} />
        </div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}
