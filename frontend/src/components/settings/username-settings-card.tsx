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
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Public username</CardTitle>
        <CardDescription>
          Your public profile will be available at /user/
          {username || "username"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@</span>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                autoComplete="username"
                maxLength={24}
              />
            </div>
          </div>
          {message && (
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {message}
            </p>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save username"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
