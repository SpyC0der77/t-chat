import { Route, BrowserRouter, Routes } from "react-router";
import Home from "@/frontend/home";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/frontend/chat/contexts/auth";
import BgGradient from "@/components/bg-gradient";
import SidebarNav from "@/components/sidebar-navigation";
import ChatSidebar from "@/frontend/chat/components/chat-sidebar";
import ChatBackground from "@/frontend/chat/components/chat-background";
import TopbarDecoration from "@/components/topbar-decoration";
import { SettingNavSvg } from "@/components/setting-navigation";
import { AIProvider } from "@/frontend/chat/contexts/model";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <SidebarProvider defaultOpen={true}>
              <AIProvider>
                <BgGradient />
                <ChatSidebar />
                <SidebarNav />
                <main className="flex min-h-svh flex-col overflow-hidden w-full relative transistion-[width,height]">
                  <ChatBackground />
                  <TopbarDecoration />
                  <div className="absolute bottom-0 top-0 w-full">
                    <SettingNavSvg />
                    <Home />
                  </div>
                </main>
              </AIProvider>
            </SidebarProvider>
          } 
        />
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
