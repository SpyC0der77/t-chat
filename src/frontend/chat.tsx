import { Icon } from "@/components/icon";
import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"
import { Button } from "@/components/ui/button";
import ChatPrompt from "@/frontend/chat/components/chat-prompt"
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@/lib/mock-hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "@/lib/mock-hooks";
import { useChat } from "@ai-sdk/react";
import { useChatAI } from "./chat/contexts/model";

type Role = "user" | "assistant";
export default function ChatContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { model } = useChatAI();
  const user = useQuery(api.auth.getCurrentUser);
  const createMessage = useMutation(api.message.createMessage);
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const dbMessages = useQuery(
    api.message.getMessageByThreadId,
    id ? { threadId: id } : 'skip',
  ) || [];

  const initialMessages = useMemo(
    () =>
      (dbMessages || []).map((m) => ({
        id: m.messageId,
        role: m.role as Role,
        content: m.content,
        modal: m.modal,
      })),
    [dbMessages]
  );

  const { input, setInput, append, messages } = useChat({
    initialMessages,
    body: { threadId: id!, userId: user?.userId!, model },
  });

  const handleAppend = async (message: string) => {
    let threadId = id;
    if (!threadId) {
      return navigate('/');
    }
    await createMessage({
      threadId: threadId,
      content: message,
      role: "user",
      status: "done",
    });
    append({
      role: "user",
      content: message,
    });
    if (!id) {
      navigate(`/chat/${id}`);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <>
      <ChatPrompt
        input={input}
        setInput={setInput}
        append={handleAppend}
      />
      <div ref={chatContainerRef} className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
        <SettingNavSvg className="z-20 h-16 w-20" />
        <SettingNav />
        <div role='log' aria-label='Chat messages' araia-live='polite' className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 py-10">
          {messages.map(message => {
            return (
              <Message
                key={message.id}
                message={message.content}
                messageId={message.id}
                role={message.role as Role}
                //@ts-ignore
                model={message?.modal! || ""}
              />
            )
          })}
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
