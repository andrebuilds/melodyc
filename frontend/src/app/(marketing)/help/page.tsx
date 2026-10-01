import type { Metadata } from "next";
import { HelpCenterView } from "~/components/help/help-center-view";
import { JsonLd } from "~/components/seo/json-ld";
import { breadcrumbStructuredData } from "~/lib/structured-data";
import { pageMetadata } from "~/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Help Center",
  description:
    "Learn how to create AI songs with Melodyc: write prompts and lyrics, make instrumentals, manage your library, use credits and plans, and self-host.",
  path: "/help",
});

export default function HelpCenterPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData("Help Center", "/help")} />
      <HelpCenterView />
    </>
  );
}