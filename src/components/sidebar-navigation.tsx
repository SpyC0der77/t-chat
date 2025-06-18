import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export default function SidebarNav() {
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
