import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { AuthUser } from '../../types/user';
import { Brand } from './Brand';

interface HeaderProps {
  user: AuthUser | null;
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="app-header">
      <Brand compact />
      <div className="header-right">
        <div className="user-chip">
          <span className="user-avatar" aria-hidden="true">
            {user?.username.slice(0, 1).toUpperCase()}
          </span>
          <span className="user-name">{user?.username}</span>
        </div>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Sair<span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}
