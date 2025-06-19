import { useCustomAuth } from '@/frontend/chat/contexts/auth';
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated: isCustomAuthenticated } = useCustomAuth();

  if (!isCustomAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
}
