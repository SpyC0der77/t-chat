import BackButton from "@/components/back-button";
import BgGradient from "@/components/bg-gradient";
import { ToggleTheme } from "@/components/toggle-theme";
import SignOut from "@/services/auth/components/sign-out";
import { useCustomAuth } from "@/frontend/chat/contexts/auth";
import { Navigate } from "react-router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MESSAGE_LIMIT = 100;
export default function Setting() {
  const { session } = useCustomAuth();
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center p-8 container mx-auto relative max-w-[1200px]">
      <BgGradient />
      <header className="flex items-center justify-between pb-8 relative w-full">
        <BackButton className="relative top-auto left-auto" />
        <div className="flex gap-2 items-center">
          <ToggleTheme />
          <SignOut />
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 gap-4 gap-x-16 md:grid-cols-[1fr_3fr]">
        <div className="grid justify-items-center content-start gap-2">
          <Image
            alt={session.name}
            src={session.picture}
            width={160}
            height={160}
            className="rounded-full"
          />
          <h1 className="mt-2 text-2xl font-bold text-foreground">{session.name}</h1>
          <p className="text-sm text-muted-foreground">
            {session.email}
          </p>
          <div className="rounded-lg bg-card p-4 w-full grid gap-6 mt-4">
            <span className="text-sm font-semibold"> Keyboard Shortcuts </span>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Chat</span>
                <div className="flex gap-1">
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Ctrl</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Shift</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">O</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Toggle Sidebar</span>
                <div className="flex gap-1">
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Ctrl</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">B</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 space-y-2">
          <h2 className="text-center text-2xl font-bold md:text-left">Benifits of T4</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            None, this is just for hackathon. Will revamp it later with better features.
          </p>
          <div className="rounded-lg bg-card p-4 w-full grid gap-6 mt-4">
            <span className="text-sm font-semibold">Message Usage</span>
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Limit</span>
                <p className="text-primary dark:text-muted-foreground font-bold">50/{MESSAGE_LIMIT}</p>
              </div>
            </div>
            <Button
              asChild
            >
              <Link href="https://x.com/ofcljaved" target="_blank" rel="noreferrer">
                Contact for limit (@ofcljaved)
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
