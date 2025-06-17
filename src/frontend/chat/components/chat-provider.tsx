import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import BgGradient from "@/components/bg-gradient"
import SidebarNav from "@/components/sidebar-navigation"
import ChatSidebar from "@/frontend/chat/components/chat-sidebar"
import { Outlet } from "react-router"

export default function ChatProvider({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <BgGradient />
      <ChatSidebar />
      <SidebarNav />
      {children || <Outlet />}
    </SidebarProvider>
  )
}
