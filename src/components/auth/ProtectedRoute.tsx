
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading, isAuthenticated, token } = useAuth();
  
  // Add console logging to help debug
  console.log('ProtectedRoute - Auth State:', { user, loading, isAuthenticated, hasToken: !!token });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  // Check both token and authentication state
  if (!token || !isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login');
    // Clear any stale token
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    console.log(`User role ${user.role} doesn't match required role ${role}, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
