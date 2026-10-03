import type { Metadata } from "next";
import { JsonLd } from "~/components/seo/json-ld";
import { LegalContent, LegalPageHero } from "~/components/legal/legal-layout";
import { breadcrumbStructuredData } from "~/lib/structured-data";
import { pageMetadata } from "~/lib/site-metadata";
import { getLegalLanguage } from "~/lib/legal-language";
import { TERMS_UPDATED_AT, TERMS_UPDATED_AT_IT } from "~/lib/legal";
import { TermsContentEn } from "./content-en";
import { TermsContentIt } from "./content-it";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description:
    "The terms that govern your use of Melodyc, including credits, subscriptions, AI-generated music, and your rights as a user.",
  path: "/terms",
});

export default async function TermsPage() {
  const lang = await getLegalLanguage();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <JsonLd data={breadcrumbStructuredData("Terms and Conditions", "/terms")} />
      <LegalPageHero
        lang={lang}
        title={lang === "it" ? "Termini e condizioni" : "Terms and Conditions"}
        updatedAt={lang === "it" ? TERMS_UPDATED_AT_IT : TERMS_UPDATED_AT}
      />
      <LegalContent>
        {lang === "it" ? <TermsContentIt /> : <TermsContentEn />}
      </LegalContent>
    </div>
  );
}
