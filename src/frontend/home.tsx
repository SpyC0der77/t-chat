import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"
import ChatPrompt, { DRAFT_KEY } from "@/frontend/chat/components/chat-prompt"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { Icon } from "@/components/icon";
import { IconType } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { useChat } from "@ai-sdk/react";
import { useMutation, useQuery } from "@/lib/mock-hooks";
import { api } from "@/lib/mock-hooks";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useChatAI } from "./chat/contexts/model";
import { useCustomAuth } from "./chat/contexts/auth";

const promptSuggestions: Record<string, { title: string, icon: IconType, prompts: string[] }> = {
  create: {
    title: "Create",
    icon: "create",
    prompts: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives ",
      "Give me 5 creative writing prompts for flash fiction "
    ]
  },
  explore: {
    title: "Explore",
    icon: "explore",
    prompts: [
      "Good books for fans of Rick Rubin ",
      "Countries ranked by number of corgis ",
      "Most successful companies in the world ",
      "How much does Claude cost? ",
    ]
  },
  code: {
    title: "Code",
    icon: "code",
    prompts: [
      "Write code to invert a binary search tree in Python ",
      "What's the difference between Promise.all and Promise.allSettled? ",
      "Explain React's useEffect cleanup function ",
      "Best practices for error handling in async/await ",
    ]
  },
  learn: {
    title: "Learn",
    icon: "learn",
    prompts: [
      "Beginner's guide to TypeScript ",
      "Explain the CAP theorem in distributed systems ",
      "Why is AI so expensive? ",
      "Are black holes real? ",
    ]
  }
};

export default function ChatContent() {
  const createThread = useMutation(api.thread.createThread);
  const createMessage = useMutation(api.message.createMessage);
  const user = useQuery(api.auth.getCurrentUser);
  const { model } = useChatAI();
  const [createThreadId, setCreateThreadId] = useState<string | null>(null);
  const { isAuthenticated, session } = useCustomAuth();
  const navigate = useNavigate();
  const [_, setDraft] = useLocalStorage<string>(DRAFT_KEY, "");

  const { setInput, input, append } = useChat({
    body: { userId: user?.userId!, threadId: createThreadId, model },
  });

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setDraft(prompt);
  };

  const handleAppend = async (message: string) => {
    if (!isAuthenticated) {
      return navigate('/auth');
    }
    const thread = await createThread();
    if (!thread) return;
    console.log("thread id", thread.threadId);
    setCreateThreadId(thread.threadId);
    await createMessage({
      threadId: thread.threadId,
      content: message,
      role: "user",
      status: "done",
    });
    append({
      role: "user",
      content: message,
    });
    navigate(`/chat/${thread.threadId}`);
  };

  return (
    <>
      <ChatPrompt
        input={input}
        setInput={setInput}
        append={handleAppend}
      />
      <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
        <SettingNavSvg className="z-20 h-16 w-20" />
        <SettingNav />
        <div role='log' aria-label='Chat messages' araia-live='polite' className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 py-10">
          <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
            <div
              className={cn(
                "w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8",
                input.length && "pointer-events-none opacity-0 animate-out fade-out-0 zoom-out-105"
              )}>
              <h2 className="text-3xl font-semibold">
                How can I help you
                {isAuthenticated && (", " + session!.name!.split(" ")[0])}
                ?
              </h2>
              <Tabs
                defaultValue={Object.keys(promptSuggestions)[0]}
                className="gap-6"
              >
                <TabsList className="gap-2.5 text-sm max-sm:justify-evenly bg-transparent p-0">
                  {Object.keys(promptSuggestions).map((key) => (
                    <TabsTrigger key={key} value={key}>
                      <Icon name={promptSuggestions[key].icon} className="max-sm:block" />
                      {promptSuggestions[key].title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.keys(promptSuggestions).map((key) => (
                  <TabsContent value={key} key={key}>
                    {promptSuggestions[key].prompts.map((prompt, index) => (
                      <div key={index} className="border-t border-secondary/40 py-1 first:border-none">
                        <button
                          onMouseDown={() => handlePromptClick(prompt)}
                          className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3 cusror-pointer"
                        >
                          <span>{prompt}</span>
                        </button>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
