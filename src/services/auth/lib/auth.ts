import { betterAuth } from "better-auth";
import { convexAdapter } from "@better-auth-kit/convex";
import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

const convexClient = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export const auth = betterAuth({
  database: convexAdapter(convexClient),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})
