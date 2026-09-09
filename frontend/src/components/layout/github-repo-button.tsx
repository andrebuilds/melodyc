"use client";

import { GithubIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { repositoryUrl } from "~/lib/site-config";
import { cn } from "~/lib/utils";

const starFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function GitHubRepoButton({ className }: { className?: string }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStars() {
      try {
        const response = await fetch("/api/github/stars", {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data: unknown = await response.json();

        if (
          typeof data === "object" &&
          data !== null &&
          "stars" in data &&
          typeof data.stars === "number"
        ) {
          setStars(data.stars);
        }
      } catch {
        return;
      }
    }

    void loadStars();
    return () => controller.abort();
  }, []);

  const formattedStars = stars === null ? "--" : starFormatter.format(stars);

  return (
    <Button variant="ghost" className={cn("h-9 gap-2 px-2.5", className)} asChild>
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={
          stars === null
            ? "View Melodyc on GitHub"
            : `View Melodyc on GitHub, ${stars} stars`
        }
      >
        <GithubIcon aria-hidden="true" />
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs tabular-nums" aria-live="polite">
            {formattedStars}
          </span>
          <StarIcon aria-hidden="true" className="size-3.5" />
        </span>
      </a>
    </Button>
  );
}

export { GitHubRepoButton };
