import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function TopbarDecoration() {
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
