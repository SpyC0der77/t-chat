import { Route, BrowserRouter, Routes, Navigate } from 'react-router';
import Auth from './auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Landing Page - Hello World</h1>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings/subscription" element={<h1>Subscription Page - Hello World</h1>} />
        <Route path="/settings" element={<Navigate to="/settings/subscription" replace />} />
        <Route path="/chat/:id" element={<h1>Chat Page - Hello World</h1>} />
        <Route path="/chat" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
