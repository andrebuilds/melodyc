import "~/styles/globals.css";

import { CompassIcon, HomeIcon, LogInIcon } from "lucide-react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Providers } from "~/components/providers";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { privatePageRobots, siteMetadata } from "~/lib/site-metadata";

export const metadata: Metadata = {
  ...siteMetadata,
  title: "Page not found | Melodyc",
  description: "The page you are looking for does not exist.",
  robots: privatePageRobots,
  alternates: { canonical: null },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function GlobalNotFound() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isSignedIn = Boolean(session);

  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-svh">
        <Providers>
          <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
            />

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
              <Image
                src="/logo.png"
                alt="Melodyc"
                width={112}
                height={112}
                priority
                className="size-24 object-contain sm:size-28"
              />

              <p className="mt-8 font-mono text-sm font-bold tracking-widest text-primary uppercase">
                Error 404
              </p>
              <h1 className="mt-3 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                This track went off beat.
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                The page you are looking for does not exist or has been moved.
                {isSignedIn
                  ? " Head back to your studio and keep creating."
                  : " Head back home and start making music."}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {isSignedIn ? (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/discover">
                        <CompassIcon aria-hidden="true" />
                        Back to dashboard
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/create">Create a song</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/">
                        <HomeIcon aria-hidden="true" />
                        Back to home
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/auth/sign-in">
                        <LogInIcon aria-hidden="true" />
                        Sign in
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
