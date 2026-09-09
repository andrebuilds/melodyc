import Link from "next/link";
import {
  AudioWaveformIcon,
  CheckIcon,
  Code2Icon,
  GithubIcon,
  MusicIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { FeatureShowcase } from "~/components/marketing/feature-showcase";
import { FreeStudioDemo } from "~/components/marketing/free-studio-demo";
import { repositoryUrl } from "~/lib/site-config";

const steps = [
  ["01", "Describe", "Write the mood, genre, story, or sound you have in mind."],
  ["02", "Shape", "Add lyrics and styles or let Melodyc handle the composition."],
  ["03", "Listen", "Generate your track, play it instantly, and make it yours."],
] as const;

export default function MarketingHomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div aria-hidden="true" className="absolute inset-0 opacity-35">
          {[22, 30, 38, 46, 54].map((top) => (
            <span
              key={top}
              className="absolute right-0 left-0 h-px bg-primary/30"
              style={{ top: `${top}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:pt-28 lg:pb-20">
          <div className="max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-xs">
              <AudioWaveformIcon className="size-4" aria-hidden="true" />
              Open-source AI music studio
            </div>
            <h1 className="text-5xl leading-[1.05] font-black tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Turn your ideas into original music.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Go from a sentence to an original track. Shape the lyrics, style,
              and mood, then listen to your idea come alive.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  <MusicIcon aria-hidden="true" />
                  Create your first song
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={repositoryUrl} target="_blank" rel="noreferrer">
                  <GithubIcon aria-hidden="true" />
                  View on GitHub
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Hosted for convenience. Free to self-host under the MIT license.
            </p>
          </div>

          <FreeStudioDemo />
        </div>
      </section>

      <FeatureShowcase />

      <section id="how-it-works" className="scroll-mt-24 border-b bg-muted/35 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-bold text-primary uppercase">How it works</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A studio session in three steps.</h2>
              <p className="mt-5 leading-7 text-muted-foreground">No production experience required. Start simple, then take control when inspiration gets specific.</p>
            </div>
            <ol className="divide-y border-y">
              {steps.map(([number, title, description]) => (
                <li key={number} className="grid gap-3 py-6 sm:grid-cols-[4rem_9rem_1fr] sm:items-start">
                  <span className="font-mono text-sm font-bold text-primary">{number}</span>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="leading-7 text-muted-foreground">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="open-source" className="scroll-mt-24 border-b bg-secondary py-20 text-secondary-foreground sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <div className="flex items-center gap-3">
              <GithubIcon className="size-7" aria-hidden="true" />
              <span className="font-mono text-sm font-bold uppercase">MIT licensed</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Your music stack should be yours.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 opacity-80">Inspect every line, run Melodyc on your own infrastructure, and build on top of the same complete codebase that powers the hosted product.</p>
          <Button size="lg" variant="outline" className="mt-9 border-secondary-foreground/40 bg-transparent" asChild>
            <Link href={repositoryUrl} target="_blank" rel="noreferrer">
              <Code2Icon aria-hidden="true" />
              Explore the code
            </Link>
          </Button>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-primary uppercase">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Use our studio or run your own.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Start with the hosted experience for speed, or self-host the complete platform for free.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <article className="border bg-card p-7 shadow-sm">
              <p className="font-bold">Self-hosted</p>
              <p className="mt-4 text-4xl font-black">Free</p>
              <p className="mt-3 text-muted-foreground">The full MIT-licensed Melodyc codebase.</p>
              <ul className="mt-7 space-y-3 text-sm">
                {['Complete source code', 'Your infrastructure', 'Community-driven development'].map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckIcon className="size-4 text-primary" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant="outline" asChild>
                <Link href={repositoryUrl} target="_blank" rel="noreferrer">View repository</Link>
              </Button>
            </article>
            <article className="border-2 border-primary bg-background p-7 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold">Melodyc Cloud</p>
                <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">Easiest</span>
              </div>
              <p className="mt-4 text-4xl font-black">Start free</p>
              <p className="mt-3 text-muted-foreground">Create music without managing models or servers.</p>
              <ul className="mt-7 space-y-3 text-sm">
                {['No setup required', 'Managed generation', 'Your songs in one place'].map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckIcon className="size-4 text-primary" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <Button className="mt-8 w-full" asChild>
                <Link href="/auth/sign-up">Create music</Link>
              </Button>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}