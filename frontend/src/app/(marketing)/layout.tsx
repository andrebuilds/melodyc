import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteFooter } from "~/components/layout/site-footer";
import { SiteHeader } from "~/components/layout/site-header";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";
import { siteMetadata } from "~/lib/site-metadata";

export const metadata: Metadata = siteMetadata;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}