"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateNotificationPreference } from "~/actions/notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { NotificationType } from "~/lib/email";

type NotificationSettings = Record<NotificationType, boolean>;

const OPTIONS: { type: NotificationType; label: string; description: string }[] =
  [
    {
      type: "songReady",
      label: "Song ready",
      description: "When a song you created has finished generating.",
    },
    {
      type: "songFailed",
      label: "Generation failed",
      description: "When a song could not be generated.",
    },
    {
      type: "paymentConfirmed",
      label: "Payment confirmed",
      description: "When a payment is completed and credits are added.",
    },
    {
      type: "productUpdates",
      label: "Product updates",
      description: "New features and occasional news about Melodyc.",
    },
  ];

export function NotificationSettingsCard({
  initialSettings,
}: {
  initialSettings: NotificationSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);

  const handleChange = async (type: NotificationType, enabled: boolean) => {
    setSettings((current) => ({ ...current, [type]: enabled }));
    try {
      await updateNotificationPreference(type, enabled);
    } catch {
      setSettings((current) => ({ ...current, [type]: !enabled }));
      toast.error("Unable to update your email preferences.");
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Email notifications</CardTitle>
        <CardDescription>
          Choose which emails you want to receive. Security emails, such as
          password resets, are always sent.
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-border/60 divide-y">
        {OPTIONS.map((option) => (
          <div
            key={option.type}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <Label htmlFor={`notification-${option.type}`}>
                {option.label}
              </Label>
              <p className="text-muted-foreground mt-1 text-sm">
                {option.description}
              </p>
            </div>
            <Switch
              id={`notification-${option.type}`}
              checked={settings[option.type]}
              onCheckedChange={(checked) =>
                void handleChange(option.type, checked)
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
