import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { Id } from "./_generated/dataModel";
import { MessageStatusValidator } from "./schema";
export const createMessage = mutation({
  args: {
    threadId: v.string(),
    userId: v.optional(v.id("users")),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    status: MessageStatusValidator,
    modal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = crypto.randomUUID();
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata && !args.userId) {
      return null;
    }
    const userId = userMetadata ? userMetadata.userId : args.userId;
    const now = Date.now();
    await ctx.db.insert("messages", {
      messageId,
      threadId: args.threadId,
      userId: userId as Id<"users">,
      content: args.content,
      status: args.status,
      role: args.role,
      createdAt: now,
      updatedAt: now,
      modal: args.modal || "",
    });
    return messageId;
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
    const updatedAt = Date.now();
    await ctx.db.patch(messages[0]._id, {
      content,
      status,
      updatedAt,
    });
    return updatedAt;
  },
});

export const getMessageByThreadId = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const userId = userMetadata.userId;
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("threadId"), args.threadId),
          q.eq(q.field("userId"), userId)
        )
      )
      .order("asc")
      .collect();
    return messages;
  },
});
