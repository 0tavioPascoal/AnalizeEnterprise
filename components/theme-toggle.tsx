"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        h-11 w-full rounded-xl

        ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}

        text-sm font-bold
        text-muted-foreground

        transition-all

        hover:bg-muted
        hover:text-foreground
      `}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}

      {!collapsed && (
        <span>{isDark ? "Modo claro" : "Modo escuro"}</span>
      )}
    </Button>
  );
}