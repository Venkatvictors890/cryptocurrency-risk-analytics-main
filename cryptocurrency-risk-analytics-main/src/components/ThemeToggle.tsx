import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="text-[11px] font-medium text-muted-foreground">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
