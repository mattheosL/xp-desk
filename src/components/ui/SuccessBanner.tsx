interface SuccessBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  if (!message) return null;

  return (
    <div className="status-message status-success" role="status">
      <span className="status-icon" aria-hidden="true">✓</span>
      <span className="status-text">{message}</span>
      {onDismiss && (
        <button type="button" className="status-dismiss" onClick={onDismiss} aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  );
}
