// Mock API route - returns mock streaming responses for UI demo purposes
import { api } from '@/lib/mock-hooks';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = 'edge';

// Mock title generation
async function generateTitle({
  messages,
  threadId,
  userId,
  updatedAt,
}: {
  messages: string,
  threadId: string,
  userId: string,
  updatedAt: number,
}) {
  // Mock title generation - extract first few words from user message
  const userMessage = messages.split('\n').find(line => line.includes('user:'));
  const title = userMessage 
    ? userMessage.split(':').slice(1).join(':').trim().split(' ').slice(0, 5).join(' ') || 'New Chat'
    : 'New Chat';
  
  api.thread.updatethread({
    threadId,
    userId,
    title,
    lastmessageat: updatedAt,
    status: "completed",
  });
}

// Mock streaming response generator
async function* generateMockStream(text: string): AsyncGenerator<string> {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    yield (i === 0 ? '' : ' ') + words[i];
  }
}

export async function POST(req: Request) {
  try {
    const { messages, threadId, userId, model: modal } = await req.json();

    const assistantMessageId = api.message.createMessage({
      threadId,
      userId,
      content: "",
      status: "thinking",
      role: "assistant",
      modal: modal,
    });

    // Generate mock response based on user message
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || '';
    
    const mockResponses = [
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's my perspective on this topic.",
      "Great question! Based on what you've shared, I'd say that this is a complex topic with many facets.",
      "Thanks for asking! This is something I can help you explore further.",
      "I appreciate you bringing this up. Let me provide some insights on this matter.",
    ];
    const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Create a mock streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let accumulatedContent = "";
        
        // Send initial thinking status
        controller.enqueue(encoder.encode(`0:"${JSON.stringify({ type: 'text-delta', textDelta: '' })}"\n`));
        
        // Stream the response word by word
        for await (const chunk of generateMockStream(mockResponse)) {
          accumulatedContent += chunk;
          const data = JSON.stringify({ type: 'text-delta', textDelta: chunk });
          controller.enqueue(encoder.encode(`0:"${data}"\n`));
          
          // Update message periodically
          if (accumulatedContent.length % 20 === 0) {
            api.message.updateMessage({
              messageId: assistantMessageId!,
              content: accumulatedContent,
              status: "streaming",
            });
          }
        }

        // Final update
        const updatedAt = api.message.updateMessage({
          messageId: assistantMessageId!,
          content: accumulatedContent,
          status: "done",
        });

        // Generate title
        generateTitle({
          messages: lastUserMessage,
          threadId,
          userId,
          updatedAt
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });
  } catch (e) {
    console.log(e);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
