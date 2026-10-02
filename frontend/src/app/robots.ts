import type { MetadataRoute } from "next";
import { siteUrl } from "~/lib/site-metadata";

// Private, authenticated, or non-content routes. Pages also send noindex where relevant.
const disallow = [
  "/api/",
  "/auth/",
  "/account/",
  "/billing",
  "/create",
  "/customer-portal",
  "/discover",
  "/my-music",
];

// AI search, answer, and assistant crawlers, explicitly welcomed for AEO/GEO visibility.
const aiCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "MistralAI-User",
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // A named group replaces "*" for that bot, so the private routes must be repeated.
      { userAgent: aiCrawlers, allow: ["/", "/llms.txt"], disallow },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
