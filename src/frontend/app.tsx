import { useRef } from "react";
import { Route, BrowserRouter, Routes } from "react-router";
import Home from "@/frontend/home";
import { SidebarProvider, useSidebar, Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import BgGradient from "@/components/bg-gradient";
import { SettingNavSvg } from "@/components/setting-navigation";
import { cn } from "@/lib/utils";
import { LogoWithNewChat } from "@/components/logo";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

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

function SidebarNav() {
  const { open } = useSidebar();
  return (
    <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 top-2">
      <div className={cn(
        "duration-250 pointer-events-none absolute inset-0 right-auto -z-10 w-10 rounded-md bg-transparent backdrop-blur-sm transition-[background-color,width] delay-0 max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50",
        !open && "delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar"
      )}
      />
      <SidebarTrigger className="rounded-md text-muted-foreground" />
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-8 rounded-md text-muted-foreground duration-150 translate-x-0 opacity-100 delay-150",
          open && "sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150"
        )}
      >
        <Icon name="search" />
        <span className="sr-only">Search</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={cn(
          "size-8 rounded-md text-muted-foreground duration-150 translate-x-0 opacity-100 delay-150",
          open && "sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150"
        )}
      >
        <Link to="/">
          <Icon name="newThread" />
          <span className="sr-only">New Thread</span>
        </Link>
      </Button>
    </div>
  )
}

function TopbarDecoration() {
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        "absolute inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5",
        !open && "-translate-y-[15px] border-transparent"
      )}
    >
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden" />
      <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden" />
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
