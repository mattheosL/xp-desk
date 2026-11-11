import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';

interface AuthFrameProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthFrame({ title, subtitle, children, footer }: AuthFrameProps) {
  return (
    <main className="auth-page">
      <div className="auth-topline">
        <Link to="/login" className="brand-link" aria-label="Xp Desk — página inicial">
          <Brand />
        </Link>
        <span className="version-label">SPRINT 01</span>
      </div>

      <section className="auth-center" aria-labelledby="auth-title">
        <div className="window auth-window">
          <div className="title-bar">
            <div className="title-bar-text">{title}</div>
          </div>
          <div className="window-body auth-window-body">
            <div className="auth-heading">
              <span className="auth-kicker">GERENCIAMENTO VISUAL DE PROJETOS</span>
              <h1 id="auth-title">{subtitle}</h1>
              <p>Organize suas ideias e acompanhe o trabalho em um só lugar.</p>
            </div>
            {children}
            <div className="auth-footer">{footer}</div>
          </div>
        </div>
       
      </section>

      <footer className="auth-bottomline">
        <span>Xp Desk</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
