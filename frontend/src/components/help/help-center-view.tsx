"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  CircleHelpIcon,
  Code2Icon,
  CompassIcon,
  CreditCardIcon,
  InfoIcon,
  LibraryIcon,
  Mic2Icon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  WandSparklesIcon,
} from "lucide-react";
import { subscriptionPlans } from "~/lib/pricing";
import { repositoryUrl } from "~/lib/site-config";
import { cn } from "~/lib/utils";

type HelpSection = {
  id: string;
  label: string;
  icon: ElementType;
};

const sections: HelpSection[] = [
  { id: "getting-started", label: "Getting started", icon: UserPlusIcon },
  { id: "creating-music", label: "Creating music", icon: WandSparklesIcon },
  { id: "lyrics-instrumentals", label: "Lyrics and instrumentals", icon: Mic2Icon },
  { id: "track-library", label: "Track library", icon: LibraryIcon },
  { id: "discover", label: "Discover", icon: CompassIcon },
  { id: "credits-billing", label: "Credits and billing", icon: CreditCardIcon },
  { id: "account-security", label: "Account and security", icon: ShieldCheckIcon },
  { id: "public-demo", label: "Public demo", icon: PlayCircleIcon },
  { id: "self-hosting", label: "Self-hosting", icon: Code2Icon },
];

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-3 text-lg font-semibold first:mt-0">{children}</h3>;
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-7 text-muted-foreground">{children}</p>;
}

function List({ children, ordered = false }: { children: ReactNode; ordered?: boolean }) {
  const Component = ordered ? "ol" : "ul";
  return (
    <Component
      className={cn(
        "mb-4 space-y-2 pl-5 leading-7 text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
      )}
    >
      {children}
    </Component>
  );
}

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-5 flex gap-3 rounded-md border border-primary/25 bg-primary/5 px-4 py-3.5">
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="text-sm leading-6">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <>
      <Heading>Create your account</Heading>
      <Paragraph>
        <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
          Create a Melodyc account
        </Link>{" "}
        with your email and password. New accounts receive 20 free credits, with no credit card required.
      </Paragraph>
      <Heading>Find your way around</Heading>
      <Paragraph>After signing in, the dashboard gives you three main destinations:</Paragraph>
      <List>
        <li><strong className="text-foreground">Discover</strong> for published music from the community.</li>
        <li><strong className="text-foreground">Create</strong> for generating and managing your tracks.</li>
        <li><strong className="text-foreground">Billing</strong> for credits, subscriptions, and payment history.</li>
      </List>
      <Callout title="Start with an idea">
        You do not need production experience. A mood, genre, scene, or short story is enough to create your first track.
      </Callout>
    </>
  );
}

function CreatingMusic() {
  return (
    <>
      <Heading>Simple mode</Heading>
      <Paragraph>
        Open <Link href="/create" className="font-medium text-primary hover:underline">Create</Link>, select Simple, and describe the song you want. Include details such as genre, mood, instruments, tempo, vocal style, or story. Inspiration tags can help you get started.
      </Paragraph>
      <Heading>Custom mode</Heading>
      <Paragraph>
        Custom mode separates musical style from lyrics. Add comma-separated styles, decide how lyrics should be handled, and combine influences to guide the result more precisely.
      </Paragraph>
      <Heading>What happens after Create</Heading>
      <List ordered>
        <li>Melodyc queues two variations of your request.</li>
        <li>Your tracks appear immediately with a queued or processing status.</li>
        <li>The AI generates the audio and matching cover art in the background.</li>
        <li>The library refreshes the status automatically while generation is running.</li>
      </List>
      <Callout title="Credit usage">
        Each successfully generated song uses one credit. Because one Create request produces two variations, a completed request normally uses two credits. Failed generations are not charged.
      </Callout>
    </>
  );
}

function LyricsAndInstrumentals() {
  return (
    <>
      <Heading>Write your own lyrics</Heading>
      <Paragraph>
        In Custom mode, choose the option to write lyrics and enter the words you want performed. Pair them with style tags that describe the arrangement, genre, instruments, and vocal character.
      </Paragraph>
      <Heading>Describe the lyrics</Heading>
      <Paragraph>
        If you have a story but not finished words, describe the subject and direction instead. Melodyc uses that description to shape lyrics for the generated track.
      </Paragraph>
      <Heading>Create an instrumental</Heading>
      <Paragraph>
        Enable the Instrumental switch to generate music without vocals. You can use it in both Simple and Custom modes for backing tracks, scores, beats, and ambient pieces.
      </Paragraph>
      <Callout title="Give useful direction">
        Specific combinations usually produce clearer results. Try describing an era, genre, key instruments, energy, and the scene the music should evoke.
      </Callout>
    </>
  );
}

function TrackLibrary() {
  return (
    <>
      <Heading>Your tracks</Heading>
      <Paragraph>
        The Create workspace also contains your personal track library. Search by title or prompt, refresh the list, and follow queued, processing, completed, failed, or no-credit states.
      </Paragraph>
      <Heading>Play and organize</Heading>
      <List>
        <li>Select a completed track to load it into the persistent audio player.</li>
        <li>Rename a track from its actions menu.</li>
        <li>Download completed audio when you want a local copy.</li>
        <li>Publish a track to make it available in Discover, or unpublish it to make it private again.</li>
      </List>
      <Callout title="Private by default">
        Your generated tracks stay in your personal library until you explicitly publish them.
      </Callout>
    </>
  );
}

function Discover() {
  return (
    <>
      <Heading>Explore community music</Heading>
      <Paragraph>
        Discover collects tracks that creators have chosen to publish. Recent music appears in Trending, while categorized tracks are grouped by their primary genre or mood.
      </Paragraph>
      <Heading>Search, listen, and like</Heading>
      <List>
        <li>Search published music by title, prompt, or category.</li>
        <li>Select cover art to play a track in the global audio player.</li>
        <li>Like a track to support the creator, or select the heart again to remove your like.</li>
        <li>Keep scrolling to load more published music automatically.</li>
      </List>
    </>
  );
}

