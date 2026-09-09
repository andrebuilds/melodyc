import type { Metadata } from "next";

const siteName = "Melodyc";
const siteTitle = "Melodyc | Open-Source AI Music Generator";
const siteDescription =
  "Generate original AI music from text, lyrics, or style prompts. Use Melodyc as a hosted service or self-host the complete MIT-licensed codebase.";

const productionUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteUrl = new URL(productionUrl);

const icons: Metadata["icons"] = {
  icon: [
    { url: "/favicon/favicon.ico", sizes: "any" },
    {
      url: "/favicon/favicon-16x16.png",
      type: "image/png",
      sizes: "16x16",
    },
    {
      url: "/favicon/favicon-32x32.png",
      type: "image/png",
      sizes: "32x32",
    },
  ],
  apple: [
    {
      url: "/favicon/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  ],
};

export const siteMetadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "AI music generator",
    "open-source music generator",
    "text to music",
    "AI song generator",
    "lyrics to music",
    "self-hosted AI",
    "ACE-Step",
    "generative AI music",
  ],
  authors: [
    { name: "Andrea D'Ambrosio", url: "https://github.com/andrebuilds" },
    { name: "Thomas Fortuna", url: "https://github.com/fortunathomas" },
  ],
  creator: "Andrea D'Ambrosio and Thomas Fortuna",
  publisher: siteName,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/favicon/site.webmanifest",
  icons,
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
};

export const privatePageRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  noarchive: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};
