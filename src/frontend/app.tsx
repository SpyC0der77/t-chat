import { Route, BrowserRouter, Routes, Navigate } from 'react-router';
import Auth from '@/frontend/auth';
import ProtectedRoute from '@/components/protected';
import Home from '@/frontend/home';
import { useCustomAuth } from '@/hooks/use-custom-auth';

export default function App() {
  const { isAuthenticated: isCustomAuthenticated } = useCustomAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={
          isCustomAuthenticated ? <Navigate to="/settings/subscription" replace /> : <Auth />
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
