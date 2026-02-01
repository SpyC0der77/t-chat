import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  // No plugins needed for mock data
})

export const {
  signIn,
  signOut,
  signUp,
  useSession
} = authClient;
