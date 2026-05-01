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

  if (!mounted) {
    return null; // ⛔ evita hydration error
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {!collapsed && (
        <span className="text-sm">{isDark ? "Modo claro" : "Modo escuro"}</span>
      )}
    </Button>
  );
}
