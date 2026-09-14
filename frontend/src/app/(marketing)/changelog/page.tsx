import type { ElementType, Metadata } from "next";
import {
  CircleHelpIcon,
  CompassIcon,
  CreditCardIcon,
  DatabaseIcon,
  LanguagesIcon,
  MusicIcon,
  RefreshCcwIcon,
  TagsIcon,
  WandSparklesIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Changelog | Melodyc",
  description:
    "Follow new features, improvements, and fixes shipped to Melodyc.",
};

type ChangeType = "new" | "improved" | "fixed";

type Change = {
  type: ChangeType;
  text: string;
};

type Release = {
  version: string;
  date: string;
  dateTime: string;
  title: string;
  description: string;
  icon: ElementType;
  changes: Change[];
};

const typeMeta: Record<ChangeType, { label: string; className: string }> = {
  new: {
    label: "New",
    className:
      "border-emerald-600/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  improved: {
    label: "Improved",
    className:
      "border-sky-600/35 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  fixed: {
    label: "Fixed",
    className:
      "border-amber-600/35 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

const releases: Release[] = [
  {
    version: "Unreleased",
    date: "September 14, 2026",
    dateTime: "2026-09-14",
    title: "Help Center, subscriptions, and public experience",
    description:
      "A clearer path from discovering Melodyc to creating music, choosing a plan, and finding product guidance.",
    icon: CircleHelpIcon,
    changes: [
      {
        type: "new",
        text: "Public Help Center with responsive topic navigation, scroll spy, and documentation for every current Melodyc workflow.",
      },
      {
        type: "new",
        text: "Monthly Polar subscription plans for 30, 70, or 150 credits, with unused-credit rollover.",
      },
      {
        type: "new",
        text: "Public pricing, FAQ, open-source presentation, and expanded footer with contributor profiles.",
      },
      {
        type: "improved",
        text: "New accounts now start with 20 free credits and pricing calls to action communicate the offer directly.",
      },
      {
        type: "fixed",
        text: "Polar product IDs now come from validated server environment variables for sandbox and production deployments.",
      },
      {
        type: "fixed",
        text: "Improved dark-mode contrast across footer controls and outline pricing actions.",
      },
    ],
  },
  {
    version: "September 2026",
    date: "September 9, 2026",
    dateTime: "2026-09-09",
    title: "Marketing experience and dashboard polish",
    description:
      "Melodyc gained a complete public-facing experience and a more focused workspace for signed-in creators.",
    icon: WandSparklesIcon,
    changes: [
      {
        type: "new",
        text: "Public marketing homepage with a working 30-second music generation demo.",
      },
      {
        type: "new",
        text: "Screenshot-driven feature showcase for Create, customization, Discover, and the track library.",
      },
      {
        type: "improved",
        text: "Dashboard navigation, collapsible sidebar, billing, account settings, and responsive layouts were redesigned as one consistent studio.",
      },
      {
        type: "fixed",
        text: "Authentication now redirects signed-in users to Discover instead of the public homepage.",
      },
    ],
  },
  {
    version: "Discovery update",
    date: "September 8, 2026",
    dateTime: "2026-09-08",
    title: "Faster music discovery",
    description:
      "Finding community tracks became quicker and more predictable as the catalog grew.",
    icon: CompassIcon,
    changes: [
      {
        type: "new",
        text: "Search published music by title, generation prompt, or category.",
      },
      {
        type: "improved",
        text: "Search input now uses a short debounce to keep filtering responsive while typing.",
      },
      {
        type: "fixed",
        text: "TypeScript workspace configuration was simplified to preserve path aliases without deprecated settings.",
      },
    ],
  },
  {
    version: "Catalog update",
    date: "September 6, 2026",
    dateTime: "2026-09-06",
    title: "Infinite community feed",
    description:
      "Discover can now keep loading published music without interrupting the listening experience.",
    icon: MusicIcon,
    changes: [
      {
        type: "new",
        text: "Cursor-based infinite loading for published tracks as creators scroll through Discover.",
      },
      {
        type: "improved",
        text: "Trending and category sections now build from a growing paginated catalog.",
      },
      {
        type: "improved",
        text: "Loading is guarded against duplicate requests when the observer fires repeatedly.",
      },
    ],
  },
  {
    version: "Generation update",
    date: "August 28, 2026",
    dateTime: "2026-08-28",
    title: "Live generation progress",
    description:
      "Creators can follow queued tracks through processing without manually reloading the studio.",
    icon: RefreshCcwIcon,
    changes: [
      {
        type: "new",
        text: "Automatic status polling for queued and processing tracks in the personal library.",
      },
      {
        type: "improved",
        text: "Track rows clearly distinguish processing, completed, failed, and insufficient-credit states.",
      },
      {
        type: "fixed",
        text: "Polling is stopped automatically when no active generations remain.",
      },
    ],
  },
  {
    version: "Storage foundation",
    date: "August 26, 2026",
    dateTime: "2026-08-26",
    title: "Private media delivery",
    description:
      "Generated audio and artwork moved into a structured private storage workflow.",
    icon: DatabaseIcon,
    changes: [
      {
        type: "new",
        text: "AWS S3 integration for generated audio files and cover artwork.",
      },
      {
        type: "new",
        text: "Temporary signed URLs provide controlled playback and download access without making the bucket public.",
      },
      {
        type: "improved",
        text: "Backend and frontend storage responsibilities use separate, limited IAM permissions.",
      },
    ],
  },
  {
    version: "Metadata update",
    date: "August 25, 2026",
    dateTime: "2026-08-25",
    title: "Smarter genres and categories",
    description:
      "Generated music became easier to organize and surface throughout the community catalog.",
    icon: TagsIcon,
    changes: [
      {
        type: "new",
        text: "AI-assisted genre and category detection for completed tracks.",
      },
      {
        type: "improved",
        text: "Generation prompts now carry clearer metadata into the track library and Discover search.",
      },
      {
        type: "fixed",
        text: "Category output is constrained to the supported catalog vocabulary.",
      },
    ],
  },
  {
    version: "Model update",
    date: "August 18, 2026",
    dateTime: "2026-08-18",
    title: "More controllable AI generation",
    description:
      "Prompt generation and inference controls were tuned for more useful musical direction.",
    icon: CreditCardIcon,
    changes: [
      {
        type: "new",
        text: "Separate generation paths for full descriptions, custom lyrics, and described lyrics.",
      },
      {
        type: "new",
        text: "Instrumental mode for creating tracks without vocals.",
      },
      {
        type: "improved",
        text: "Qwen prompt construction and inference profiles were refined across generation modes.",
      },
    ],
  },
  {
    version: "Language update",
    date: "July 27, 2026",
    dateTime: "2026-07-27",
    title: "Multilingual prompt understanding",
    description:
      "Melodyc began handling creative direction across languages more consistently.",
    icon: LanguagesIcon,
    changes: [
      {
        type: "new",
        text: "Language detection for text sent through the generation pipeline.",
      },
      {
        type: "improved",
        text: "Qwen chat templates preserve user intent while producing model-ready music prompts.",
      },
      {
        type: "improved",
        text: "Lyrics and style guidance can be normalized before reaching the music model.",
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-w-0">
      <section className="border-b bg-muted/25 px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-bold text-primary uppercase">Changelog</p>
        <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-4 text-4xl font-black duration-500 sm:text-5xl lg:text-6xl">
          What&apos;s new
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Every feature, improvement, and fix shipped to Melodyc. Follow the studio as it grows.
        </p>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative">
          <div className="absolute top-5 bottom-0 left-5 hidden w-px bg-border md:block" aria-hidden="true" />

          <div className="space-y-10 sm:space-y-12">
            {releases.map((release, index) => {
              const Icon = release.icon;
              return (
                <article
                  key={`${release.version}-${release.dateTime}`}
                  className="animate-in fade-in slide-in-from-bottom-4 relative fill-mode-both md:pl-16"
                  style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
                >
                  <span className="absolute top-1 left-0 hidden size-10 items-center justify-center rounded-full border bg-background text-primary shadow-sm md:flex">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>

                  <div className="rounded-md border bg-card p-6 shadow-sm transition-colors hover:border-primary/50 sm:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary md:hidden">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
                        {release.version === "Unreleased" ? release.version : release.version}
                      </Badge>
                      <time dateTime={release.dateTime} className="text-sm text-muted-foreground">
                        {release.date}
                      </time>
                    </div>

                    <h2 className="text-xl font-bold sm:text-2xl">{release.title}</h2>
                    <p className="mt-2 leading-7 text-muted-foreground">{release.description}</p>

                    <ul className="mt-6 space-y-3">
                      {release.changes.map((change) => {
                        const meta = typeMeta[change.type];
                        return (
                          <li key={change.text} className="flex items-start gap-3">
                            <Badge
                              variant="outline"
                              className={cn("mt-0.5 shrink-0", meta.className)}
                            >
                              {meta.label}
                            </Badge>
                            <span className="text-sm leading-6 text-muted-foreground">
                              {change.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}