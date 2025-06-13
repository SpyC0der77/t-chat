import { Route, BrowserRouter, Routes, Navigate } from 'react-router';
import Auth from './auth';
import { useConvexAuth } from 'convex/react';
import ProtectedRoute from '@/components/protected';

export default function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) {
    return <div>Loading application...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Landing Page - Hello World</h1>} />
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/settings/subscription" replace /> : <Auth />
        } />
        <Route element={<ProtectedRoute />}>
          <Route path="/settings/subscription" element={<h1>Subscription Page - Hello World</h1>} />
          <Route path="/settings" element={<Navigate to="/settings/subscription" replace />} />
        </Route>
        <Route path="/chat/:id" element={<h1>Chat Page - Hello World</h1>} />
        <Route path="/chat" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
