import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Si aún se está cargando el estado de autenticación (por ejemplo, comprobando localStorage)
  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirige automáticamente al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderiza la ruta correspondiente
  return <Outlet />;
}