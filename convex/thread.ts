import { v } from "convex/values";
import { mutation } from "./_generated/server";
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
    const userId = userMetadata.userId;
    const threadId = await ctx.db.insert("threads", {
      title: INITIAL_TITLE,
      userId: userId as Id<"users">,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      generationStatus: "pending",
      visibility: "visible",
    });
    return threadId;
  },
})

export const updatethread = mutation({
  args: {
    threadid: v.id("threads"),
    userid: v.id("users"),
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
    const thread = await ctx.db.get(args.threadid);
    if (!thread || thread.userId !== args.userid) {
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
      await ctx.db.patch(args.threadid, {
        ...updateFields,
        updatedAt: Date.now(), // Update timestamp for any change
      });
    }
    return await ctx.db.get(args.threadid);
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


