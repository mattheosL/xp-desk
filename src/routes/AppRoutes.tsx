import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Profile } from '../pages/Profile';
import { ProjectDetails } from '../pages/ProjectDetails';
import { Projects } from '../pages/Projects';
import { Register } from '../pages/Register';
import { GuestOnlyRoute, ProtectedRoute } from './ProtectedRoute';

function IndexRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/app' : '/login'} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexRedirect />} />

      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projetos" element={<Projects />} />
          <Route path="projetos/:projectId" element={<ProjectDetails />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
