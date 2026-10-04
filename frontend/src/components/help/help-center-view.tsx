"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  Code2Icon,
  CoinsIcon,
  CompassIcon,
  DiscIcon,
  InfoIcon,
  LibraryIcon,
  Mic2Icon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UsersIcon,
  WandSparklesIcon,
} from "lucide-react";
import { CREDITS_SUPPORT_EMAIL, SIGN_UP_CREDITS } from "~/lib/credits";
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
  { id: "track-library", label: "Track library", icon: DiscIcon },
  { id: "my-music", label: "My Music", icon: LibraryIcon },
  { id: "discover", label: "Discover", icon: CompassIcon },
  { id: "profile-community", label: "Profile and community", icon: UsersIcon },
  { id: "credits", label: "Credits", icon: CoinsIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
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
        with your email and password, then confirm your email address with the link we send you. You need to verify your email before you can sign in. Once your account is confirmed, you receive a welcome email and {SIGN_UP_CREDITS} free credits, with no credit card required.
      </Paragraph>
      <Heading>Find your way around</Heading>
      <Paragraph>After signing in, the sidebar gives you three main destinations:</Paragraph>
      <List>
        <li><strong className="text-foreground">Discover</strong> for published music from the community and from the creators you follow.</li>
        <li><strong className="text-foreground">Create</strong> for generating new tracks and following their progress.</li>
        <li><strong className="text-foreground">My Music</strong> for your complete library, downloads, and publishing.</li>
      </List>
      <Paragraph>
        The account menu at the bottom of the sidebar opens My profile, Credits, and your account settings.
      </Paragraph>
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
        <li>Melodyc queues one song for your request.</li>
        <li>Your track appears immediately with a queued or processing status and a temporary title.</li>
        <li>The AI composes the audio, writes a short title in the language of the song, and designs a matching album cover.</li>
        <li>When the song is ready, the cover, title, and your credit balance update automatically, without reloading the page.</li>
        <li>If you enabled it, you also receive a &quot;Your song is ready&quot; email.</li>
      </List>
      <Callout title="Credit usage">
        Each successfully generated song uses one credit, so a completed Create request uses one credit. Failed generations are not charged.
      </Callout>
      <Paragraph>
        Descriptions, lyrics, and styles can contain up to 500 characters each. Song titles can contain up to 100 characters.
      </Paragraph>
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
        The Create workspace shows the tracks you are generating next to the creation panel. Search by title or prompt, refresh the list, and follow queued, processing, completed, failed, or no-credit states.
      </Paragraph>
      <Heading>Play and organize</Heading>
      <List>
        <li>Select a completed track to load it into the audio player. Close the player at any time with the X button.</li>
        <li>Rename, download, or delete a track from its actions menu.</li>
        <li>Publish a track to make it available in Discover, or unpublish it to make it private again.</li>
        <li>Remove failed or no-credit tracks with the trash icon. They never use credits.</li>
      </List>
      <Callout title="Private by default">
        Your generated tracks stay private until you explicitly publish them.
      </Callout>
    </>
  );
}

function MyMusic() {
  return (
    <>
      <Heading>Your complete library</Heading>
      <Paragraph>
        <Link href="/my-music" className="font-medium text-primary hover:underline">My Music</Link> shows every song you have created as cover cards, with search by title, prompt, or category. A badge on each cover tells you whether the song is Public or Private.
      </Paragraph>
      <Heading>Manage each song</Heading>
      <List>
        <li><strong className="text-foreground">Publish or Make private</strong> to control whether the song appears in Discover and on your profile.</li>
        <li><strong className="text-foreground">Rename</strong> to replace the AI-generated title with your own.</li>
        <li><strong className="text-foreground">Delete</strong> to permanently remove the song, its audio files, and its cover. This cannot be undone.</li>
      </List>
      <Heading>Download in studio quality</Heading>
      <List>
        <li><strong className="text-foreground">WAV</strong>: the original lossless file.</li>
        <li><strong className="text-foreground">MP3</strong>: 320 kbps, ideal for sharing and mobile devices.</li>
        <li><strong className="text-foreground">FLAC</strong>: lossless and smaller than WAV.</li>
        <li><strong className="text-foreground">Cover image</strong>: the album artwork of the song.</li>
      </List>
      <Callout title="Older songs">
        Songs created before multi-format export was introduced are available in WAV only.
      </Callout>
    </>
  );
}

function Discover() {
  return (
    <>
      <Heading>Explore community music</Heading>
      <Paragraph>
        Discover collects tracks that creators have chosen to publish. Songs from the creators you follow appear first, recent music appears in Trending, and categorized tracks are grouped by their primary genre or mood.
      </Paragraph>
      <Heading>Search, listen, and like</Heading>
      <List>
        <li>Search published music by title, prompt, or category.</li>
        <li>Select cover art to play a track in the global audio player.</li>
        <li>Like a track to support the creator, or select the heart again to remove your like.</li>
        <li>Select a creator name to open their profile.</li>
        <li>Keep scrolling to load more published music automatically.</li>
      </List>
    </>
  );
}

