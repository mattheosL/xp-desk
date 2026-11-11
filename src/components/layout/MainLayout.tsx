import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="app-page">
      <Header user={user} />

      <div className="app-layout">
        <Sidebar />

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
