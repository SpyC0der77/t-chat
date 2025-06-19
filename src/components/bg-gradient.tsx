import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function BgGradient({ className }: React.ComponentProps<"div">) {
  const { theme } = useTheme();
  return (
    <div className={cn("inset-0 -z-50 dark:bg-sidebar fixed *:absolute *:inset-0", className)}>
      <div className="opacity-40"
        style={{
          backgroundImage: theme === "dark" ?
            'radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))'
            : 'radial-gradient(closest-corner at 120px 36px, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))'
        }} />
      <div className="bg-noise" />
      {theme === "dark" && <div className="bg-black/40" />}
    </div>
  );
}
