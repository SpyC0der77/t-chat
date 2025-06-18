import { Icon } from "@/components/icon";
import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"
import { Button } from "@/components/ui/button";
import ChatPrompt from "@/frontend/chat/components/chat-prompt"
import { useChatAI } from "@/frontend/chat/contexts/ai";
import { cn } from "@/lib/utils";
import { useState } from "react";

const messages = [
  {
    "id": "nShm74VY8DAykRg5",
    "createdAt": "2025-06-18T05:35:31.027Z",
    "role": "user",
    "content": "yooo",
    "parts": [
      {
        "type": "text",
        "text": "yooo"
      }
    ]
  },
  {
    "id": "msg-JrBkf5jW4fty4aBN5QxaFr0V",
    "createdAt": "2025-06-18T05:35:34.043Z",
    "role": "assistant",
    "content": "Yo! What's up? How can I help you today?\n",
    "parts": [
      {
        "type": "step-start"
      },
      {
        "type": "text",
        "text": "Yo! What's up? How can I help you today?\n"
      }
    ],
    "revisionId": "jg9kAScxmiVMrj2M"
  },
  {
    "id": "1m0diQ9ujMOMOUy8",
    "createdAt": "2025-06-18T05:35:59.515Z",
    "role": "user",
    "content": "give me a 5 line poem in hindi",
    "parts": [
      {
        "type": "text",
        "text": "give me a 5 line poem in hindi"
      }
    ]
  },
  {
    "id": "msg-nrjHZIJMc9Q8aSL5itY0g23I",
    "createdAt": "2025-06-18T05:36:01.644Z",
    "role": "assistant",
    "content": "Okay, here's a 5-line poem in Hindi:\n\nसूरज की किरणें, फैली हैं आज,\nनई उम्मीदों का, हुआ है आगाज़।\nदिल में उमंग है, आँखों में प्यार,\nखुशियों से भर दे, ये संसार।\nज़िन्दगी का हर पल, है एक साज।\n\n**(Translation):**\n\nThe sun's rays, have spread today,\nA new hope, has begun.\nThere's enthusiasm in the heart, love in the eyes,\nFill this world with happiness.\nEvery moment of life, is a melody.\n",
    "parts": [
      {
        "type": "step-start"
      },
      {
        "type": "text",
        "text": "Okay, here's a 5-line poem in Hindi:\n\nसूरज की किरणें, फैली हैं आज,\nनई उम्मीदों का, हुआ है आगाज़।\nदिल में उमंग है, आँखों में प्यार,\nखुशियों से भर दे, ये संसार।\nज़िन्दगी का हर पल, है एक साज।\n\n**(Translation):**\n\nThe sun's rays, have spread today,\nA new hope, has begun.\nThere's enthusiasm in the heart, love in the eyes,\nFill this world with happiness.\nEvery moment of life, is a melody.\n"
      }
    ],
    "revisionId": "t8sPKBoxV1qXKc6i"
  }
]

type Role = "user" | "assistant";
export default function ChatContent() {
  const { setInput, input } = useChatAI();

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };
  return (
    <>
      <ChatPrompt />
      <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
        <SettingNavSvg className="z-20 h-16 w-20" />
        <SettingNav />
        <div role='log' aria-label='Chat messages' araia-live='polite' className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 py-10">
          {messages.map(message => (
            <Message
              key={message.id}
              message={message.content}
              messageId={message.id}
              role={message.role as Role}
            />
          ))}
        </div>
      </div>
    </>
  )
}

interface MessageProps {
  message: string;
  messageId: string;
  role: 'user' | 'assistant';
  model?: string;
}

const Message = ({ message, messageId, role, model }: MessageProps) => {
  const isUser = role === 'user';

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div
      data-message-id={messageId}
      className={cn(
        "flex justify-start",
        isUser && "justify-end"
      )}>
      <div
        role="article"
        aria-label={isUser ? "Your message" : "Assistant message"}
        className={cn(
          "group relative inline-block break-words",
          isUser && "border border-secondary/50 bg-secondary/50 max-w-[80%] rounded-xl px-4 py-3 text-left",
          !isUser && "w-full max-w-full"
        )}>
        <span className="sr-only">{isUser ? "Your message: " : "Assistant Reply: "}</span>
        <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        <div className={cn(
          "absolute mt-2 -ml-0.5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
          isUser && "right-0 mt-5 ml-0",
          !isUser && "left-0"
        )}>
          <Button
            variant={"ghost"}
            className="text-xs h-8 w-8 rounded-lg p-0"
            aria-label="Copy messsage"
            onClick={handleCopy}
          >
            <div className="relative size-4">
              <Icon
                name="copy"
                className={cn(
                  "absolute inset-0 transition-all duration-200 ease-snappy scale-100 opacity-100",
                  isCopied && "scale-0 opacity-0"
                )}
              />
              <Icon
                name="check"
                className={cn(
                  "absolute inset-0 transition-all duration-200 ease-snappy scale-0 opacity-0",
                  isCopied && "scale-100 opacity-100"
                )}
              />
            </div>
          </Button>
          {!isUser && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{model}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
