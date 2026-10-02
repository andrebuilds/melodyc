"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateUsername } from "~/actions/profile";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { settingsCardClassNames as styles } from "~/components/settings/settings-card-styles";
import { cn } from "~/lib/utils";

export function UsernameSettingsCard({
  initialUsername,
}: {
  initialUsername: string | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateUsername(username);
    setIsSaving(false);
    setMessage(result.error ?? result.success ?? null);

    if (result.success) router.refresh();
  };

  return (
    <Card className={cn("mt-5", styles.base)}>
      <form onSubmit={handleSubmit}>
        <CardHeader className={styles.header}>
          <CardTitle className={styles.title}>Public username</CardTitle>
          <CardDescription className={styles.description}>
            Your public profile will be available at /user/
            {username || "username"}.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.content}>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
              @
            </span>
            <Input
              id="username"
              aria-label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="username"
              autoComplete="username"
              maxLength={24}
              className={cn(styles.input, "pl-7")}
            />
          </div>
        </CardContent>
        <CardFooter
          className={cn(
            styles.footer,
            "flex flex-col justify-between gap-3 sm:flex-row sm:items-center",
          )}
        >
          <p className={styles.instructions} aria-live="polite">
            {message ?? "Use 3-24 lowercase letters, numbers, or underscores."}
          </p>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            className={styles.primaryButton}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
