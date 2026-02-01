// Mock data store to replace Convex backend

type GenerationStatus = "pending" | "generating" | "completed" | "failed";
type Visibility = "visible" | "archived";
type MessageStatus = "waiting" | "thinking" | "streaming" | "done" | "error" | "error.rejected" | "deleted";
type Role = "user" | "assistant";

export interface Thread {
  _id: string;
  _creationTime: number;
  threadId: string;
  userId: string;
  title: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  lastMessageAt: number;
  generationStatus: GenerationStatus;
  visibility: Visibility;
}

export interface Message {
  _id: string;
  _creationTime: number;
  messageId: string;
  threadId: string;
  userId: string;
  content: string;
  status: MessageStatus;
  role: Role;
  createdAt: number;
  updatedAt: number;
  modal: string;
}

export interface User {
  _id: string;
  userId: string;
  email: string;
  name: string;
  picture?: string;
}

class MockDataStore {
  private threads: Map<string, Thread> = new Map();
  private messages: Map<string, Message> = new Map();
  private users: Map<string, User> = new Map();
  private currentUserId: string | null = null;

  // Initialize with mock user
  constructor() {
    const mockUserId = "mock-user-1";
    const mockUser: User = {
      _id: "user-1",
      userId: mockUserId,
      email: "demo@example.com",
      name: "Demo User",
      picture: "",
    };
    this.users.set(mockUserId, mockUser);
    this.currentUserId = mockUserId;
  }

  // User methods
  getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.get(this.currentUserId) || null;
  }

  setCurrentUser(user: User | null) {
    if (user) {
      this.users.set(user.userId, user);
      this.currentUserId = user.userId;
    } else {
      this.currentUserId = null;
    }
  }

  // Thread methods
  createThread(): { id: string; threadId: string } | null {
    if (!this.currentUserId) return null;

    const threadId = crypto.randomUUID();
    const now = Date.now();
    const thread: Thread = {
      _id: `thread-${threadId}`,
      _creationTime: now,
      threadId,
      userId: this.currentUserId,
      title: "Nerding Title",
      pinned: false,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      generationStatus: "pending",
      visibility: "visible",
    };

    this.threads.set(threadId, thread);
    return { id: thread._id, threadId };
  }

  getThreadsByUser(userId: string): Thread[] {
    const userThreads = Array.from(this.threads.values())
      .filter(t => t.userId === userId && t.visibility === "visible")
      .sort((a, b) => b.updatedAt - a.updatedAt);
    
    const pinned = userThreads.filter(t => t.pinned);
    const unpinned = userThreads.filter(t => !t.pinned);
    
    return [...pinned, ...unpinned];
  }

  updateThread(threadId: string, updates: {
    title?: string;
    status?: GenerationStatus;
    lastmessageat?: number;
  }): number | null {
    const thread = Array.from(this.threads.values()).find(t => t.threadId === threadId);
    if (!thread) return null;

    if (thread.generationStatus === "completed") {
      return null;
    }

    const now = Date.now();
    if (updates.title) thread.title = updates.title;
    if (updates.status) thread.generationStatus = updates.status;
    if (updates.lastmessageat) thread.lastMessageAt = updates.lastmessageat;
    thread.updatedAt = now;

    this.threads.set(threadId, thread);
    return now;
  }

  makeThreadPinned(threadId: string, pinned: boolean): boolean {
    const thread = Array.from(this.threads.values()).find(t => t.threadId === threadId);
    if (!thread) return false;

    thread.pinned = pinned;
    thread.updatedAt = Date.now();
    this.threads.set(threadId, thread);
    return true;
  }

  deleteThread(threadId: string): boolean {
    const thread = Array.from(this.threads.values()).find(t => t.threadId === threadId);
    if (!thread) return false;

    thread.visibility = "archived";
    thread.updatedAt = Date.now();
    this.threads.set(threadId, thread);
    return true;
  }

  // Message methods
  createMessage(params: {
    threadId: string;
    userId?: string;
    content: string;
    role: Role;
    status: MessageStatus;
    modal?: string;
  }): string | null {
    const userId = params.userId || this.currentUserId;
    if (!userId) return null;

    const messageId = crypto.randomUUID();
    const now = Date.now();
    const message: Message = {
      _id: `msg-${messageId}`,
      _creationTime: now,
      messageId,
      threadId: params.threadId,
      userId,
      content: params.content,
      status: params.status,
      role: params.role,
      createdAt: now,
      updatedAt: now,
      modal: params.modal || '',
    };

    this.messages.set(messageId, message);
    return messageId;
  }

  updateMessage(messageId: string, content: string, status: MessageStatus): number {
    const message = Array.from(this.messages.values()).find(m => m.messageId === messageId);
    if (!message) throw new Error("Message not found");

    message.content = content;
    message.status = status;
    message.updatedAt = Date.now();
    this.messages.set(messageId, message);
    return message.updatedAt;
  }

  getMessagesByThreadId(threadId: string): Message[] {
    return Array.from(this.messages.values())
      .filter(m => m.threadId === threadId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }
}

// Singleton instance
export const mockDataStore = new MockDataStore();
