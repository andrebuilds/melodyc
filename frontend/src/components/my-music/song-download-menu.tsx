"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getDownloadFormats,
  getDownloadUrl,
  type DownloadFormat,
} from "~/actions/generation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const FORMAT_LABELS: Record<DownloadFormat, string> = {
  wav: "WAV (lossless)",
  mp3: "MP3 (320 kbps)",
  flac: "FLAC (lossless, smaller)",
};

export function SongDownloadMenu({ songId }: { songId: string }) {
  const [formats, setFormats] = useState<DownloadFormat[] | null>(null);
  const [downloadingFormat, setDownloadingFormat] =
    useState<DownloadFormat | null>(null);

  const handleOpenChange = async (open: boolean) => {
    if (!open || formats) return;
    try {
      setFormats(await getDownloadFormats(songId));
    } catch {
      setFormats(["wav"]);
    }
  };

  const handleDownload = async (format: DownloadFormat) => {
    setDownloadingFormat(format);
    try {
      window.location.href = await getDownloadUrl(songId, format);
    } catch {
      toast.error("Unable to download this song. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    // Radix portals bubble React events, so keep clicks from triggering playback.
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu onOpenChange={(open) => void handleOpenChange(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Download song"
          >
            {downloadingFormat ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Download as</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {formats ? (
            formats.map((format) => (
              <DropdownMenuItem
                key={format}
                disabled={downloadingFormat !== null}
                onClick={() => void handleDownload(format)}
              >
                {FORMAT_LABELS[format]}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading formats...
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
