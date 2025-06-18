import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function ChatBackground() {
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
