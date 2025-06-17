import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LogoWithNewChat } from "@/components/logo"
import SearchThread from "@/frontend/chat/components/search-thread"
import Thread from "@/frontend/chat/components/thread"
import { User } from "@/frontend/chat/components/user"



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
      <SidebarFooter className="m-0 pt-0">
        <User />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

