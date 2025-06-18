import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Icon } from "@/components/icon"
import { CollapsibleContent } from "@radix-ui/react-collapsible"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import ThreadAction from "@/frontend/chat/components/thread-action"
import { useCustomAuth } from "@/hooks/use-custom-auth"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useRef } from "react"

interface ThreadItem {
  _creationTime: number
  _id: string
  createdAt: number
  generationStatus: string
  lastMessageAt: number
  threadId: string
  title: string
  updatedAt: number
  userId: string
  visibility: string
}

// Define the type for the grouped conversations
interface GroupedConversation {
  period: string
  conversations: {
    id: string
    title: string
    lastMessage?: string // Assuming lastMessage is not always present in your raw data
    timestamp: number
  }[]
}

const groupThreadsByPeriod = (
  threads: ThreadItem[] | undefined
): GroupedConversation[] => {
  if (!threads) {
    return []
  }

  const now = new Date()
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  ).getTime()
  const last7Days = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6
  ).getTime() // Covers today and the last 6 days
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  ).getTime()

  const grouped: { [key: string]: GroupedConversation } = {
    Today: { period: "Today", conversations: [] },
    Yesterday: { period: "Yesterday", conversations: [] },
    "Last 7 days": { period: "Last 7 days", conversations: [] },
    "Last month": { period: "Last month", conversations: [] },
    Older: { period: "Older", conversations: [] }, // Add an "Older" category
  }

  // Sort threads by creation time in descending order
  const sortedThreads = [...threads].sort(
    (a, b) => b.createdAt - a.createdAt
  )

  sortedThreads.forEach((thread) => {
    const threadTimestamp = thread.createdAt

    const conversation = {
      id: thread.threadId,
      title: thread.title,
      // You might want to fetch the actual last message if available,
      // otherwise, you can leave it out or provide a placeholder.
      // For now, I'm omitting it as your input data doesn't contain it.
      timestamp: thread.lastMessageAt,
    }

    if (threadTimestamp >= today) {
      grouped.Today.conversations.push(conversation)
    } else if (threadTimestamp >= yesterday) {
      grouped.Yesterday.conversations.push(conversation)
    } else if (threadTimestamp >= last7Days) {
      grouped["Last 7 days"].conversations.push(conversation)
    } else if (threadTimestamp >= lastMonth) {
      grouped["Last month"].conversations.push(conversation)
    } else {
      grouped.Older.conversations.push(conversation)
    }
  })

  // Filter out empty groups and maintain order
  const orderedGroups: GroupedConversation[] = []
  if (grouped.Today.conversations.length > 0)
    orderedGroups.push(grouped.Today)
  if (grouped.Yesterday.conversations.length > 0)
    orderedGroups.push(grouped.Yesterday)
  if (grouped["Last 7 days"].conversations.length > 0)
    orderedGroups.push(grouped["Last 7 days"])
  if (grouped["Last month"].conversations.length > 0)
    orderedGroups.push(grouped["Last month"])
  if (grouped.Older.conversations.length > 0) orderedGroups.push(grouped.Older)

  return orderedGroups
}


export default function Thread() {
  const threads = useQuery(api.thread.getThreadsByUser)
  let groupedConversationHistory: GroupedConversation[] = []
  if (threads) {
    groupedConversationHistory = groupThreadsByPeriod(threads)
  }
  console.log("grouped threads", groupedConversationHistory)
  return (
    <ThreadWrapper>
      {groupedConversationHistory.map((group) => (
        <Collapsible
          key={group.period}
          title={group.period}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup key={group.period}>
            <SidebarGroupLabel className="select-none px-1.5 text-heading" asChild>
              <CollapsibleTrigger>
                <span>{group.period}</span>
                <Icon name="collapse" className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="text-sm">
                  {group.conversations.map((conversation) => (
                    <span className="select-none" key={conversation.id}>
                      <SidebarMenuItem>
                        <Link
                          className="group/link relative flex h-9 w-full items-center overflow-hidden rounded-lg px-2 py-1 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:focus-visible:bg-sidebar-accent"
                          href={`/chat/${conversation.id}`}
                        >
                          <div className="relative flex w-full items-center">
                            <input
                              aria-label="Thread title"
                              aria-describedby="thread-title-hint"
                              aria-readonly="true"
                              tabIndex={-1}
                              className="hover:truncate-none h-full w-full overflow-hidden rounded bg-transparent px-1 py-1 text-sm text-muted-foreground outline-none pointer-events-none cursor-pointer truncate"
                              title={conversation.title}
                              type="text"
                              readOnly={true}
                              value={conversation.title}
                            />
                            <ThreadAction threadId={conversation.id} />
                          </div>
                        </Link>
                      </SidebarMenuItem>
                    </span>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </ThreadWrapper>
  )
}

const ThreadWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const calculateHeight = containerRef.current?.clientHeight || 500;
  return (
    <div
      style={{
        overflowAnchor: 'none',
        flex: '0 0 auto',
        position: 'relative',
        visibility: 'hidden',
        width: '100%',
        height: `${calculateHeight}px`
      }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          visibility: 'visible',
        }}>
        {children}
      </div>
    </div>
  )
}