function ProfileCommunity() {
  return (
    <>
      <Heading>Your public profile</Heading>
      <Paragraph>
        Every creator has a profile page with their name, profile picture, published songs, likes received, followers, and following. Open yours from <strong className="text-foreground">My profile</strong> in the account menu.
      </Paragraph>
      <Heading>Username and profile picture</Heading>
      <List>
        <li>Choose a public username in <Link href="/account/settings" className="font-medium text-primary hover:underline">Account settings</Link>: your profile becomes available at /user/your-username. Use 3 to 24 lowercase letters, numbers, or underscores.</li>
        <li>Upload a PNG, JPEG, or WebP profile picture. It is cropped to a square and replaces your initials across Melodyc. You can remove it at any time.</li>
        <li>Pick a Melodyc mascot in Account settings. It replaces the logo in your sidebar and appears on your public profile.</li>
      </List>
      <Heading>Follow other creators</Heading>
      <List>
        <li>Select <strong className="text-foreground">Follow</strong> on a creator&apos;s profile to see their new published songs in Discover. Select <strong className="text-foreground">Following</strong> to unfollow.</li>
        <li>Select the followers or following count to see the list of people and open their profiles.</li>
        <li>When someone follows you, you can receive an email notification.</li>
      </List>
      <Callout title="What others can see">
        Other signed-in users can see your name, username, profile picture, follower and following lists, and only the songs you publish.
      </Callout>
    </>
  );
}

function Credits() {
  return (
    <>
      <Heading>How credits work</Heading>
      <Paragraph>
        Melodyc is free. One completed song uses one credit, and failed generations are never charged. Your current balance appears in the dashboard header and on the <Link href="/credits" className="font-medium text-primary hover:underline">Credits</Link> page, which you can open from the account menu at the bottom of the sidebar.
      </Paragraph>
      <Heading>Getting more credits</Heading>
      <Paragraph>
        Every new account starts with {SIGN_UP_CREDITS} free credits. Credits cannot be purchased: if you run out, write to{" "}
        <a href={`mailto:${CREDITS_SUPPORT_EMAIL}`} className="font-medium text-primary hover:underline">{CREDITS_SUPPORT_EMAIL}</a>{" "}
        and the team will top up your account.
      </Paragraph>
      <Callout title="Gamification is coming soon">
        Daily missions, weekly challenges, streaks, and badges will soon let you earn new credits just by being active in the community.
      </Callout>
    </>
  );
}

function Notifications() {
  return (
    <>
      <Heading>In-app notifications</Heading>
      <Paragraph>
        The bell icon next to your credits shows your recent activity. A pink badge counts the notifications you have not seen yet, and the list updates automatically every 30 seconds.
      </Paragraph>
      <List>
        <li>Someone likes one of your songs or starts following you.</li>
        <li>A song reaches a listen milestone, such as 10, 50, 100, or 1,000 listens.</li>
        <li>A song is ready or could not be generated.</li>
        <li>Credits are added to your account by the team.</li>
      </List>
      <Paragraph>
        Opening the panel marks everything as read. Select a notification to open the related song, profile, or page. Notifications from the last 90 days are shown.
      </Paragraph>
      <Heading>Emails we send</Heading>
      <List>
        <li><strong className="text-foreground">Song ready</strong> and <strong className="text-foreground">Generation failed</strong> when a generation finishes.</li>
        <li><strong className="text-foreground">New follower</strong> when someone starts following you.</li>
        <li><strong className="text-foreground">Product updates</strong> about new features, off by default.</li>
      </List>
      <Heading>Choose what you receive</Heading>
      <Paragraph>
        Turn each email on or off in <Link href="/account/notifications" className="font-medium text-primary hover:underline">Notifications</Link>, or use the Unsubscribe link at the bottom of any notification.
      </Paragraph>
      <Callout title="Security emails">
        Email verification, welcome, and password reset emails are always sent because they are needed to protect your account.
      </Callout>
    </>
  );
}

function AccountSecurity() {
  return (
    <>
      <Heading>Account settings</Heading>
      <Paragraph>
        Visit <Link href="/account/settings" className="font-medium text-primary hover:underline">Account settings</Link> to update your profile picture, name, email, and public username.
      </Paragraph>
      <Heading>Security controls</Heading>
      <Paragraph>
        The <Link href="/account/security" className="font-medium text-primary hover:underline">Security</Link> page contains password, connected provider, and active session controls. These settings are visible only to you.
      </Paragraph>
      <Heading>Forgot your password?</Heading>
      <Paragraph>
        Select <strong className="text-foreground">Forgot password</strong> on the sign-in page and enter your email. The link we send expires after one hour and lets you choose a new password. Use the eye icon to check what you typed.
      </Paragraph>
      <Heading>Delete your account</Heading>
      <Paragraph>
        At the bottom of the Security page you can permanently delete your account after confirming your password. This removes your profile, songs, audio files, covers, profile picture, followers, and preferences. Download the songs you want to keep first.
      </Paragraph>
      <Heading>Cookies and analytics</Heading>
      <Paragraph>
        Melodyc uses only necessary cookies by default. Cookieless analytics (Vercel Web Analytics and Speed Insights) run only if you allow Analytics in the cookie banner. Change your choice at any time with the cookie tab on the bottom left of the page, and read the details in the <Link href="/cookies" className="font-medium text-primary hover:underline">Cookie Policy</Link>.
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
        The studio demo on the homepage creates a 30-second preview from a text prompt. You can choose instrumental mode, play the result from its cover card or the built-in player, and download it without using account credits.
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
        Melodyc is open source under the MIT license. The repository includes the Next.js application, Python AI backend, database schema, queue workflows, authentication, and storage integration.
      </Paragraph>
      <Heading>What you need</Heading>
      <List>
        <li>Node.js and Python 3.12 for the frontend and backend.</li>
        <li>PostgreSQL through Neon and private object storage through AWS S3.</li>
        <li>Modal for GPU inference and Inngest for background workflows.</li>
        <li>Better Auth for accounts and Resend for emails.</li>
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
  "my-music": MyMusic,
  discover: Discover,
  "profile-community": ProfileCommunity,
  credits: Credits,
  notifications: Notifications,
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