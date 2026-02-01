// Mock useChat hook to replace @ai-sdk/react useChat
import { useState, useCallback, useEffect } from 'react';
import { api } from './mock-hooks';

type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  content: string;
  modal?: string;
}

interface UseChatOptions {
  initialMessages?: Message[];
  body?: {
    threadId?: string;
    userId?: string;
    model?: string;
  };
  api?: string;
}

interface UseChatReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  append: (message: { role: Role; content: string }) => Promise<void>;
  isLoading: boolean;
}

// Mock streaming response generator
async function* generateMockStream(text: string): AsyncGenerator<string> {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
    yield (i === 0 ? '' : ' ') + words[i];
  }
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const append = useCallback(async (message: { role: Role; content: string } | string) => {
    // Handle both object and string formats
    const messageObj = typeof message === 'string' 
      ? { role: 'user' as Role, content: message }
      : message;
    
    if (!messageObj.content.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: messageObj.role,
      content: messageObj.content,
    };
    setMessages(prev => [...prev, userMessage]);

    // Only create assistant response for user messages
    if (messageObj.role === 'user') {
      // Create assistant message placeholder
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        modal: options.body?.model || 'gemini-2.0',
      };
      setMessages(prev => [...prev, assistantMessage]);

      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock response
      const mockResponses = [
        "That's an interesting question! Let me think about that...",
        "I understand what you're asking. Here's my perspective on this topic.",
        "Great question! Based on what you've shared, I'd say that this is a complex topic with many facets.",
        "Thanks for asking! This is something I can help you explore further.",
        "I appreciate you bringing this up. Let me provide some insights on this matter.",
      ];
      const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Simulate streaming response
      let accumulatedContent = '';
      for await (const chunk of generateMockStream(mockResponse)) {
        accumulatedContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: accumulatedContent }
            : msg
        ));
      }

      // Update message in mock store if threadId is provided
      if (options.body?.threadId && options.body?.userId) {
        // Create user message in store
        api.message.createMessage({
          threadId: options.body.threadId,
          userId: options.body.userId,
          content: messageObj.content,
          role: 'user',
          status: 'done',
        });

        // Create assistant message in store
        api.message.createMessage({
          threadId: options.body.threadId,
          userId: options.body.userId,
          content: accumulatedContent,
          role: 'assistant',
          status: 'done',
          modal: options.body.model,
        });

        // Update thread title if needed
        api.thread.updatethread({
          threadId: options.body.threadId,
          userId: options.body.userId,
          status: 'completed',
          lastmessageat: Date.now(),
        });
      }

      setIsLoading(false);
    }
  }, [options.body]);

  return {
    messages,
    input,
    setInput,
    append,
    isLoading,
  };
}
