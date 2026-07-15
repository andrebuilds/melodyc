# Getting Started — Melodyc Frontend

Complete step-by-step guide to build the Melodyc frontend.

**Author:** 
Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)
Thomas Fortuna — [github.com/fortunathomas](https://github.com/fortunathomas)
---

## Table of Contents

1. [Next.js — T3 Stack](#1-nextjs--t3-stack)
2. [Authentication with Better Auth](#2-authentication-with-better-auth)
3. [Database — Prisma and Neon](#3-database--prisma-and-neon)
4. [Queue — Inngest](#4-queue--inngest)
5. [Dashboard Layout](#5-dashboard-layout)
6. [Generate Songs Page](#6-generate-songs-page)
7. [Sound Bar](#7-sound-bar)
8. [Home Page](#8-home-page)
9. [Payments — Polar.sh](#9-payments--polarsh)
10. [Deployment on Vercel](#10-deployment-on-vercel)
11. [Exercises](#11-exercises)

---

## 1. Next.js — T3 Stack

### What is the T3 Stack

The **T3 Stack** is an opinionated, end-to-end type-safe set of technologies designed to build full-stack web apps quickly and safely. It was created by Theo (t3.gg) and has become one of the most popular stacks in the Next.js ecosystem.

- Official documentation: [create.t3.gg](https://create.t3.gg/)
- Repository: [github.com/t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app)

Melodyc uses Next.js 15 with the T3 Stack. The technologies included in this project are:

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router, Server Components, Server Actions |
| **TypeScript** | Type safety throughout the project |
| **Tailwind CSS 4** | Utility-first styling |
| **Prisma** | Database ORM |
| **ShadCN / Radix UI** | Accessible and customizable UI components |

> In this project **we do not use tRPC** (which is optional in the T3 Stack): all client-server communication happens via Next.js **Server Actions**.

### Project initialization

To create a new T3 project from scratch (for study purposes, not to run on this repo):

```bash
npm create t3-app@latest
```

During the wizard choose:
- TypeScript: **Yes**
- Tailwind CSS: **Yes**
- Prisma: **Yes**
- tRPC: **No** (Melodyc uses Server Actions)
- Next Auth: **No** (Melodyc uses Better Auth)
- App Router: **Yes**

### Install Melodyc dependencies

```bash
cd frontend
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Folder structure

```
frontend/src/
├── app/
│   ├── (auth)/          # Route group for authentication pages
│   │   ├── layout.tsx   # Minimal layout without sidebar
│   │   └── auth/        # Login / signup pages (managed by Better Auth UI)
│   └── (main)/          # Route group for protected pages
│       ├── layout.tsx   # Layout with sidebar, header, SoundBar
│       ├── page.tsx     # Home page (community feed)
│       └── create/      # Music generation page
│           └── page.tsx
├── actions/             # Server Actions (server logic called from client)
│   ├── generation.ts    # generateSong, getPlayUrl, getPresignedUrl
│   └── song.ts          # setPublishedStatus, renameSong, toggleLikeSong
├── components/          # React components
│   ├── create/          # Components for the /create page
│   ├── home/            # Components for the home page
│   ├── sidebar/         # Side navigation
│   ├── ui/              # ShadCN components (Button, Card, Dialog, etc.)
│   ├── providers.tsx    # Global context providers
│   └── sound-bar.tsx    # Global audio player
├── hooks/               # Custom React hooks
├── inngest/             # Inngest configuration (queue)
├── lib/                 # Utilities and configurations
│   ├── auth.ts          # Better Auth configuration (server)
│   ├── auth-client.ts   # Better Auth configuration (client)
│   └── utils.ts         # Helpers (cn, etc.)
├── server/
│   └── db.ts            # Prisma Client instance
├── stores/
│   └── use-player-store.ts  # Zustand store for the audio player
└── styles/
    └── globals.css      # Global styles and CSS variables
```

### Environment variables

Create a `.env` file in the `frontend/` folder with these variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="a-random-32-character-string"
BETTER_AUTH_URL="http://localhost:3000"

# AWS S3 (frontend user — read only)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="melodyc-bucket"

# Modal (backend endpoint URLs)
MODAL_ENDPOINT_DESCRIPTION="https://..."
MODAL_ENDPOINT_LYRICS="https://..."
MODAL_ENDPOINT_DESCRIBED_LYRICS="https://..."

# Polar.sh
POLAR_ACCESS_TOKEN="..."
POLAR_WEBHOOK_SECRET="..."
POLAR_SMALL_PRODUCT_ID="..."
POLAR_MEDIUM_PRODUCT_ID="..."
POLAR_LARGE_PRODUCT_ID="..."
```

---

## 2. Authentication with Better Auth

### What is Better Auth

**Better Auth** is a modern, type-safe and highly extensible authentication library for Next.js. It is the modern alternative to NextAuth.js, with native support for Prisma, plugins like Polar.sh, and an excellent DX.

- Documentation: [better-auth.com/docs](https://www.better-auth.com/docs)
- Repository: [github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)

### Installation

```bash
npm install better-auth
```

### Server configuration — `src/lib/auth.ts`

This file configures Better Auth on the server side. It defines providers, plugins and the database adapter:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar } from "@polar-sh/better-auth";
import { db } from "~/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    polar({
      // configurazione Polar.sh — vedi sezione Pagamenti
    }),
  ],
});
```

### Client configuration — `src/lib/auth-client.ts`

The client is used in React components to access session, login, logout:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
```

### API Route

Better Auth exposes its APIs via a catch-all route handler. Create the file `src/app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "~/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Protecting pages

To protect a page (Server Component), use `auth.api.getSession()`:

```typescript
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  // rest of the component...
}
```

### Authentication UI

Melodyc uses `@daveyplate/better-auth-ui` for ready-made login/signup pages. Alternatively, you can build the forms manually using `authClient.signIn.email()` and `authClient.signUp.email()`.

---

## 3. Database — Prisma and Neon

### What is Neon

**Neon** is a serverless PostgreSQL database designed for cloud applications. It is free for personal use and integrates perfectly with Prisma. Each project has a dedicated database with connection pooling included.

- Neon documentation: [neon.tech/docs](https://neon.tech/docs)
- Prisma documentation: [prisma.io/docs](https://www.prisma.io/docs)

### Create a database on Neon

1. Go to [neon.tech](https://neon.tech) and create an account
2. Click **New Project** and assign a name (e.g. `melodyc`)
3. Choose the closest region (e.g. `eu-west-1` for Europe)
4. Copy the **Connection string** which has this format:

```
postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require
```

5. Paste it in the `.env` file as `DATABASE_URL`

### Database schema — `prisma/schema.prisma`

The schema defines all the database models. In Melodyc the main models are:

```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  credits       Int       @default(100)   // credits for generation
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
  songs         Song[]
  likes         Like[]
  @@map("user")
}

model Song {
  id                String     @id @default(cuid())
  title             String
  s3Key             String?                          // audio key on S3
  thumbnailS3Key    String?                          // image key on S3
  status            String     @default("queued")    // queued | processing | processed | failed | no credits
  instrumental      Boolean    @default(false)
  prompt            String?
  lyrics            String?
  fullDescribedSong String?
  describedLyrics   String?
  guidanceScale     Float?
  inferStep         Float?
  audioDuration     Float?
  seed              Float?
  published         Boolean    @default(false)
  listenCount       Int        @default(0)
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  user              User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId            String
  likes             Like[]
  categories        Category[]
  @@index([s3Key])
}

model Like {
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId  String
  song    Song   @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId  String
  @@id([userId, songId])
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  songs Song[]
}
```

The `Session`, `Account` and `Verification` models are automatically managed by Better Auth.

### Prisma commands

```bash
# Generate the Prisma client after modifying the schema
npx prisma generate

# Apply migrations to the database (development)
npx prisma migrate dev --name migration-name

# Apply migrations to the database (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Sync the schema without creating a migration (not recommended in prod)
npx prisma db push
```

### Prisma Client instance — `src/server/db.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

The `globalForPrisma` pattern avoids creating too many connections during development with hot reload.

---

## 4. Queue — Inngest

### What is Inngest

**Inngest** is a platform for managing background jobs, workflows and processing queues. In Melodyc it is used to orchestrate the music generation process in the background: from receiving the user's request to updating the database with the result.

- Documentation: [inngest.com/docs](https://www.inngest.com/docs)
- Repository: [github.com/inngest/inngest](https://github.com/inngest/inngest)

### Why Inngest and not a simple API call?

Generating a song takes **1-3 minutes** on GPU. A direct HTTP request would time out. Inngest solves this problem:

1. The frontend sends an event to Inngest (`sendEvent`)
2. Inngest runs the function in the background, with automatic retry on error
3. The frontend polls to update the status
4. Inngest updates the database on completion

### Installation

```bash
npm install inngest
```

### Client — `src/inngest/client.ts`

```typescript
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "melodyc" });
```

### Inngest function — `src/inngest/functions.ts`

The function is composed of sequential steps. Each step is atomic and resumes from where it left off in case of error:

```typescript
export const generateSongFunction = inngest.createFunction(
  {
    id: "generate-song-event",
    concurrency: { limit: 1, key: "event.data.userId" }, // max 1 job per user
    onFailure: async ({ event, db }) => {
      // update status to "failed" on error
    },
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    // Step 1: check credits and prepare the request
    const { song, requestBody, endpoint } = await step.run("check-credits", async () => { ... });

    // Step 2: set status to "processing"
    await step.run("set-status-processing", async () => { ... });

    // Step 3: call the Modal backend
    const result = await step.run("fetch-modal", async () => { ... });

    // Step 4: save results in the database
    await step.run("update-song-result", async () => { ... });

    // Step 5: deduct the user's credits
    await step.run("deduct-credits", async () => { ... });
  }
);
```

### API Route for Inngest — `src/app/api/inngest/route.ts`

```typescript
import { serve } from "inngest/next";
import { inngest } from "~/inngest/client";
import { generateSongFunction } from "~/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateSongFunction],
});
```

### Start the Inngest dev server

```bash
npx inngest-cli@latest dev
```

This starts a local server that intercepts Inngest events without needing an internet connection. Open `http://localhost:8288` to see the dashboard.

---

## 5. Dashboard Layout

### Layout structure

The main layout (`src/app/(main)/layout.tsx`) wraps all protected pages. It is composed of:

```
SidebarProvider
├── AppSidebar          ← collapsible side navigation
└── SidebarInset        ← main area
    ├── Header          ← SidebarTrigger + Breadcrumb
    ├── <main>          ← page content (children)
    └── SoundBar        ← global audio player (always visible)
```

### Next.js Route groups

Next.js supports **Route Groups** — folders with a name in parentheses `(name)` that don't affect the URL but allow sharing different layouts:

- `(auth)/` → minimal layout without sidebar for login/signup
- `(main)/` → full layout with sidebar for app pages

### AppSidebar

The sidebar is built with ShadCN `Sidebar` components. It contains:
- Link to Home (`/`)
- Link to the Create page (`/create`)
- User credits indicator
- Buy credits button (Polar.sh)
- Avatar and user menu (logout)

### Dynamic Breadcrumb

The `BreadcrumbPageClient` component reads the current pathname with `usePathname()` and shows the active page name in the header breadcrumb.

---

## 6. Generate Songs Page

### Page structure

The `/create` page is divided into two side-by-side sections:

```
/create (page.tsx)
├── SongPanel           ← left panel (creation form)
└── TrackListFetcher    ← right panel (user track list)
    └── TrackList       ← client component with search and player
```

### SongPanel — `src/components/create/song-panel.tsx`

The panel has two modes selectable via `Tabs`:

**Simple mode:**
- Textarea for a free description of the song
- Clickable inspiration tags (add text to the textarea)
- Toggle for instrumental track

**Custom mode:**
- Textarea for style tags (genre, instruments, BPM, etc.)
- Lyrics mode: **Write** (custom lyrics) or **Auto** (description → Qwen generates lyrics)
- Clickable style badges

On clicking **Create**, the Server Action `generateSong()` is called.

### generateSong — `src/actions/generation.ts`

The Server Action creates **two** Song records in the database (with `guidance_scale` 7.5 and 15 to get two variants) and dispatches two Inngest events:

```typescript
export async function generateSong(request: GenerateRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  await queueSong(request, 7.5, session.user.id);
  await queueSong(request, 15, session.user.id);
}
```

### TrackList — `src/components/create/track-list.tsx`

Displays the user's tracks in a list. Handles all possible states of a Song:

| Status | UI shown |
|---|---|
| `queued` / `processing` | Spinner + "Processing song..." |
| `failed` | Error icon + "Generation failed" |
| `no credits` | Error icon + "Not enough credits" |
| `processed` | Thumbnail + title + Play/Publish/Download buttons |

On clicking a processed track, `getPlayUrl(songId)` is called which generates an S3 presigned URL and updates the Zustand store.

---

## 7. Sound Bar

### Architecture

The SoundBar is the global audio player, always visible at the bottom of the main layout. It is composed of:

- **Zustand store** (`src/stores/use-player-store.ts`) — shared state of the current track
- **SoundBar component** (`src/components/sound-bar.tsx`) — player UI
- **HTML `<audio>`** — native element for playback

### Zustand Store — `src/stores/use-player-store.ts`

```typescript
import { create } from "zustand";

interface PlayerTrack {
  id: string;
  title: string | null;
  url: string | null;
  artwork?: string | null;
  prompt: string | null;
  createdByUserName: string | null;
}

interface PlayerStore {
  track: PlayerTrack | null;
  setTrack: (track: PlayerTrack) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  track: null,
  setTrack: (track) => set({ track }),
}));
```

### How the player works

1. The user clicks on a track in `TrackList` or `SongCard`
2. `getPlayUrl(songId)` is called → Server Action that generates an S3 presigned URL expiring in 1 hour
3. The URL is passed to `setTrack()` of the Zustand store
4. `SoundBar` reacts to the `track` change via `useEffect`:
   - Sets `audioRef.current.src = track.url`
   - Calls `audioRef.current.play()`
5. The component handles: play/pause, seek, volume, track end, download

### Presigned URL

Audio files on S3 are not public. Access is done via presigned URLs generated server-side:

```typescript
export async function getPresignedUrl(key: string) {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 }); // 1 ora
}
```

---

## 8. Home Page

### Structure

The home page (`src/app/(main)/page.tsx`) is a Server Component that:

1. Verifies the user session (redirect if not authenticated)
2. Fetches all published songs (`published: true`) from the database, sorted by date
3. Generates presigned URLs for cover art
4. Divides songs into two sections:

**Trending:** songs created in the last 2 days (max 10)

**By category:** songs grouped by primary category (max 5 categories, max 10 songs per category). Songs already in Trending do not appear in categories.

### SongCard — `src/components/home/song-card.tsx`

Each card shows:
- AI cover art (S3 presigned URL)
- Song title
- Author name
- Number of likes
- On click → `getPlayUrl()` + updates Zustand store

---

## 9. Payments — Polar.sh

### What is Polar.sh

**Polar** is a monetization platform for developers. In Melodyc it is used to sell credit packages to users. It integrates directly with Better Auth via the official `@polar-sh/better-auth` plugin.

- Polar documentation: [docs.polar.sh](https://docs.polar.sh)
- Better Auth plugin documentation: [docs.polar.sh/integrate/sdk/better-auth](https://docs.polar.sh/integrate/sdk/better-auth)
- SDK repository: [github.com/polarsource/polar-js](https://github.com/polarsource/polar-js)

### Installation

```bash
npm install @polar-sh/better-auth @polar-sh/sdk
```

### Configuration

**1. Create an account on Polar** ([polar.sh](https://polar.sh)) and create an organization.

**2. Create the products** in the Polar dashboard:
- Small Pack — 10 credits
- Medium Pack — 25 credits
- Large Pack — 50 credits

Copy the ID of each product and put them in the `.env`.

**3. Configure the plugin in `auth.ts`:**

```typescript
import { polar } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN });

export const auth = betterAuth({
  // ...
  plugins: [
    polar({
      client: polarClient,
      checkout: {
        enabled: true,
        products: [
          { productId: process.env.POLAR_SMALL_PRODUCT_ID!, credits: 10 },
          { productId: process.env.POLAR_MEDIUM_PRODUCT_ID!, credits: 25 },
          { productId: process.env.POLAR_LARGE_PRODUCT_ID!, credits: 50 },
        ],
        successUrl: "/create?checkout=success",
      },
      webhooks: {
        secret: process.env.POLAR_WEBHOOK_SECRET!,
        onOrderPaid: async ({ event }) => {
          // add credits to the user after payment
          const userId = event.data.customer.externalId;
          const creditsToAdd = /* determine based on product */ 10;
          await db.user.update({
            where: { id: userId },
            data: { credits: { increment: creditsToAdd } },
          });
        },
      },
    }),
  ],
});
```

**4. Expose the Polar webhook:** Better Auth automatically manages the `/api/auth/polar/webhooks` endpoint.

**5. Configure the webhook in Polar:** go to Dashboard → Webhooks → add `https://yourdomain.com/api/auth/polar/webhooks`.

### Redirect to checkout

The Better Auth plugin exposes an `authClient.checkout()` method to open the Polar checkout:

```typescript
import { authClient } from "~/lib/auth-client";

// In the component (e.g. sidebar with "Buy Credits" button)
await authClient.checkout({ productId: "..." });
```

---

## 10. Deployment on Vercel

### What is Vercel

**Vercel** is the official deployment platform for Next.js (created by the same authors). It offers automatic deployment from GitHub, preview URLs for every PR, global CDN and native support for Server Actions and Server Components.

- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)

### Prerequisites

1. Create an account on [vercel.com](https://vercel.com) (use GitHub)
2. The Modal backend must already be deployed (see `backend/getting-started.md`)
3. The Neon database must already be configured
4. Polar products must be in **production** (not sandbox)

### Deploy

**Method 1 — Via dashboard (recommended):**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the Melodyc GitHub repository
3. Set the **Root Directory** to `frontend`
4. Add all environment variables (the same as in the `.env` file)
5. Click **Deploy**

**Method 2 — Via CLI:**

```bash
npm install -g vercel
cd frontend
vercel
```

Follow the interactive wizard. On the first deploy Vercel will ask for environment variables.

### Environment variables in production

In the Vercel dashboard (Settings → Environment Variables) add all variables from the `.env` file. Pay attention to:

- `BETTER_AUTH_URL` → use the final production URL (e.g. `https://melodyc.vercel.app`)
- `POLAR_WEBHOOK_SECRET` → use the **production** webhook secret (not sandbox)
- Modal endpoint URLs → make sure they are from the final deploy

### Inngest in production

Inngest works automatically on Vercel: when an event is received, it calls your `/api/inngest` API route hosted on Vercel. However you will need to:

1. Register your app on [app.inngest.com](https://app.inngest.com)
2. Add the `INNGEST_EVENT_KEY` variable (obtained from the Inngest dashboard) to env vars on Vercel
3. Sync the functions: from the Inngest panel → **Sync App** → enter the URL `https://yourdomain.com/api/inngest`

### Future updates

Every push to the `main` branch automatically triggers a new deploy on Vercel. For branches other than main, Vercel automatically creates a **Preview URL** — useful for testing changes before merging.

---

## 11. Exercises

These exercises should be tackled **after** completing and understanding the entire application. They are designed to push you beyond the base code and develop more advanced skills. Start from exercise 1 and proceed in order.

---

### Exercise 1 — Automatic status polling ★★☆

**Problem:** Currently the user must manually click "Refresh" to see if their song has been processed.

**Goal:** Implement an automatic polling system in `TrackList` that checks every 10 seconds the status of songs with status `queued` or `processing`, without reloading the entire page.

**Hint:** Use `setInterval` in a `useEffect`, and a Server Action that returns only the updated status of songs being processed. Cancel the interval when there are no more songs being processed.

---

### Exercise 2 — Infinite scroll on home ★★☆

**Problem:** The home page loads all songs at once (`take: 100`). With many songs this becomes slow and inefficient.

**Goal:** Implement an **infinite scroll** system: load 20 songs initially, and load the next 20 when the user reaches the bottom of the page.

**Hint:** Use `IntersectionObserver` to detect when the user reaches the bottom. Create a Server Action that accepts a `cursor` parameter (the ID of the last loaded song) and uses Prisma cursor pagination (`cursor`, `skip: 1`).

---

### Exercise 3 — Global search ★★☆

**Goal:** Add a search bar on the home page that filters songs by title, prompt or category in real time.

**Hint:** Implement debounce on the input (300ms) with `useCallback`. The search can be done client-side on already loaded data or server-side with a new Prisma query using `contains` with `mode: 'insensitive'`.

---

### Exercise 4 — Public user profile ★★★

**Goal:** Create the `/user/[id]` page that shows a user's public profile: avatar, name, number of published songs, total likes received, and the list of their published songs.

**Hint:** Use Next.js Dynamic Routes (`[id]`). Add a clickable link on the author name in `SongCard` and in `SoundBar`. Be careful not to expose sensitive data (email, credits) in the public query.

---

### Exercise 5 — Real-time notifications ★★★

**Goal:** When a song finishes being processed, show a toast notification to the user without requiring a refresh, even if they are on another page.

**Hint:** Implement an SSE (Server-Sent Events) endpoint in Next.js using `Response` with `ReadableStream`. The client connects to the endpoint and listens. When Inngest completes the generation, emit an SSE event with the song ID. Alternatively, consider using Pusher or Supabase Realtime for a more robust solution.

---

### Exercise 6 — S3 image optimization ★★★

**Problem:** Cover art is saved on S3 as full-size PNG. This slows down the home page loading.

**Goal:** Implement an automatic image resize system before uploading to S3. Images must be resized to 400x400px and converted to WebP to reduce file size.

**Hint:** In the Python backend use the `Pillow` library to resize and convert before uploading. Alternatively, use AWS Lambda with S3 Trigger to process images after upload. Update the frontend to use Next.js `<Image>` tag instead of `<img>`.

---

### Exercise 7 — Analytics dashboard ★★★

**Goal:** Add an `/analytics` page accessible only to the authenticated user that shows personal statistics: total number of generated songs, published songs, total likes received, total listens, and a chart of generations over time (last 30 days).

**Hint:** Use Prisma `groupBy` to aggregate data. For the chart use the `recharts` library (already compatible with React 19). The page must be protected server-side.

---

### Exercise 8 — Advanced rate limiting ★★★

**Problem:** A user could send dozens of generation requests in a few seconds (even if they have credits), overloading the system.

**Goal:** Implement rate limiting that restricts each user to a maximum of 5 generation requests every 10 minutes, regardless of available credits.

**Hint:** Use `upstash/ratelimit` with Redis (Upstash offers a free plan). Apply the check inside the `generateSong()` Server Action. Show a clear message to the user when the limit is exceeded, with the remaining time before they can generate again.

---

### Exercise 9 — Advanced player with queue ★★★★

**Problem:** Currently only one song can be listened to at a time and there is no continuity between tracks.

**Goal:** Extend the `SoundBar` and the Zustand store to support a playback queue. The user can add songs to the queue, skip to the next/previous track, and see the list of pending tracks. When a song ends, the next one starts automatically.

**Hint:** Modify `usePlayerStore` to manage a `queue: PlayerTrack[]` array in addition to the current `track`. Add the `addToQueue`, `playNext`, `playPrevious` actions. Update `SoundBar` to show an "Add to queue" button and track navigation.

---

### Exercise 10 — Collaborative mode ★★★★

**Goal:** Implement a **"Remix"** feature that allows a user to take a public song and generate a variant by modifying the prompt or lyrics. The remixed song must keep a reference to the original song.

**Hint:** Add an `originalSongId` field to the Prisma `Song` schema (self-referential relation). Add a "Remix" button in the home `SongCard` that pre-fills the `SongPanel` with the original song's prompt. Display the remix reference on the song page and in the feed.

---

*Melodyc Documentation — Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)*
