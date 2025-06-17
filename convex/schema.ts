import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  threads: defineTable({
    title: v.string(),
    userId: v.id("users"),
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
  }),
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
  }).index("email", ["email"]),
});
