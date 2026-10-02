"use client";

import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadAvatar } from "~/actions/avatar";
import { settingsCardClassNames as styles } from "~/components/settings/settings-card-styles";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";

const AVATAR_SIZE = 256;

// Center-crops to a square and downsizes so uploads stay small.
async function resizeImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  canvas
    .getContext("2d")
    ?.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );
  if (!blob) throw new Error("Unable to process the image.");
  return new File([blob], "avatar.webp", { type: "image/webp" });
}

function getInitials(name?: string | null) {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AvatarSettingsCard() {
  const { data: session, refetch } = authClient.useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = session?.user;

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", await resizeImage(file));
      const image = await uploadAvatar(formData);
      await authClient.updateUser({ image });
      refetch();
      toast.success("Profile picture updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload the image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      await authClient.updateUser({ image: null });
      refetch();
    } catch {
      toast.error("Unable to remove the profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn("mb-5", styles.base)}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>Profile picture</CardTitle>
        <CardDescription className={styles.description}>
          Shown in your account menu and next to your published songs.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(styles.content, "flex items-center gap-5")}>
        <div className="bg-primary/15 text-primary relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold">
          {user?.image ? (
            <img
              src={user.image}
              alt="Profile picture"
              className="size-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className={styles.primaryButton}
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud />
            Upload image
          </Button>
          {user?.image && (
            <Button
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => void handleRemove()}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </CardContent>
      <CardFooter className={styles.footer}>
        <p className={styles.instructions}>
          PNG, JPEG, or WebP. The image is cropped to a square.
        </p>
      </CardFooter>
    </Card>
  );
}
