"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FF6B6B] bg-white text-[#2D2D2D] shadow-lg shadow-[#FF6B6B]/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#20C997] hover:text-[#20C997]"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
