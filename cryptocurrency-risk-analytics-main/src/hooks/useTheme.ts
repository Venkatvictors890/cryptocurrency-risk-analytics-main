import { useState, useEffect, useCallback } from "react";

/**
 * Theme hook with system auto-detection.
 * - On first visit: detects system preference via prefers-color-scheme
 * - Manual toggle overrides auto-detection
 * - Listens for system theme changes
 * - Smooth CSS transition applied via class
 */
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      // Auto-detect system preference
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    // Enable smooth transition
    root.classList.add("theme-transition");
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Remove transition class after animation to avoid transition on page load
    const timer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  // Listen for system theme changes (only if user hasn't manually set)
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;

    const handler = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("theme-manual");
      if (saved !== "true") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    localStorage.setItem("theme-manual", "true");
  }, []);

  return { theme, toggle };
}
