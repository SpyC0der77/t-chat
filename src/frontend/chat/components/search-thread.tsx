import { Icon } from "@/components/icon";

export default function SearchThread() {
  return (
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
  )
}