function CreditsAndBilling() {
  return (
    <>
      <Heading>How credits work</Heading>
      <Paragraph>
        One completed song uses one credit. Your current balance appears in the dashboard header and on the Billing page. Unused credits roll over and remain available after renewal.
      </Paragraph>
      <Heading>Subscription plans</Heading>
      <List>
        {subscriptionPlans.map((plan) => (
          <li key={plan.slug}>
            <strong className="text-foreground">{plan.name}</strong>: {plan.credits} credits for {plan.price} per month.
          </li>
        ))}
      </List>
      <Paragraph>
        Credits are added after the first successful payment and after each successful monthly renewal. If a payment does not complete, no renewal credits are added.
      </Paragraph>
      <Heading>Manage payments</Heading>
      <Paragraph>
        Open <Link href="/billing" className="font-medium text-primary hover:underline">Billing</Link> to view your balance, choose a plan, or enter the Polar customer portal. The portal lets you review payments and manage or cancel your subscription.
      </Paragraph>
    </>
  );
}

function AccountSecurity() {
  return (
    <>
      <Heading>Account settings</Heading>
      <Paragraph>
        Visit <Link href="/account/settings" className="font-medium text-primary hover:underline">Account settings</Link> to update your profile and personal details.
      </Paragraph>
      <Heading>Security controls</Heading>
      <Paragraph>
        The <Link href="/account/security" className="font-medium text-primary hover:underline">Security</Link> page contains password, connected provider, and active session controls. These settings are visible only to you.
      </Paragraph>
      <Callout title="Protect your account">
        Use a unique password and review active sessions if you sign in on a shared or unfamiliar device.
      </Callout>
    </>
  );
}

function PublicDemo() {
  return (
    <>
      <Heading>Try Melodyc before signing up</Heading>
      <Paragraph>
        The studio demo on the homepage creates a 30-second preview from a text prompt. You can choose instrumental mode, listen to the result, and download it without using account credits.
      </Paragraph>
      <Heading>Demo limits</Heading>
      <List>
        <li>The prompt must contain between 10 and 300 characters.</li>
        <li>Each visitor can start one public demo generation per day.</li>
        <li>The full studio, custom lyrics, personal library, and publishing require an account.</li>
      </List>
      <Paragraph>
        <Link href="/#demo" className="font-medium text-primary hover:underline">Return to the homepage</Link> to try the public demo.
      </Paragraph>
    </>
  );
}

function SelfHosting() {
  return (
    <>
      <Heading>Run Melodyc on your infrastructure</Heading>
      <Paragraph>
        Melodyc is open source under the MIT license. The repository includes the Next.js application, Python AI backend, database schema, queue workflows, authentication, storage integration, and payment setup.
      </Paragraph>
      <Heading>What you need</Heading>
      <List>
        <li>Node.js and Python 3.12 for the frontend and backend.</li>
        <li>PostgreSQL through Neon and private object storage through AWS S3.</li>
        <li>Modal for GPU inference and Inngest for background workflows.</li>
        <li>Better Auth and Polar configuration for accounts and subscriptions.</li>
      </List>
      <Heading>Setup guides</Heading>
      <List>
        <li><Link href={`${repositoryUrl}/blob/main/frontend/getting-started.md`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">Frontend setup guide</Link></li>
        <li><Link href={`${repositoryUrl}/blob/main/backend/getting-started.md`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">Backend setup guide</Link></li>
        <li><Link href={`${repositoryUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">Contributing guide</Link></li>
      </List>
    </>
  );
}

const sectionContent: Record<string, () => ReactNode> = {
  "getting-started": GettingStarted,
  "creating-music": CreatingMusic,
  "lyrics-instrumentals": LyricsAndInstrumentals,
  "track-library": TrackLibrary,
  discover: Discover,
  "credits-billing": CreditsAndBilling,
  "account-security": AccountSecurity,
  "public-demo": PublicDemo,
  "self-hosting": SelfHosting,
};

function HelpCenterView() {
  const [activeId, setActiveId] = useState(sections[0]!.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = sectionRefs.current[section.id];
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-w-0">
      <section className="border-b bg-muted/25 px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
          <CircleHelpIcon className="size-4" aria-hidden="true" />
          Help center
        </p>
        <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-4 text-4xl font-black duration-500 sm:text-5xl lg:text-6xl">
          How can we help?
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Everything you need to create, manage, and share music with Melodyc. Still stuck?{" "}
          <a href="mailto:info@melodyc.com" className="font-medium text-primary hover:underline">
            Contact us
          </a>.
        </p>
      </section>

      <nav className="sticky top-16 z-30 overflow-x-auto border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden" aria-label="Help topics">
        <div className="flex w-max gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollTo(section.id)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium",
                  isActive ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="flex gap-16">
          <nav className="hidden w-60 shrink-0 lg:block" aria-label="Help topics">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeId === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {section.label}
                  </button>
                );
              })}
              <div className="my-4 border-t" />
              <a
                href="mailto:info@melodyc.com"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
                Contact support
              </a>
            </div>
          </nav>

          <div className="min-w-0 flex-1">
            {sections.map((section) => {
              const Content = sectionContent[section.id]!;
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(element) => {
                    sectionRefs.current[section.id] = element;
                  }}
                  className="scroll-mt-32 border-b py-10 first:pt-0 last:border-0 last:pb-0"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="text-2xl font-bold">{section.label}</h2>
                  </div>
                  <Content />
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export { HelpCenterView };