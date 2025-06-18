import { createContext, useContext, useState } from "react";

const modelRegistry = {
  "gpt-4": { provider: "openai", modelId: "gpt-4" },
  "gpt-4o": { provider: "openai", modelId: "gpt-4o" },
  "gpt-3.5-turbo": { provider: "openai", modelId: "gpt-3.5-turbo" },
  "gemini-2.0": { provider: "google", modelId: "gemini-2.0-flash" },
  "gemini-2.5": { provider: "google", modelId: "gemini-2.5-pro-preview-05-06" },
};

interface AIContextType {
  model: string;
  handleModelChange: (key: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: React.ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [model, setModel] = useState<string>("gemini-2.0");

  const handleModelChange = (key: string) => {
    if (modelRegistry[key as keyof typeof modelRegistry]) {
      setModel(key);
    } else {
      console.warn(`Attempted to set an unknown model key: ${key}`);
    }
  };

  const contextValue = { model, handleModelChange };

  return (
    <AIContext.Provider value={contextValue} > {children} </AIContext.Provider>
  );
}

export function useChatAI() {
  const context = useContext(AIContext);

  if (context === undefined) {
    throw new Error("useChatAI must be used within an AIProvider");
  }

  return context;
}
