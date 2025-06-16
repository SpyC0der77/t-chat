import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SettingNavSvg() {
  const { open } = useSidebar();
  return (
    <div className="fixed right-0 top-0 max-sm:hidden z-10">
      <div
        className={cn(
          "group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy",
          !open && "-translate-y-3.5 scale-y-0"
        )}
        style={{ boxShadow: "10px -10px 8px 2px hsl(var(--gradient-noise-top))" }}
      >
        <svg
          className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible"
          version="1.1" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 32"
        >
          <line stroke="var(--gradient-noise-top)" strokeWidth="2px" shapeRendering="optimizeQuality" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeMiterlimit="10" x1="1" y1="0" x2="128" y2="0"></line>
          <path className="translate-y-[0.5px]" fill="var(--gradient-noise-top)" shapeRendering="optimizeQuality" strokeWidth="1px" strokeLinecap="round" strokeMiterlimit="10" vectorEffect="non-scaling-stroke" d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0" stroke="hsl(var(--chat-border))"></path>
        </svg>
      </div>
    </div>
  )
}

export function SettingNav() {
  const { open } = useSidebar();
  return (
    <div
      className="fixed right-2 top-2 z-20 max-sm:hidden"
      style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}
    >
      <div className={cn(
        "flex flex-row items-center text-muted-foreground gap-0.5 rounded-md p-1 transition-all bg-sidebar/50 backdrop-blur-sm blur-fallback:bg-sidebar",
        open && "rounded-bl-xl bg-gradient-noise-top"
      )}>
        <Button
          variant="ghost"
          tabIndex={-1}
          aria-label="Go to settings"
          asChild
          className={cn(
            "size-8",
            open && "rounded-bl-xl"
          )}
        >
          <Link href="/settings/customization">
            <Icon name="settings" className="size-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          tabIndex={-1}
        >
          <Icon name="moon" className="absolute size-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
          <Icon name="sun" className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  )
}
