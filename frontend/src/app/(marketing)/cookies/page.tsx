import type { Metadata } from "next";
import { JsonLd } from "~/components/seo/json-ld";
import { breadcrumbStructuredData } from "~/lib/structured-data";
import { pageMetadata } from "~/lib/site-metadata";
import { LegalContent, LegalPageHero } from "~/components/legal/legal-layout";
import {
  COOKIE_POLICY_UPDATED_AT,
  COOKIE_POLICY_UPDATED_AT_IT,
} from "~/lib/legal";
import { getLegalLanguage } from "~/lib/legal-language";
import { CookieContentEn } from "./content-en";
import { CookieContentIt } from "./content-it";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "Learn which cookies and similar technologies Melodyc uses, why, and how to manage your preferences.",
  path: "/cookies",
});

export default async function CookiePolicyPage() {
  const lang = await getLegalLanguage();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <JsonLd data={breadcrumbStructuredData("Cookie Policy", "/cookies")} />
      <LegalPageHero
        lang={lang}
        title={lang === "it" ? "Cookie Policy" : "Cookie Policy"}
        updatedAt={
          lang === "it" ? COOKIE_POLICY_UPDATED_AT_IT : COOKIE_POLICY_UPDATED_AT
        }
      />
      <LegalContent>
        {lang === "it" ? <CookieContentIt /> : <CookieContentEn />}
      </LegalContent>
    </div>
  );
}
