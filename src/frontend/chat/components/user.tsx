import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Link } from "react-router";
import { useCustomAuth } from "@/frontend/chat/contexts/auth";

export function User() {
  const { isAuthenticated: isCustomAuthenticated, session } = useCustomAuth();

  if (!isCustomAuthenticated) {
    return (
      <UserWrapper
        aria-label="Login"
        className="p-4 text-muted-foreground"
        to="/auth"
      >
        <Icon name="logIn" className="size-4" />
        <span>Login</span>
      </UserWrapper>
    )
  }

  if (!session) return null;
  return (
    <div
      role="button"
      aria-label="Go to settings"
      className="flex w-full select-none items-center justify-between gap-3 rounded-lg px-3 py-3 focus:bg-sidebar-accent focus:outline-2 hover:bg-sidebar-accent"
      onClick={(e) => {
        e.preventDefault();
        // Settings button does nothing
      }}
    >
      <div className="flex w-full min-w-0 flex-row items-center gap-3">
        <Image
          alt={session.name!}
          src={session.picture!}
          width={32}
          height={32}
          decoding="async"
          className="h-8 w-8 rounded-full ring-1 ring-muted-foreground/20"
          style={{ color: "transparent" }}
        />
        <div className="flex min-w-0 flex-col text-foreground">
          <span className="truncate text-sm font-medium">
            {session.name}
          </span>
        </div>
      </div>
    </div>
  )
}

const UserWrapper = ({ children, className, ...props }: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      role="button"
      className={cn("flex w-full select-none items-center gap-4 rounded-lg hover:bg-sidebar-accent", className)}
      data-discover="true"
      {...props}
    >
      {children}
    </Link>
  )
}
