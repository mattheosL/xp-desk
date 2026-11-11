import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="window not-found-window">
        <div className="title-bar"><div className="title-bar-text">Xp Desk — Página não encontrada</div></div>
        <div className="window-body">
          <div className="not-found-content">
            <span aria-hidden="true">⚠</span>
            <div>
              <h1>Não encontramos esta página.</h1>
              <p>O endereço pode estar incorreto ou a página ainda não foi criada.</p>
              <Link to="/login">Voltar ao início</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
