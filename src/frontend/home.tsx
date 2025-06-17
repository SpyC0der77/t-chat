import { Button } from "@/components/ui/button"
import {
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Icon } from "@/components/icon"
import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"
import { useConvex, useConvexAuth } from "convex/react"
import { api } from "../../convex/_generated/api"
import { AUTH_COOKIE_NAME } from "@/hooks/use-custom-auth"
import ChatPrompt from "./chat/components/chat-prompt"

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
        <ChatPrompt />
        <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
          <SettingNavSvg className="z-20 h-16 w-20" />
          <SettingNav />
        </div>
      </div>
    </main>
  )
}

export default function FullChatApp() {
  const { isAuthenticated } = useConvexAuth();
  const convex = useConvex();

  useEffect(() => {
    async function getUser() {
      const user = (await convex.query(api.auth.getCurrentUser))!;
      const cookieObject = JSON.stringify({
        id: user.userId,
        name: user.name,
        picture: user.picture,
        email: user.email,
      });
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `${AUTH_COOKIE_NAME}=${cookieObject}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    }

    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated])

  return (
    <ChatContent />
  )
}
