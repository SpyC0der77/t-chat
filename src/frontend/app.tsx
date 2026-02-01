import { useRef } from "react";
import { Route, BrowserRouter, Routes } from "react-router";
import Home from "@/frontend/home";
import { SidebarProvider, useSidebar, Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import BgGradient from "@/components/bg-gradient";
import SidebarNav from "@/components/sidebar-navigation";
import TopbarDecoration from "@/components/topbar-decoration";
import { SettingNavSvg } from "@/components/setting-navigation";
import { cn } from "@/lib/utils";
import { LogoWithNewChat } from "@/components/logo";
import { Icon } from "@/components/icon";

const ThreadWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculateHeight = containerRef.current?.clientHeight || 500;
  return (
    <div
      style={{
        overflowAnchor: "none",
        flex: "0 0 auto",
        position: "relative",
        visibility: "hidden",
        width: "100%",
        height: `${calculateHeight}px`,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          visibility: "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
};

function ChatSidebar() {
  return (
    <Sidebar className="z-50 border-none p-2">
      <SidebarHeader className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0">
        <LogoWithNewChat />
        <div className="border-b border-chat-border px-3">
          <div className="flex items-center">
            <Icon name="search" className="-ml-[3px] mr-3 !size-4 text-muted-foreground" />
            <input
              role="searchbox"
              aria-label="Search threads"
              placeholder="Search your threads..."
              className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="small-scrollbar scroll-shadow relative pb-2">
        <ThreadWrapper>{/* Empty sidebar - no threads */}</ThreadWrapper>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function ChatBackground() {
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        "absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl",
        !open && "!translate-y-0 !rounded-none border-none"
      )}>
      <div className={cn(
        "bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]",
        !open && "translate-y-3.5"
      )} />
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <SidebarProvider defaultOpen={true}>
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
            </SidebarProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRoutes />;
}
