import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export function ProtectedRoute({ children, requirePermission }) {
  const location = useLocation();
  const authenticated = useAuthStore((s) => !!s.accessToken);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requirePermission && !hasPermission(requirePermission)) {
    return <div className="p-8 text-center text-red-500">No tienes permisos para esta sección.</div>;
  }
  return children;
}
