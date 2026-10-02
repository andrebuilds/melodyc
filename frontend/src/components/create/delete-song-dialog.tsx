"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteSong } from "~/actions/song";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function DeleteSongDialog({
  song,
  onClose,
  onDeleted,
}: {
  song: { id: string; title: string | null };
  onClose: () => void;
  onDeleted: (songId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSong(song.id);
      onDeleted(song.id);
      onClose();
    } catch {
      toast.error("Unable to delete this song. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete song</DialogTitle>
          <DialogDescription>
            {song.title ? `"${song.title}"` : "This song"} will be permanently
            deleted, including its audio and cover. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
