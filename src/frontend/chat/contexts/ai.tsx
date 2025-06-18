import { useChat } from "@ai-sdk/react";
import { createContext, useContext } from "react";

type AIReturnType = ReturnType<typeof useChat>;
type AIParams = Parameters<typeof useChat>[0];

const AIContext = createContext<AIReturnType | null>(null);

interface AIProviderProps {
  children: React.ReactNode;
  config: AIParams;
}
export function AIProvider({ children, config }: AIProviderProps) {
  const chatState = useChat(config);
  return (
    <AIContext.Provider value={{ ...chatState }}>
      {children}
    </AIContext.Provider>
  );
}

export function useChatAI(): AIReturnType {
  const context = useContext(AIContext);

  if (context === undefined)
    throw new Error("useChatAI must be used within a AIProvider");

  return context!
}
