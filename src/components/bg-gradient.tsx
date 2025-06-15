import { cn } from "@/lib/utils";

export default function BgGradient({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("inset-0 -z-50 dark:bg-sidebar fixed *:absolute *:inset-0", className)}>
      <div className="opacity-40"
        style={{
          backgroundImage: 'radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))'
        }} />
      <div className="bg-noise" />
      <div className="bg-black/40" />
    </div>
  );
}
