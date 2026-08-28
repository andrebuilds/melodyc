# Melodyc — Frontend

**Author:** Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)
**Student:** Thomas Fortuna

This folder contains the **Melodyc** frontend, built with the T3 Stack on Next.js 15.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | React framework with App Router and Server Actions |
| [TypeScript](https://www.typescriptlang.org) | Type safety end-to-end |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [ShadCN / Radix UI](https://ui.shadcn.com) | Accessible UI components |
| [Prisma](https://prisma.io) | ORM for PostgreSQL |
| [Neon](https://neon.tech) | Serverless PostgreSQL database |
| [Better Auth](https://www.better-auth.com) | Authentication |
| [Inngest](https://inngest.com) | Queue and background jobs |
| [Polar.sh](https://polar.sh) | Payments and credits |
| [AWS S3](https://aws.amazon.com/s3/) | Audio and cover storage |
| [Zustand](https://zustand-demo.pmnd.rs) | State management (audio player) |
| [Vercel](https://vercel.com) | Deployment |

---

## Complete Guide

For detailed documentation on how to build this frontend step by step, read:

**[getting-started.md](getting-started.md)**

You will find instructions on:
1. Next.js — T3 Stack (initialization, structure, environment variables)
2. Authentication with Better Auth
3. Database with Prisma and Neon
4. Queue with Inngest
5. Dashboard layout
6. Music generation page
7. Sound bar and audio player
8. Home page and community feed
9. Payments with Polar.sh
10. Deployment on Vercel
11. 10 advanced optimization exercises

---

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start the Inngest queue (second terminal)
npx inngest-cli@latest dev

# Apply database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Production build
npm run build

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

*Melodyc — Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)*
