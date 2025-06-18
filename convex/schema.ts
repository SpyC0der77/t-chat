import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MessageStatusValidator = v.union(
  v.literal("waiting"),
  v.literal("thinking"),
  v.literal("streaming"),
  v.literal("done"),
  v.literal("error"),
  v.literal("error.rejected"),
  v.literal("deleted"),
);

export default defineSchema({
  threads: defineTable({
    title: v.string(),
    userId: v.id("users"),
    threadId: v.string(),
    pinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.number(),
    generationStatus: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    visibility: v.union(v.literal("visible"), v.literal("archived")),
  })
    .index("by_userId", ["userId"])
    .index("by_threadId", ["threadId"])
    .index("by_threadId_and_userId", ["threadId", "userId"])
    .index("by_userId_and_pinned", ["userId", "pinned"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"])
  ,
  messages: defineTable({
    messageId: v.string(),
    threadId: v.string(),
    userId: v.id("users"),
    content: v.string(),
    status: MessageStatusValidator,
    role: v.union(v.literal("user"), v.literal("assistant")),
    updatedAt: v.number(),
    createdAt: v.number(),
    modal: v.string(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_thread_and_userid", ["threadId", "userId"])
    .index("by_messageId_and_userid", ["messageId", "userId"])
    .index("by_user", ["userId"]),


  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
  }).index("email", ["email"]),
});
