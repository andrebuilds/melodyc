import type { Metadata } from "next";
import { JsonLd } from "~/components/seo/json-ld";
import { LegalContent, LegalPageHero } from "~/components/legal/legal-layout";
import { getLegalLanguage } from "~/lib/legal-language";
import { PRIVACY_POLICY_UPDATED_AT, PRIVACY_POLICY_UPDATED_AT_IT } from "~/lib/legal";
import { breadcrumbStructuredData } from "~/lib/structured-data";
import { pageMetadata } from "~/lib/site-metadata";
import { PrivacyContentEn } from "./content-en";
import { PrivacyContentIt } from "./content-it";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Melodyc collects, uses, and protects your personal data, and how to exercise your rights under the GDPR.",
  path: "/privacy",
});

export default async function PrivacyPolicyPage() {
  const lang = await getLegalLanguage();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <JsonLd data={breadcrumbStructuredData("Privacy Policy", "/privacy")} />
      <LegalPageHero
        lang={lang}
        title={lang === "it" ? "Informativa sulla privacy" : "Privacy Policy"}
        updatedAt={
          lang === "it"
            ? PRIVACY_POLICY_UPDATED_AT_IT
            : PRIVACY_POLICY_UPDATED_AT
        }
      />
      <LegalContent>
        {lang === "it" ? <PrivacyContentIt /> : <PrivacyContentEn />}
      </LegalContent>
    </div>
  );
}
