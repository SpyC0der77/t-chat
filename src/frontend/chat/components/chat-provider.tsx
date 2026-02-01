import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import BgGradient from "@/components/bg-gradient"
import SidebarNav from "@/components/sidebar-navigation"
import ChatSidebar from "@/frontend/chat/components/chat-sidebar"
import ChatBackground from "@/frontend/chat/components/chat-background"
import TopbarDecoration from "@/components/topbar-decoration"
import { SettingNavSvg } from "@/components/setting-navigation"
import { Outlet } from "react-router"

export default function ChatProvider({ children }: { children?: React.ReactNode }) {

  return (
    <SidebarProvider defaultOpen={true}>
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
    </SidebarProvider>
  )
}
