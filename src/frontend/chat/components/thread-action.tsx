import { Icon } from "@/components/icon"

export default function ThreadAction({ threadId }: { threadId: string }) {
  const handlePinThread = () => {
    console.log("pin thread", threadId)
    //TODO: pin thread
  }

  const handleDeleteThread = () => {
    console.log("delete thread", threadId)
    //TODO: delete thread and try shift delete as well
  }

  return (
    <div className="pointer-events-auto absolute -right-1 bottom-0 top-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
      <div className="pointer-events-none absolute bottom-0 right-[100%] top-0 h-12 w-8 bg-gradient-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100" />
      <button
        className="rounded-md p-1.5 hover:bg-muted/40"
        tabIndex={-1}
        data-action="pin-thread"
        aria-label="pin thread"
        data-state="closed"
        onMouseDown={handlePinThread}
      >
        <Icon name="pin" className="size-4" />
      </button>
      <button
        className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground"
        tabIndex={-1}
        data-action="pin-thread"
        aria-label="pin thread"
        data-state="closed"
        onMouseDown={handleDeleteThread}
      >
        <Icon name="delete" className="size-4" />
      </button>
    </div>
  )
}

