"use client";

import {
  AlertCircleIcon,
  DownloadIcon,
  Loader2Icon,
  MusicIcon,
  PlusIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";

type DemoStatus = "idle" | "queued" | "processing" | "processed" | "failed";

type DemoGeneration = {
  id: string;
  prompt: string;
  status: Exclude<DemoStatus, "idle">;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  error?: string;
};

const inspiration = [
  "Dreamy lo-fi for a rainy evening",
  "Upbeat indie pop with warm vocals",
  "Cinematic orchestral sunrise",
];

function FreeStudioDemo() {
  const [prompt, setPrompt] = useState(
    "A bright indie-pop song about driving through the city at sunrise, with warm vocals and a euphoric chorus.",
  );
  const [instrumental, setInstrumental] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [result, setResult] = useState<DemoGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedGenerationId = window.localStorage.getItem(
      "melodyc-demo-generation",
    );

    if (savedGenerationId) {
      setGenerationId(savedGenerationId);
      setStatus("queued");
    }
  }, []);

  useEffect(() => {
    if (!generationId || status === "processed" || status === "failed") return;

    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const response = await fetch(`/api/demo/generate?id=${generationId}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json()) as DemoGeneration;

        if (!response.ok) throw new Error(data.error ?? "Unable to load the demo.");

        setResult(data);
        setStatus(data.status);

        if (data.status === "queued" || data.status === "processing") {
          timeout = window.setTimeout(poll, 3000);
        }
      } catch (pollError) {
        if (controller.signal.aborted) return;
        setError(
          pollError instanceof Error
            ? pollError.message
            : "Unable to load the demo.",
        );
        setStatus("failed");
      }
    }

    timeout = window.setTimeout(poll, 1200);

    return () => {
      controller.abort();
      if (timeout) window.clearTimeout(timeout);
    };
  }, [generationId, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setStatus("queued");

    try {
      const response = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, instrumental }),
      });
      const data = (await response.json()) as DemoGeneration;

      if (!response.ok) throw new Error(data.error ?? "Generation could not start.");

      window.localStorage.setItem("melodyc-demo-generation", data.id);
      setGenerationId(data.id);
      setResult(data);
      setStatus(data.status);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Generation could not start.",
      );
      setStatus("failed");
    }
  }

  const isGenerating = status === "queued" || status === "processing";

  return (
    <div className="relative mx-auto mt-16 w-full max-w-6xl text-left">
      <div
        className="absolute -top-3 -left-3 size-16 border-t-2 border-l-2 border-secondary"
        aria-hidden="true"
      />
      <div
        className="absolute -right-3 -bottom-3 size-16 border-r-2 border-b-2 border-secondary"
        aria-hidden="true"
      />
      <div className="overflow-hidden rounded-md border bg-background shadow-lg">
        <div className="flex min-h-[34rem] flex-col md:flex-row">
          <form
            onSubmit={handleSubmit}
            className="flex w-full shrink-0 flex-col border-b bg-muted/30 md:w-80 md:border-r md:border-b-0"
          >
            <div className="flex-1 p-4">
              <Tabs value="simple">
                <TabsList className="w-full">
                  <TabsTrigger value="simple">Simple</TabsTrigger>
                  <TabsTrigger value="custom" disabled>
                    Custom
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <label
                htmlFor="demo-song-description"
                className="mt-6 block text-sm font-medium"
              >
                Describe your song
              </label>
              <Textarea
                id="demo-song-description"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                minLength={10}
                maxLength={300}
                required
                disabled={isGenerating}
                placeholder="A dreamy lo-fi hip hop song, perfect for studying or relaxing"
                className="mt-3 min-h-[120px] resize-none bg-background"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {prompt.length}/300
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Button type="button" size="sm" variant="outline" disabled>
                  <PlusIcon aria-hidden="true" />
                  Lyrics
                </Button>
                <label className="flex items-center gap-2 text-sm font-medium">
                  Instrumental
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                  disabled={isGenerating}
                  aria-label="Generate an instrumental demo"
                />
                </label>
              </div>

              <p className="mt-6 text-sm font-medium">Inspiration</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {inspiration.map((idea) => (
                  <Button
                    key={idea}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isGenerating}
                    onClick={() => setPrompt(idea)}
                    className="h-7 max-w-40 shrink-0 bg-transparent text-xs"
                    title={idea}
                  >
                    <PlusIcon aria-hidden="true" />
                    <span className="truncate">{idea}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t p-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 font-medium text-white hover:from-orange-600 hover:to-pink-600"
                disabled={isGenerating || prompt.trim().length < 10}
              >
                {isGenerating ? (
                  <Loader2Icon className="animate-spin" aria-hidden="true" />
                ) : (
                  <MusicIcon aria-hidden="true" />
                )}
                {isGenerating ? "Creating..." : "Create"}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Free demo · one generation per day
              </p>
            </div>
          </form>

          <div className="flex min-h-[30rem] min-w-0 flex-1 flex-col p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-md flex-1">
                <SearchIcon
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  readOnly
                  placeholder="Search..."
                  className="bg-background pl-10"
                  aria-label="Search demo tracks"
                />
              </div>
              <Button type="button" size="sm" variant="outline" disabled>
                <RefreshCcwIcon aria-hidden="true" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>

            <div className="flex flex-1 items-center justify-center" aria-live="polite">
              {status === "idle" && (
                <div className="text-center">
                  <MusicIcon
                    className="mx-auto size-10 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-lg font-semibold">No Music Yet</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create your free demo to get started.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="animate-in fade-in w-full duration-300">
                  <div className="flex items-center gap-4 rounded-md bg-muted/40 p-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Loader2Icon className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {status === "queued" ? "Song queued..." : "Processing song..."}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {prompt}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Generation can take a few minutes. Keep this page open.
                  </p>
                </div>
              )}

              {status === "failed" && (
                <div className="text-center">
                  <AlertCircleIcon
                    className="mx-auto size-11 text-destructive"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-lg font-semibold">Generation failed</h2>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                    {error ?? "We could not generate this track. Please try again."}
                  </p>
                </div>
              )}

              {status === "processed" && result?.audioUrl && (
                <div className="animate-in fade-in slide-in-from-bottom-2 w-full duration-300">
                  <div className="flex items-center gap-4 rounded-md p-3 transition-colors hover:bg-muted/50">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted bg-cover bg-center"
                      style={result.thumbnailUrl ? { backgroundImage: `url(${result.thumbnailUrl})` } : undefined}
                    >
                      {!result.thumbnailUrl && <MusicIcon className="size-6 text-muted-foreground" aria-hidden="true" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-medium">Your demo track</h2>
                        <span className="rounded-md border px-2 py-0.5 text-xs">30 sec</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{result.prompt}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={result.audioUrl} download aria-label="Download demo track">
                        <DownloadIcon aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                  <audio
                    className="mt-5 h-10 w-full"
                    controls
                    preload="metadata"
                    src={result.audioUrl}
                  >
                    <track kind="captions" />
                  </audio>
                  <div className="mt-5 flex justify-end">
                    <Button size="sm" asChild>
                      <Link href="/auth/sign-up">Create full tracks</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FreeStudioDemo };