import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useConvexAuth } from 'convex/react';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return <div>Loading protected content...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
}
