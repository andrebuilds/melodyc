"use client";

import { Globe, Lock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { renameSong, setPublishedStatus } from "~/actions/song";
import { DeleteSongDialog } from "~/components/create/delete-song-dialog";
import { RenameDialog } from "~/components/create/rename-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type ManagedSong = { id: string; title: string | null; published: boolean };

export function SongActionsMenu({
  song,
  onChange,
  onDeleted,
}: {
  song: ManagedSong;
  onChange: (song: ManagedSong) => void;
  onDeleted: () => void;
}) {
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);

  const handleTogglePublished = async () => {
    const published = !song.published;
    onChange({ ...song, published });
    try {
      await setPublishedStatus(song.id, published);
      toast.success(published ? "Song published" : "Song is now private");
    } catch {
      onChange(song);
      toast.error("Unable to update visibility. Please try again.");
    }
  };

  const handleRename = async (songId: string, title: string) => {
    onChange({ ...song, title });
    try {
      await renameSong(songId, title);
    } catch {
      onChange(song);
      toast.error("Unable to rename this song. Please try again.");
    }
  };

  return (
    // Radix portals bubble React events, so keep clicks from triggering playback.
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Song actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => void handleTogglePublished()}>
            {song.published ? (
              <>
                <Lock className="mr-2 size-4" /> Make private
              </>
            ) : (
              <>
                <Globe className="mr-2 size-4" /> Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog("rename")}>
            <Pencil className="mr-2 size-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDialog("delete")}
          >
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialog === "rename" && (
        <RenameDialog
          track={song}
          onClose={() => setDialog(null)}
          onRename={(songId, title) => void handleRename(songId, title)}
        />
      )}

      {dialog === "delete" && (
        <DeleteSongDialog
          song={song}
          onClose={() => setDialog(null)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
