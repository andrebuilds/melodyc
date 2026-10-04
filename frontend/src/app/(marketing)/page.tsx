import Link from "next/link";
import {
  AudioWaveformIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  Code2Icon,
  FlameIcon,
  GithubIcon,
  LifeBuoyIcon,
  MedalIcon,
  MusicIcon,
  ScrollTextIcon,
  TargetIcon,
  TrophyIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { FeatureShowcase } from "~/components/marketing/feature-showcase";
import { FreeStudioDemo } from "~/components/marketing/free-studio-demo";
import { JsonLd } from "~/components/seo/json-ld";
import { SIGN_UP_CREDITS } from "~/lib/credits";
import { faqs } from "~/lib/faqs";
import { repositoryUrl } from "~/lib/site-config";
import { homeStructuredData } from "~/lib/structured-data";

const gamificationFeatures = [
  {
    icon: TargetIcon,
    title: "Daily missions",
    description:
      "Listen, like, follow, and publish to complete small daily goals and earn credits.",
  },
  {
    icon: TrophyIcon,
    title: "Weekly challenges",
    description:
      "Bigger goals that reset every Monday, with bigger rewards for the most active creators.",
  },
  {
    icon: FlameIcon,
    title: "Streaks",
    description:
      "Come back every day to build your streak and unlock bonus credits along the way.",
  },
  {
    icon: MedalIcon,
    title: "Badges",
    description:
      "Unlock badges for your milestones and show them off on your public profile.",
  },
] as const;

export default function MarketingHomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
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
              Free to use, with {SIGN_UP_CREDITS} credits on sign-up. Free to self-host under the MIT license.
            </p>
          </div>

          <FreeStudioDemo />
        </div>
      </section>

      <FeatureShowcase />

      <section id="gamification" className="scroll-mt-24 border-b bg-muted/35 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
              <TrophyIcon className="size-4" aria-hidden="true" />
              Gamification
              <span className="rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                Coming soon
              </span>
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Free to create. Play to earn more.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Melodyc is free for everyone. Get {SIGN_UP_CREDITS} free credits when you join, then soon you will earn new credits by completing missions, keeping streaks, and unlocking badges.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gamificationFeatures.map((feature) => (
              <Card key={feature.title} className="flex rounded-md">
                <CardContent className="flex w-full flex-col p-6">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription className="mt-2 leading-6">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                <MusicIcon aria-hidden="true" />
                Start free - get {SIGN_UP_CREDITS} credits
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={repositoryUrl} target="_blank" rel="noreferrer">
                <Code2Icon aria-hidden="true" />
                Self-host for free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-b bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
              <CircleHelpIcon className="size-4" aria-hidden="true" />
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
              Everything you need to know before creating your first track.
            </p>
          </div>

          <div className="mt-10 border-y">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b last:border-b-0"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold marker:content-none">
                  {faq.question}
                  <ChevronDownIcon
                    className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-open:grid-rows-[1fr] group-open:opacity-100">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl -translate-y-2 pb-5 leading-7 text-muted-foreground transition-transform duration-300 ease-out group-open:translate-y-0">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/help">
                <LifeBuoyIcon aria-hidden="true" />
                Help center
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/changelog">
                <ScrollTextIcon aria-hidden="true" />
                Changelog
              </Link>
            </Button>
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

    </>
  );
}