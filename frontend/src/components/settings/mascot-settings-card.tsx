"use client";

import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateMascot } from "~/actions/mascot";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { MASCOTS, mascotLabel, mascotSrc } from "~/lib/mascots";
import { cn } from "~/lib/utils";

export function MascotSettingsCard({
  initialMascot,
}: {
  initialMascot: string | null;
}) {
  const router = useRouter();
  const [mascot, setMascot] = useState(initialMascot);
  const [selected, setSelected] = useState(initialMascot);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const save = async (value: string | null) => {
    setIsSaving(true);
    try {
      await updateMascot(value);
      setMascot(value);
      setIsOpen(false);
      toast.success(value ? "Mascot updated." : "Mascot removed.");
      router.refresh();
    } catch {
      toast.error("Unable to update your mascot. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("mt-5", styles.base)}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>Your mascot</CardTitle>
        <CardDescription className={styles.description}>
          Pick a Melodyc character. It replaces the logo in your sidebar and
          appears on your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(styles.content, "flex items-center gap-5")}>
        <div className="bg-muted/50 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border">
          {mascot ? (
            <img
              src={mascotSrc(mascot)}
              alt={mascotLabel(mascot)}
              className="size-full object-contain p-1"
            />
          ) : (
            <Sparkles className="text-muted-foreground size-6" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className={styles.primaryButton}
            disabled={isSaving}
            onClick={() => {
              setSelected(mascot);
              setIsOpen(true);
            }}
          >
            <Sparkles />
            {mascot ? "Change mascot" : "Choose mascot"}
          </Button>
          {mascot && (
            <Button
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => void save(null)}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className={styles.footer}>
        <p className={styles.instructions}>
          {mascot ? mascotLabel(mascot) : "No mascot selected yet."}
        </p>
      </CardFooter>

      <Dialog open={isOpen} onOpenChange={(open) => !isSaving && setIsOpen(open)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose your mascot</DialogTitle>
            <DialogDescription>
              Select a character, then save to use it across Melodyc.
            </DialogDescription>
          </DialogHeader>
          <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-5 md:grid-cols-6">
            {MASCOTS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                aria-pressed={selected === id}
                title={mascotLabel(id)}
                className={cn(
                  "bg-muted/40 hover:bg-muted flex aspect-square items-center justify-center rounded-md border-2 p-1.5 transition-colors",
                  selected === id
                    ? "border-primary bg-primary/10"
                    : "border-transparent",
                )}
              >
                <img
                  src={mascotSrc(id)}
                  alt={mascotLabel(id)}
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isSaving || !selected || selected === mascot}
              onClick={() => void save(selected)}
            >
              {isSaving && <Loader2 className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
