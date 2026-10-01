import type { Metadata, Viewport } from "next";

export const siteName = "Melodyc";
const siteTitle = "Melodyc | Open-Source AI Music Generator";
export const siteDescription =
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

const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Melodyc: from a sentence to a complete song",
};

const defaultOpenGraph = {
  type: "website",
  siteName,
  locale: "en_US",
  images: [ogImage],
} satisfies Metadata["openGraph"];

const defaultTwitter = {
  card: "summary_large_image",
  images: [ogImage],
} satisfies Metadata["twitter"];

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6e6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#12242e" },
  ],
  colorScheme: "light dark",
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
    "free AI music generator",
    "AI song generator",
    "AI song maker",
    "text to music",
    "text to song",
    "lyrics to music",
    "AI lyrics generator",
    "open-source music generator",
    "self-hosted AI music",
    "ACE-Step",
    "generative AI music",
  ],
  authors: [
    { name: "Andrea D'Ambrosio", url: "https://github.com/andrebuilds" },
    { name: "Thomas Fortuna", url: "https://github.com/fortunathomas" },
  ],
  creator: "Andrea D'Ambrosio and Thomas Fortuna",
  publisher: siteName,
  category: "music",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/favicon/site.webmanifest",
  icons,
  openGraph: {
    ...defaultOpenGraph,
    url: "/",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    ...defaultTwitter,
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

// Child metadata replaces openGraph/twitter objects, so each public page must restate them.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultOpenGraph,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      ...defaultTwitter,
      title: fullTitle,
      description,
    },
  };
}
