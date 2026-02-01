import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { Id } from "./_generated/dataModel";

const INITIAL_TITLE = "Nerding Title";

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const threadId = crypto.randomUUID();
    const userId = userMetadata.userId;
    const id = await ctx.db.insert("threads", {
      title: INITIAL_TITLE,
      userId: userId as Id<"users">,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      lastMessageAt: now,
      generationStatus: "pending",
      visibility: "visible",
      threadId: threadId,
    });
    return {
      id: id,
      threadId,
    };
  },
});

export const makeThreadPinned = mutation({
  args: {
    threadId: v.string(),
    pinned: v.boolean(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_threadId_and_userId", (q) =>
        q.eq("threadId", args.threadId).eq("userId", userId as Id<"users">)
      )
      .first();
    if (!thread) return null;

    await ctx.db.patch(thread._id, {
      pinned: args.pinned,
      updatedAt: Date.now(),
    });
    return true;
  },
});

export const updatethread = mutation({
  args: {
    threadId: v.string(),
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    lastmessageat: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("updateThread", args);
    const userId = args.userId;
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_threadId_and_userId", (q) =>
        q.eq("threadId", args.threadId).eq("userId", userId as Id<"users">)
      )
      .first();
    if (!thread || thread.userId !== userId) {
      throw new Error("Unauthorized or thread not found");
    }

    if (thread.generationStatus === "completed") {
      return null;
    }

    const updateFields = Object.fromEntries(
      Object.entries({
        title: args.title,
        generationStatus: args.status,
        lastMessageAt: args.lastmessageat,
      }).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length > 0) {
      await ctx.db.patch(thread._id, {
        ...updateFields,
        updatedAt: Date.now(), // Update timestamp for any change
      });
    }
    return true;
  },
});

export const deleteThread = mutation({
  args: {
    threadId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_threadId_and_userId", (q) =>
        q.eq("threadId", args.threadId).eq("userId", userId as Id<"users">)
      )
      .first();
    if (!thread) return null;

    await ctx.db.patch(thread._id, {
      visibility: "archived",
      updatedAt: Date.now(),
    });
    return true;
  },
});

export const getThreadsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_userId_and_visibility_updatedAt", (q) =>
        q.eq("userId", userId as Id<"users">).eq("visibility", "visible")
      )
      .order("desc")
      .take(100);

    const pinnedThreads = await ctx.db
      .query("threads")
      .withIndex("by_userId_and_pinned_and_visibility", (q) =>
        q
          .eq("userId", userId as Id<"users">)
          .eq("pinned", true)
          .eq("visibility", "visible")
      )
      .order("desc")
      .take(100);

    const decoupledThreads = [...pinnedThreads, ...threads]
      .filter(
        (t, idx, self) =>
          idx === self.findIndex((t2) => t2.threadId === t.threadId)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return decoupledThreads;
  },
});
