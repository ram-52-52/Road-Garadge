import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthGuardProps {
  allowedRoles?: ('DRIVER' | 'GARAGE_OWNER' | 'ADMIN' | null)[];
  children?: React.ReactNode;
}

const AuthGuard = ({ allowedRoles, children }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user role is not allowed, send back to home which handles redirection logic
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
