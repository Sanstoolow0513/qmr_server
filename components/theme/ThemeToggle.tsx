"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "segmented";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    button: "p-1.5",
    icon: "h-3.5 w-3.5",
    segmented: "px-2 py-1 text-xs",
  },
  md: {
    button: "p-2",
    icon: "h-4 w-4",
    segmented: "px-3 py-1.5 text-sm",
  },
  lg: {
    button: "p-2.5",
    icon: "h-5 w-5",
    segmented: "px-4 py-2 text-sm",
  },
};

export function ThemeToggle({
  variant = "icon",
  size = "md",
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1 ${className}`}
      >
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${sizeClasses[size].segmented} ${
            theme === "light"
              ? "bg-[var(--theme-primary)] text-white shadow-sm"
              : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
          }`}
          title="浅色模式"
        >
          <Sun className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">浅色</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${sizeClasses[size].segmented} ${
            theme === "dark"
              ? "bg-[var(--theme-primary)] text-white shadow-sm"
              : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
          }`}
          title="深色模式"
        >
          <Moon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">深色</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${sizeClasses[size].segmented} ${
            theme === "system"
              ? "bg-[var(--theme-primary)] text-white shadow-sm"
              : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
          }`}
          title="跟随系统"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">系统</span>
        </button>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-hover)] transition-all duration-300 ${sizeClasses[size].button} ${className}`}
        title={`当前: ${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"} (点击切换)`}
      >
        {theme === "light" && <Sun className={sizeClasses[size].icon} />}
        {theme === "dark" && <Moon className={sizeClasses[size].icon} />}
        {theme === "system" && <Monitor className={sizeClasses[size].icon} />}
        <span className="hidden sm:inline text-sm font-medium">
          {theme === "light" ? "浅色" : theme === "dark" ? "深色" : "系统"}
        </span>
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-hover)] transition-all duration-300 ${sizeClasses[size].button} ${className}`}
      title={`当前: ${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"} (点击切换)`}
    >
      {theme === "light" && (
        <Sun className={`${sizeClasses[size].icon} text-amber-500`} />
      )}
      {theme === "dark" && (
        <Moon className={`${sizeClasses[size].icon} text-indigo-400`} />
      )}
      {theme === "system" && (
        <Monitor className={sizeClasses[size].icon} />
      )}
    </button>
  );
}
