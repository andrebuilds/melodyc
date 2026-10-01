import type { MetadataRoute } from "next";
import {
  COOKIE_POLICY_VERSION,
  PRIVACY_POLICY_UPDATED_AT,
  TERMS_UPDATED_AT,
} from "~/lib/legal";
import { siteUrl } from "~/lib/site-metadata";

// Update when the page content changes, so crawlers get a reliable freshness signal.
const CONTENT_UPDATED_AT = {
  home: "2026-10-01",
  help: "2026-09-14",
  changelog: "2026-09-14",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();

  return [
    {
      url: url("/"),
      lastModified: new Date(CONTENT_UPDATED_AT.home),
      changeFrequency: "weekly",
      priority: 1,
      images: [url("/og-image.png")],
    },
    {
      url: url("/help"),
      lastModified: new Date(CONTENT_UPDATED_AT.help),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/changelog"),
      lastModified: new Date(CONTENT_UPDATED_AT.changelog),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: url("/privacy"),
      lastModified: new Date(PRIVACY_POLICY_UPDATED_AT),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/terms"),
      lastModified: new Date(TERMS_UPDATED_AT),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/cookies"),
      lastModified: new Date(COOKIE_POLICY_VERSION),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
