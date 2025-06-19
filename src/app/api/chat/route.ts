import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText, smoothStream, streamText } from 'ai';
import { fetchMutation } from "convex/nextjs";
import { api } from '../../../../convex/_generated/api';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    system: `You are an AI assistant specialized in generating concise, descriptive, and engaging titles for chat messages. Your task is to extract the main theme or topic from the user's chat history and provide a single, natural-language title that accurately reflects the conversation.

**IMPORTANT OUTPUT INSTRUCTIONS:**
1.  **Strictly plain text:** The title must be a single string of plain text.
2.  **No formatting:** Do NOT use any special characters like asterisks (*), hyphens (-), newlines (\\n), bullet points, or quotation marks (").
3.  **Concise:** Keep the title brief, ideally between 3-7 words.
4.  **Descriptive:** The title should clearly indicate the chat's content.
5.  **Direct Output:** Provide ONLY the title. Do not add any introductory phrases (e.g., "The title is:") or concluding remarks.`,
    prompt: `Write a title for the thread with the following messages: ${messages}`,
  });
  await fetchMutation(api.thread.updatethread, {
    threadId,
    userId,
    title: text,
    lastmessageat: updatedAt,
    status: "completed",
  });
}

export async function POST(req: Request) {
  try {
    const { messages, threadId, userId, model: modal } = await req.json();

    const assistantMessageId = await fetchMutation(api.message.createMessage, {
      threadId,
      userId,
      content: "",
      status: "thinking",
      role: "assistant",
      modal: modal,
    });

    console.log("assistantMessageId", assistantMessageId);
    let accumulatedContent = "";
    let lastUpdate = Date.now();


    const modelRegistry = {
      "gpt-4": { provider: "openai", modelId: "gpt-4" },
      "gpt-4o": { provider: "openai", modelId: "gpt-4o" },
      "gpt-3.5-turbo": { provider: "openai", modelId: "gpt-3.5-turbo" },
      "gemini-2.0": { provider: "google", modelId: "gemini-2.0-flash" },
      "gemini-2.5": { provider: "google", modelId: "gemini-2.5-pro-preview-05-06" },
    };
    //@ts-ignore
    const model = modelRegistry[modal];
    const result = streamText({
      //model: google('gemini-2.0-flash'),
      model: model.provider === 'google' ? google(model.modelId) : openai(model.modelId),
      //model: google('gemini-2.5-pro-preview-05-06'),
      maxRetries: 5,
      messages,
      maxSteps: 5,
      experimental_continueSteps: true,
      experimental_transform: smoothStream(),
      onChunk: async ({ chunk }) => {
        if (chunk.type === 'text-delta') {
          accumulatedContent += chunk.textDelta;
          if (Date.now() - lastUpdate > 500) {
            await fetchMutation(api.message.updateMessage, {
              messageId: assistantMessageId!,
              content: accumulatedContent,
              status: "streaming",
            });
            lastUpdate = Date.now();
          }
        }
      },
      onFinish: async ({ text }) => {
        const updatedAt = await fetchMutation(api.message.updateMessage, {
          messageId: assistantMessageId!,
          content: accumulatedContent,
          status: "done",
        });
        generateTitle({
          messages: text,
          threadId,
          userId,
          updatedAt
        });
      },
    });

    return result.toDataStreamResponse();
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
