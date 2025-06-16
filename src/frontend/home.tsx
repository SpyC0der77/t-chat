import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/components/icon"
import BgGradient from "@/components/bg-gradient"
import SidebarNav from "@/components/sidebar-navigation"
import { CollapsibleContent } from "@radix-ui/react-collapsible"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"

// Initial conversation history
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
      {
        id: "t3",
        title: "Frontend Bug Analysis",
        lastMessage:
          "I found the issue - we need to handle the null state in the user profile component.",
        timestamp: new Date().setHours(new Date().getHours() - 8),
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
      {
        id: "y3",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y4",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y5",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 2),
      },
      {
        id: "y6",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "y7",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 4),
      },
      {
        id: "y8",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
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
      {
        id: "w3",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 6),
      },
      {
        id: "w4",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 7),
      },
      {
        id: "w5",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 8),
      },
      {
        id: "w6",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 9),
      },
      {
        id: "w7",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 10),
      },
      {
        id: "w8",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 11),
      },
      {
        id: "w9",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 12),
      },
      {
        id: "w10",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 13),
      },
      {
        id: "w11",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 14),
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
      {
        id: "m2",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 16),
      },
      {
        id: "m3",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 17),
      },
      {
        id: "m4",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 18),
      },
      {
        id: "m5",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 19),
      },
      {
        id: "m6",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 20),
      },
      {
        id: "m7",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 21),
      },
      {
        id: "m8",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 22),
      },
      {
        id: "m9",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 23),
      },
      {
        id: "m10",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 24),
      }
    ],
  },
]

// Initial chat messages
const initialMessages = [
  {
    id: 1,
    role: "user",
    content: "Hello! Can you help me with a coding question?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Of course! I'd be happy to help with your coding question. What would you like to know?",
  },
  {
    id: 3,
    role: "user",
    content: "How do I create a responsive layout with CSS Grid?",
  },
  {
    id: 4,
    role: "assistant",
    content:
      "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
  },
]

function ChatSidebar() {
  return (
    <Sidebar className="z-50 border-none p-2">
      <SidebarHeader className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0">
        <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
          <Link className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground" href="/" data-discover="true">
            <div className="h-3.5 select-none">
              <Image
                alt="T4 Chat logo"
                loading="lazy"
                width="96"
                height="20"
                decoding="async"
                data-nimg="1"
                className="w-full h-full"
                src="/images/t4logo.svg"
                style={{ color: "transparent" }}
              />
            </div>
          </Link>
        </h1>
        <div className="px-1">
          <Button asChild className="w-full select-none bg-primary/20 font-semibold border-reflect button-reflect focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20">
            <Link href="/" >
              <span className="w-full select-none text-center">New Chat</span>
            </Link>
          </Button>
        </div>
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
                                  <div className="pointer-events-auto absolute -right-1 bottom-0 top-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
                                    <div className="pointer-events-none absolute bottom-0 right-[100%] top-0 h-12 w-8 bg-gradient-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100" />
                                    <button
                                      className="rounded-md p-1.5 hover:bg-muted/40"
                                      tabIndex={-1}
                                      data-action="pin-thread"
                                      aria-label="pin thread"
                                      data-state="closed">
                                      <Icon name="pin" className="size-4" />
                                    </button>
                                    <button
                                      className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground"
                                      tabIndex={-1}
                                      data-action="pin-thread"
                                      aria-label="pin thread"
                                      data-state="closed">
                                      <Icon name="delete" className="size-4" />
                                    </button>
                                  </div>
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
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function ChatContent() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { open } = useSidebar()

  const handleSubmit = () => {
    if (!prompt.trim()) return

    setPrompt("")
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: prompt.trim(),
    }

    setChatMessages([...chatMessages, newUserMessage])

    // Simulate API response
    setTimeout(() => {
      const assistantResponse = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: `This is a response to: "${prompt.trim()}"`,
      }

      setChatMessages((prev) => [...prev, assistantResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="flex min-h-svh flex-col overflow-hidden w-full relative transistion-[width,height]">
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
      <div className="absolute bottom-0 top-0 w-full">
        <SettingNavSvg />
        <div className="pointer-events-none absolute bottom-0 z-10 w-full px-2">
          <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
            <div className="pointer-events-none">
              <div className="pointer-events-auto">
                <div
                  className="border-reflect rounded-t-[20px] bg-[--chat-input-background] p-2 pb-0 backdrop-blur-lg ![--c:--chat-input-gradient]"
                  style={{ "--gradientBorder-gradient": "linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max)); --start: #000000e0; --opacity: 1" } as React.CSSProperties}
                >
                  <form
                    className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 pt-3 text-secondary-foreground outline-8 outline-[hsl(var(--chat-input-gradient)/0.5)] pb-3 max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px" }}
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-grow flex-col">
                      <div className="flex flex-grow flex-row  items-start">
                        <textarea
                          name="input"
                          id="chat-input"
                          placeholder="Type your message here nerd..."
                          aria-label="Message input"
                          aria-describedby="chat-input-description"
                          autoComplete="off"
                          className="w-full resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
                          style={{ height: "48px !important" }}
                        />
                        <div id="chat-input-description" className="sr-only">
                          Press Enter to send, Shift+Enter to new line
                        </div>
                      </div>
                      <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
                        <div className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2" aria-label="Message actions">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 w-9 relative rounded-lg p-2 text-pink-50"
                          >
                            <Icon name="send" className="!size-5" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
                          <div className="ml-[-7px] flex items-center gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 text-xs gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
                            >
                              Gemini 2.5 Flash
                              <Icon name="models" />
                            </Button>
                            <Button
                              variant="outline"
                              className="text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
                            >
                              <Icon name="web" />
                              Search
                            </Button>
                            <Button
                              variant={"outline"}
                              className="text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
                            >
                              <Icon name="media" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
          <SettingNav />
        </div>
      </div>
    </main>
  )
}

export default function FullChatApp() {
  return (
    <SidebarProvider>
      <BgGradient />
      <ChatSidebar />
      <SidebarNav />
      <ChatContent />
    </SidebarProvider>
  )
}
