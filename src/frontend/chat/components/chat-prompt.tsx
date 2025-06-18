import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { useLocalStorage } from "usehooks-ts";
//import { useMutation } from "convex/react";
//import { api } from "../../../../convex/_generated/api";
import { useChatAI } from "@/frontend/chat/contexts/ai";
import { useEffect, useRef } from "react";

const DRAFT_KEY = "draft_prompt";

export default function ChatPrompt() {
  const formRef = useRef<HTMLFormElement>(null);
  const { input, setInput, append } = useChatAI();
  //const createThread = useMutation(api.thread.createThread);
  const [draft, setDraft, removeDraft] = useLocalStorage<string>(DRAFT_KEY, "");

  useEffect(() => {
    setInput(draft);
  }, [])
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim().length === 0) return;
    //const id = await createThread();
    //console.log("thread id", id);
    //append({
    //  role: "user",
    //  content: input,
    //});
    removeDraft();
    setInput("");
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value.trim());
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  return (
    <PromptWrapper>
      <form
        ref={formRef}
        className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 pt-3 text-secondary-foreground outline-8 outline-[hsl(var(--chat-input-gradient)/0.5)] pb-3 max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px" }}
        onSubmit={submitHandler}
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
              value={input || draft || ""}
              onChange={changeHandler}
              onKeyDown={handleKeyDown}
            />
            <div id="chat-input-description" className="sr-only">
              Press Enter to send, Shift+Enter to new line
            </div>
          </div>
          <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
            <SendButton />
            <PromptActions />
          </div>
        </div>
      </form>
    </PromptWrapper>
  )
}

const SendButton = () => {
  const [draft] = useLocalStorage<string>(DRAFT_KEY, "");
  return (
    <div className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2" aria-label="Message actions">
      <Button
        variant="ghost"
        size="icon"
        className="border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 w-9 relative rounded-lg p-2 text-pink-50"
        disabled={draft.trim().length === 0}
      >
        <Icon name="send" className="!size-5" />
      </Button>
    </div>
  )
}

const PromptActions = () => {
  return (
    <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
      <div className="ml-[-7px] flex items-center gap-1">
        <Button
          variant="ghost"
          type="button"
          className="h-8 text-xs gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
        >
          Gemini 2.5 Flash
          <Icon name="models" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
        >
          <Icon name="web" />
          Search
        </Button>
        <Button
          variant={"outline"}
          type="button"
          className="text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
        >
          <Icon name="media" />
        </Button>
      </div>
    </div>
  )
}

const PromptWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pointer-events-none absolute bottom-0 z-10 w-full px-2">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
        <div className="pointer-events-none">
          <div className="pointer-events-auto">
            <div
              className="border-reflect rounded-t-[20px] bg-(--chat-input-background) p-2 pb-0 backdrop-blur-lg ![--c:--chat-input-gradient]"
              style={{
                "--gradientBorder-gradient": "linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max))",
                "--start": "#000000e0",
                "--opacity": 1
              } as React.CSSProperties}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
