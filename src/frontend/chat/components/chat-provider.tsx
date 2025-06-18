import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import BgGradient from "@/components/bg-gradient"
import SidebarNav from "@/components/sidebar-navigation"
import ChatSidebar from "@/frontend/chat/components/chat-sidebar"
import ChatBackground from "@/frontend/chat/components/chat-background"
import TopbarDecoration from "@/components/topbar-decoration"
import { SettingNavSvg } from "@/components/setting-navigation"
import { useEffect } from "react"
import { useConvex, useConvexAuth } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { AUTH_COOKIE_NAME } from "@/hooks/use-custom-auth"
import { Outlet } from "react-router"
import { AIProvider } from "@/frontend/chat/contexts/ai"

export default function ChatProvider({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const convex = useConvex();

  useEffect(() => {
    async function getUser() {
      const user = (await convex.query(api.auth.getCurrentUser))!;
      const cookieObject = JSON.stringify({
        id: user.userId,
        name: user.name,
        picture: user.picture,
        email: user.email,
      });
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `${AUTH_COOKIE_NAME}=${cookieObject}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    }

    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated])

  return (
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
            {children || <Outlet />}
          </div>
        </main>
      </AIProvider>
    </SidebarProvider>
  )
}
