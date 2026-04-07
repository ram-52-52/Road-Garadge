import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('DRIVER' | 'GARAGE_OWNER' | 'ADMIN')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    // If unauthorized, redirect to their appropriate home
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/dashboard" replace />;
      case 'GARAGE_OWNER':
        return <Navigate to="/mechanic" replace />;
      case 'DRIVER':
        return <Navigate to="/driver" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
