import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function LogoWithNewChat() {
  return (
    <>
      <Logo />
      <div className="px-1">
        <Button asChild className="w-full select-none bg-primary/20 font-semibold border-reflect button-reflect focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20">
          <Link href="/" >
            <span className="w-full select-none text-center">New Chat</span>
          </Link>
        </Button>
      </div>
    </>
  )
}

export function Logo() {
  return (
    <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
      <Link className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground" href="/" data-discover="true">
        <div className="h-3.5 select-none">
          <Image
            alt="T4 Chat logo"
            loading="lazy"
            width="96"
            height="20"
            decoding="async"
            data-nimg="1"
            className="w-full h-full"
            src="/images/t4logo.svg"
            style={{ color: "transparent" }}
          />
        </div>
      </Link>
    </h1>
  )
}

