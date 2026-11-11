import type { AuthUser } from '../../types/user';
import { Brand } from './Brand';

interface HeaderProps {
  user: AuthUser | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="app-header">
      <Brand compact />
      <div className="header-right">
        <div className="user-chip">
          <span className="user-avatar" aria-hidden="true">{user?.username.slice(0, 1).toUpperCase()}</span>
        
        </div>
      </div>
    </header>
  );
}
