interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="status-message status-error" role="alert">
      <span className="status-icon" aria-hidden="true">✕</span>
      <span className="status-text">{message}</span>
      {onDismiss && (
        <button type="button" className="status-dismiss" onClick={onDismiss} aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  );
}
