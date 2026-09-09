"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative size-9", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <SunIcon
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0",
        )}
      />
      <MoonIcon
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100",
        )}
      />
    </Button>
  );
}

export { ModeToggle };
