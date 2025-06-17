import {
  BetterAuth,
  convexAdapter,
  type AuthFunctions,
  type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, BetterAuthPlugin } from "better-auth";
import { api, components, internal } from "./_generated/api";
import { query, type GenericCtx } from "./_generated/server";
import type { Id, DataModel } from "./_generated/dataModel";
import { createAuthMiddleware } from "better-auth/api";

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(
  components.betterAuth,
  {
    authFunctions,
    publicAuthFunctions,
  }
);

export const createAuth = (ctx: GenericCtx) =>
  betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    database: convexAdapter(ctx, betterAuthComponent),
    advanced: {

    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    plugins: [
      convex(),
    ],
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        console.log("after", ctx.setSignedCookie('test', 'test', 'test', { httpOnly: false, sameSite: 'lax', secure: true }))
        await new Promise(resolve => setTimeout(resolve, 10000));
      })
    }
  });

// These are required named exports
export const {
  createUser,
  updateUser,
  deleteUser,
  createSession,
  isAuthenticated,
} =
  betterAuthComponent.createAuthFunctions<DataModel>({
    onCreateUser: async (ctx, user) => {
      const userId = await ctx.db.insert("users", {
        email: user.email,
        name: user.name,
        picture: user.image
      });
      return userId;
    },

    onDeleteUser: async (ctx, userId) => {
      await ctx.db.delete(userId as Id<"users">);
    },
  });

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    return {
      ...user,
      ...userMetadata,
    };
  },
});
