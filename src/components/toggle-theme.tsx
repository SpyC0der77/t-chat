import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { useTheme } from "next-themes"

export function ToggleTheme() {
  const { setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      tabIndex={-1}
      className="size-8 p-0 rounded-md"
      onMouseDownCapture={() => setTheme(theme => (theme === "dark" ? "light" : "dark"))}
    >
      <Icon name="moon" className="absolute size-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
      <Icon name="sun" className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
