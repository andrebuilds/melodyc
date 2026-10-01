"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeadphonesIcon,
  // ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SliderFeature = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const features: SliderFeature[] = [
  {
    title: "From a sentence to a complete song",
    description:
      "Describe the track in your head and Melodyc turns it into structured music with vocals, instruments, and production ready to play.",
    imageSrc: "/landing/create.webp",
    imageAlt: "Melodyc song creation workspace",
  },
  {
    title: "Your lyrics, style, and creative direction",
    description:
      "Write your own lyrics, combine genres, choose instrumental mode, and guide the result with every detail that matters.",
    imageSrc: "/landing/customize.webp",
    imageAlt: "Melodyc custom lyrics and styles interface",
  },
  {
    title: "Find what the community is creating",
    description:
      "Explore published tracks by mood and genre, search the catalog, and save the ideas that inspire your next session.",
    imageSrc: "/landing/discover.webp",
    imageAlt: "Melodyc music discovery page",
  },
  {
    title: "Every track stays ready to play",
    description:
      "Keep generations organized, preview them instantly, publish your favorites, and download finished audio from one workspace.",
    imageSrc: "/landing/library.webp",
    imageAlt: "Melodyc track library and audio player",
  },
];

// TODO: restore when the screenshots in /public/landing are available.
// function FeatureImage({ feature }: { feature: SliderFeature }) {
//   const [failed, setFailed] = useState(false);
//
//   return (
//     <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border bg-muted/30 shadow-xl ring-1 ring-border/50">
//       {!failed && (
//         <img
//           src={feature.imageSrc}
//           alt={feature.imageAlt}
//           className="size-full object-cover object-top"
//           onError={() => setFailed(true)}
//         />
//       )}
//       {failed && (
//         <div className="flex size-full flex-col items-center justify-center p-6 text-center">
//           <span className="flex size-12 items-center justify-center rounded-md border bg-background text-primary shadow-sm">
//             <ImageIcon className="size-5" aria-hidden="true" />
//           </span>
//           <p className="mt-4 text-sm font-semibold">Screenshot ready</p>
//           <p className="mt-1 font-mono text-xs text-muted-foreground">
//             {feature.imageSrc}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

const AUTOPLAY_INTERVAL_MS = 5000;

function FeatureShowcase() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const total = features.length;
  const previous = useCallback(() => {
    setDirection(-1);
    setCurrent((value) => (value - 1 + total) % total);
  }, [total]);
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((value) => (value + 1) % total);
  }, [total]);
  const goTo = (index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };
  const feature = features[current]!;

  // Depends on `current` so manual navigation restarts the countdown.
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(next, AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [current, paused, next]);

  const handleTouchEnd = (event: React.TouchEvent) => {
    const delta =
      touchStartX.current - (event.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(delta) < 50) return;
    if (delta > 0) next();
    else previous();
  };

  const navigationButtonClass =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section
      id="features"
      className="scroll-mt-24 border-b bg-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
            <HeadphonesIcon className="size-4" aria-hidden="true" />
            Inside Melodyc
          </p>
          <h2 className="mx-auto mt-3 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
            From idea to finished track.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            One focused workspace to create, refine, discover, and manage
            original music.
          </p>
        </div>

        <div
          className="mt-14 sm:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="md:grid md:grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] md:gap-6">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous feature"
              className={cn(
                navigationButtonClass,
                "hidden self-center md:inline-flex",
              )}
            >
              <ChevronLeftIcon className="size-6" aria-hidden="true" />
            </button>

            <div
              className="min-w-0 overflow-hidden"
              aria-live={paused ? "polite" : "off"}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? 0;
              }}
              onTouchEnd={handleTouchEnd}
            >
              <div
                key={current}
                className={cn(
                  "animate-in fade-in grid items-start gap-4 duration-500 ease-out motion-reduce:animate-none lg:grid-cols-2 lg:gap-14",
                  direction === 1
                    ? "slide-in-from-right-12"
                    : "slide-in-from-left-12",
                )}
              >
                <h3 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                  {feature.title}
                </h3>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg lg:pt-1">
                  {feature.description}
                </p>
              </div>

              {/* <div className="mt-8">
                <FeatureImage feature={feature} />
              </div> */}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next feature"
              className={cn(
                navigationButtonClass,
                "hidden self-center md:inline-flex",
              )}
            >
              <ChevronRightIcon className="size-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-4 md:px-[4.25rem]">
            <div className="flex items-center gap-1">
              {features.map((item, index) => (
                <button
                  key={item.imageSrc}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show feature ${index + 1}`}
                  aria-current={index === current ? "true" : undefined}
                  className="inline-flex min-h-10 min-w-7 items-center justify-center rounded-full"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      index === current
                        ? "w-6 bg-foreground"
                        : "w-1.5 bg-border hover:bg-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between md:hidden">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous feature"
              className={navigationButtonClass}
            >
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next feature"
              className={navigationButtonClass}
            >
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Start creating
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { FeatureShowcase };