"use client";

import { Download, ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getCoverDownloadUrl,
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

type DownloadTarget = DownloadFormat | "cover";

export function SongDownloadMenu({ songId }: { songId: string }) {
  const [options, setOptions] = useState<{
    formats: DownloadFormat[];
    hasCover: boolean;
  } | null>(null);
  const [downloading, setDownloading] = useState<DownloadTarget | null>(null);

  const handleOpenChange = async (open: boolean) => {
    if (!open || options) return;
    try {
      setOptions(await getDownloadFormats(songId));
    } catch {
      setOptions({ formats: ["wav"], hasCover: false });
    }
  };

  const handleDownload = async (target: DownloadTarget) => {
    setDownloading(target);
    try {
      window.location.href =
        target === "cover"
          ? await getCoverDownloadUrl(songId)
          : await getDownloadUrl(songId, target);
    } catch {
      toast.error("Unable to download this file. Please try again.");
    } finally {
      setDownloading(null);
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
            {downloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Download</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options ? (
            <>
              {options.formats.map((format) => (
                <DropdownMenuItem
                  key={format}
                  disabled={downloading !== null}
                  onClick={() => void handleDownload(format)}
                >
                  {FORMAT_LABELS[format]}
                </DropdownMenuItem>
              ))}
              {options.hasCover && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={downloading !== null}
                    onClick={() => void handleDownload("cover")}
                  >
                    <ImageIcon className="mr-2 size-4" />
                    Cover image
                  </DropdownMenuItem>
                </>
              )}
            </>
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
