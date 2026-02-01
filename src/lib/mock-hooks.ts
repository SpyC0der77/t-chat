// Mock hooks to replace Convex hooks
import { useState, useEffect, useCallback } from 'react';
import { mockDataStore, type Thread, type Message, type User } from './mock-data';

// Mock useQuery hook
export function useQuery<T>(
  queryFn: (args?: any) => T | Promise<T>,
  args?: any
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    // Handle 'skip' case
    if (args === 'skip') {
      setData(undefined);
      return;
    }
    
    const result = queryFn(args);
    if (result instanceof Promise) {
      result.then(setData);
    } else {
      setData(result);
    }
  }, [queryFn, JSON.stringify(args)]);

  return data;
}

// Mock useMutation hook
export function useMutation<TArgs extends any[], TReturn>(
  mutationFn: ((...args: TArgs) => TReturn | Promise<TReturn>) | (() => TReturn | Promise<TReturn>)
) {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (...args: TArgs): Promise<TReturn> => {
    setIsLoading(true);
    try {
      // Handle both functions with and without arguments
      const result = args.length > 0 
        ? await (mutationFn as (...args: TArgs) => TReturn | Promise<TReturn>)(...args)
        : await (mutationFn as () => TReturn | Promise<TReturn>)();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn]);

  return mutate;
}

// Mock Convex auth hooks
export function useConvexAuth() {
  return {
    isAuthenticated: true,
    isLoading: false,
  };
}

export function useConvex() {
  return {
    query: async (queryFn: (args?: any) => any, args?: any) => {
      return queryFn(args);
    },
  };
}

// Mock API object
export const api = {
  auth: {
    getCurrentUser: () => {
      return mockDataStore.getCurrentUser();
    },
  },
  thread: {
    createThread: () => {
      return mockDataStore.createThread();
    },
    getThreadsByUser: (args: { userId: string }) => {
      return mockDataStore.getThreadsByUser(args.userId);
    },
    updatethread: (args: {
      threadId: string;
      userId: string;
      title?: string;
      status?: "pending" | "generating" | "completed" | "failed";
      lastmessageat?: number;
    }) => {
      return mockDataStore.updateThread(args.threadId, {
        title: args.title,
        status: args.status,
        lastmessageat: args.lastmessageat,
      });
    },
    makeThreadPinned: (args: {
      threadId: string;
      pinned: boolean;
      userId: string;
    }) => {
      return mockDataStore.makeThreadPinned(args.threadId, args.pinned);
    },
    deleteThread: (args: {
      threadId: string;
      userId: string;
    }) => {
      return mockDataStore.deleteThread(args.threadId);
    },
  },
  message: {
    createMessage: (args: {
      threadId: string;
      userId?: string;
      content: string;
      role: "user" | "assistant";
      status: "waiting" | "thinking" | "streaming" | "done" | "error" | "error.rejected" | "deleted";
      modal?: string;
    }) => {
      return mockDataStore.createMessage(args);
    },
    updateMessage: (args: {
      messageId: string;
      content: string;
      status: "waiting" | "thinking" | "streaming" | "done" | "error" | "error.rejected" | "deleted";
    }) => {
      return mockDataStore.updateMessage(args.messageId, args.content, args.status);
    },
    getMessageByThreadId: (args: { threadId: string }) => {
      return mockDataStore.getMessagesByThreadId(args.threadId);
    },
  },
};
