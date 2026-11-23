interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div className="status-message status-loading" role="status" aria-live="polite">
      <span className="hourglass-icon" aria-hidden="true">⏳</span>
      <span>{message}</span>
    </div>
  );
}
