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
      threadId
    };
  },
})

export const makeThreadPinned = mutation({
  args: {
    threadId: v.string(),
    pinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const userId = userMetadata.userId;
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .first();
    if (!thread) return null;

    await ctx.db.patch(thread._id, {
      pinned: true,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(thread._id);
  },
});

export const updatethread = mutation({
  args: {
    threadid: v.string(),
    userId: v.optional(v.id("users")),
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
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata && !args.userId) {
      return null;
    }
    const userId = userMetadata ? userMetadata.userId : args.userId;
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadid))
      .first();
    if (!threads) return null;
    const thread = await ctx.db.get(threads._id);
    if (!thread || thread.userId !== userId) {
      throw new Error("Unauthorized or thread not found");
    }

    const updateFields = Object.fromEntries(
      Object.entries({
        title: args.title,
        generationStatus: args.status,
        lastMessageAt: args.lastmessageat,
      }).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length > 0) {
      await ctx.db.patch(threads._id, {
        ...updateFields,
        updatedAt: Date.now(), // Update timestamp for any change
      });
    }
    return await ctx.db.get(threads._id);
  },
})

export const deleteThread = mutation({
  args: {
    threadid: v.id("threads"),
    userid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadid);
    if (!thread || thread.userId !== args.userid) {
      throw new Error("Unauthorized or thread not found");
    }

    await ctx.db.patch(args.threadid, {
      visibility: "archived",
      updatedAt: Date.now(),
    });
    return await ctx.db.get(args.threadid);
  },
});

export const getThreadsByUser = query({
  args: {},
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const userId = userMetadata.userId;
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_userId_and_updatedAt", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc")
      .take(100);

    const pinnedThreads = await ctx.db
      .query("threads")
      .withIndex("by_userId_and_pinned", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc")
      .take(100);

    const decoupledThreads = [...pinnedThreads, ...threads]
      .filter(
        (t, idx, self) =>
          idx === self.findIndex((t2) => t2.threadId === t.threadId),
      ).sort((a, b) => b.updatedAt - a.updatedAt);

    return decoupledThreads;
  },
});
