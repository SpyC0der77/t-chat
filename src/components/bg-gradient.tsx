"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function BgGradient({ className }: React.ComponentProps<"div">) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className={cn("fixed inset-0 -z-50 dark:bg-sidebar", className)}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))"
            : "radial-gradient(closest-corner at 120px 36px, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))",
        }} />
      <div className="absolute inset-0 bg-noise" />
      {isDark && <div className="absolute inset-0 bg-black/40" />}
    </div>
  );
}
