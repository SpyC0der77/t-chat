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

const conversationHistory = [
  {
    period: "Today",
    conversations: [
      {
        id: "t1",
        title: "Project roadmap discussion and you and me abnd you",
        lastMessage:
          "Let's prioritize the authentication features for the next sprint.",
        timestamp: new Date().setHours(new Date().getHours() - 2),
      },
      {
        id: "t2",
        title: "API Documentation Review",
        lastMessage:
          "The endpoint descriptions need more detail about rate limiting.",
        timestamp: new Date().setHours(new Date().getHours() - 5),
      },
    ],
  },
  {
    period: "Yesterday",
    conversations: [
      {
        id: "y1",
        title: "Database Schema Design",
        lastMessage:
          "Let's add indexes to improve query performance on these tables.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y2",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: "Last 7 days",
    conversations: [
      {
        id: "w1",
        title: "Authentication Flow",
        lastMessage: "We should implement the OAuth2 flow with refresh tokens.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "w2",
        title: "Component Library",
        lastMessage:
          "These new UI components follow the design system guidelines perfectly.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
    ],
  },
  {
    period: "Last month",
    conversations: [
      {
        id: "m1",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 15),
      },
    ],
  },
]

export default function Thread() {
  return (
    <ThreadWrapper>
      {conversationHistory.map((group) => (
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
  return (
    <div style={{
      overflowAnchor: 'none',
      flex: '0 0 auto',
      position: 'relative',
      visibility: 'hidden',
      width: '100%',
      height: '1328px'
    }}>
      <div style={{
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
