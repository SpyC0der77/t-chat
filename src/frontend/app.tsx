import { Route, BrowserRouter, Routes, Navigate } from 'react-router';
import Auth from '@/frontend/auth';
import Home from '@/frontend/home';
import Chat from '@/frontend/chat';
import AuthComplete from '@/frontend/auth-complete';
import ChatProvider from '@/frontend/chat/components/chat-provider';
import { AuthProvider, useCustomAuth } from '@/frontend/chat/contexts/auth';

function AppRoutes() {
  const { isAuthenticated: isCustomAuthenticated } = useCustomAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          isCustomAuthenticated ? <Navigate to="/" replace /> : <Auth />
        } />
        <Route path="/auth/complete" element={<AuthComplete />} />
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
