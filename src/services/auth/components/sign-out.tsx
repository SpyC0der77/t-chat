"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth/lib/auth-client";

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.pathname = "/";
        },
      },
    });
  };
  return (
    <Button
      onMouseDownCapture={handleSignOut}
      variant="ghost"
      className="hover:text-foreground px-4 rounded-md hover:bg-muted/40"
    >
      Sign out
    </Button>
  );
}
