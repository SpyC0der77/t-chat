import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { Id } from "./_generated/dataModel";
import { MessageStatusValidator } from "./schema";
export const createMessage = mutation({
  args: {
    threadId: v.string(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    status: MessageStatusValidator,
    modal: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = crypto.randomUUID();
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const userId = userMetadata.userId;
    const now = Date.now();
    return await ctx.db.insert("messages", {
      messageId,
      threadId: args.threadId,
      userId: userId as Id<"users">,
      content: args.content,
      status: args.status,
      role: args.role,
      createdAt: now,
      updatedAt: now,
      modal: args.modal,
    });
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.string(),
    content: v.string(),
    status: MessageStatusValidator,
  },
  handler: async (ctx, { messageId, content, status }) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("messageId"), messageId))
      .collect();
    if (messages.length === 0) throw new Error("Message not found");
    await ctx.db.patch(messages[0]._id, {
      content,
      status,
      updatedAt: Date.now(),
    });
  },
});
