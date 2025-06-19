import { Route, BrowserRouter, Routes, Navigate } from 'react-router';
import Auth from '@/frontend/auth';
import ProtectedRoute from '@/components/protected';
import Home from '@/frontend/home';
import Chat from '@/frontend/chat';
import Setting from '@/frontend/setting';
import AuthComplete from '@/frontend/auth-complete';
import ChatProvider from '@/frontend/chat/components/chat-provider';
import { AuthProvider, useCustomAuth } from '@/frontend/chat/contexts/auth';

function AppRoutes() {
  const { isAuthenticated: isCustomAuthenticated } = useCustomAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          isCustomAuthenticated ? <Navigate to="/settings/subscription" replace /> : <Auth />
        } />
        <Route path="/auth/complete" element={<AuthComplete />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/settings/subscription" element={<Setting />} />
          <Route path="/settings" element={<Navigate to="/settings/subscription" replace />} />
        </Route>
        <Route element={<ChatProvider />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/chat" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
