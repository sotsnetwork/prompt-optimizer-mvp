
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Allow access in development mode for testing
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isDevelopment) {
    return <Navigate to="/signin" replace />;
  }

  // In development mode, show a warning but allow access
  if (!user && isDevelopment) {
    console.warn('Development mode: Bypassing authentication for testing');
  }

  return <>{children}</>;
};
