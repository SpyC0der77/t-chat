import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { fetchMutation } from "convex/nextjs";
import { api } from '../../../../convex/_generated/api';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, threadId, userId } = await req.json();
    console.log("messages", threadId, userId);
    console.log("generating title");

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: "You are a title generator which will give title of less then 10 words it can be 2 or 3 as well. So based on the prompts below generate title for the thread.",
      maxRetries: 5,
      messages,
      maxSteps: 5,
      experimental_continueSteps: true,
    });

    fetchMutation(api.thread.updatethread, {
      threadid: threadId,
      title: text,
      userId: userId,
      status: "completed"
    });
    return new Response(text);
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
