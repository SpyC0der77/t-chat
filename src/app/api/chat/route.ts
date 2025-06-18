import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { smoothStream, streamText } from 'ai';
import { fetchMutation } from "convex/nextjs";
import { api } from '../../../../convex/_generated/api';
import { env } from "@/env"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
        console.log("chunk", chunk);
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
      onFinish: async ({ response }) => {
        await fetchMutation(api.message.updateMessage, {
          messageId: assistantMessageId!,
          content: accumulatedContent,
          status: "done",
        });
        fetch(`${env.NEXT_PUBLIC_APP_URL}/api/title`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: response.messages,
            threadId,
            userId
          })
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
