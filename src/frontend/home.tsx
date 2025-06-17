import { Button } from "@/components/ui/button"
import {
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { Icon } from "@/components/icon"
import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"

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
          <SettingNavSvg className="z-20 h-16 w-20" />
          <SettingNav />
        </div>
      </div>
    </main>
  )
}

export default function FullChatApp() {
  return (
    <ChatContent />
  )
}
