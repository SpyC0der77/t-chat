import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LogoWithNewChat } from "@/components/logo"
import SearchThread from "@/frontend/chat/components/search-thread"
import Thread from "@/frontend/chat/components/thread"



export default function ChatSidebar() {
  return (
    <Sidebar className="z-50 border-none p-2">
      <SidebarHeader className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0">
        <LogoWithNewChat />
        <SearchThread />
      </SidebarHeader>
      <SidebarContent className="small-scrollbar scroll-shadow relative pb-2">
        <Thread />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

