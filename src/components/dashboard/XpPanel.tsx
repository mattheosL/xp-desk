import type { ReactNode } from 'react';

interface XpPanelProps {
  title: string;
  icon: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
}

/** Janela com barra de título azul, no estilo Windows XP. */
export function XpPanel({ title, icon, subtitle, footer, id, className = '', children }: XpPanelProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={`xp-panel ${className}`.trim()} aria-labelledby={headingId}>
      <header className="xp-panel__bar">
        <span className="xp-panel__icon">{icon}</span>
        <h2 id={headingId}>{title}</h2>
      </header>
      {subtitle && <p className="xp-panel__subtitle">{subtitle}</p>}
      <div className="xp-panel__body">{children}</div>
      {footer && <footer className="xp-panel__footer">{footer}</footer>}
    </section>
  );
}
