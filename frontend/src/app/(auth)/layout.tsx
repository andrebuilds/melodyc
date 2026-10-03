import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import { CookieBanner } from "~/components/cookie-banner";
import { ConsentedAnalytics } from "~/components/consented-analytics";
import { Providers } from "~/components/providers";
import { SiteHeader } from "~/components/layout/site-header";
import { Toaster } from "~/components/ui/sonner";
import {
  privatePageRobots,
  siteMetadata,
  siteViewport,
} from "~/lib/site-metadata";

export const viewport: Viewport = siteViewport;

export const metadata: Metadata = {
  ...siteMetadata,
  robots: privatePageRobots,
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <CookieBanner />
          <Toaster />
        </Providers>
        <ConsentedAnalytics />
      </body>
    </html>
  );
}
