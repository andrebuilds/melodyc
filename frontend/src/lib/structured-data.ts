import { faqs } from "~/lib/faqs";
import { legalEntity } from "~/lib/legal";
import { subscriptionPlans } from "~/lib/pricing";
import { repositoryUrl } from "~/lib/site-config";
import { siteDescription, siteName, siteUrl } from "~/lib/site-metadata";

const url = (path: string) => new URL(path, siteUrl).toString();

const organizationId = url("/#organization");
const websiteId = url("/#website");
const applicationId = url("/#software");

const founders = [
  {
    "@type": "Person",
    name: "Andrea D'Ambrosio",
    url: "https://github.com/andrebuilds",
  },
  {
    "@type": "Person",
    name: "Thomas Fortuna",
    url: "https://github.com/fortunathomas",
  },
];

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        legalName: legalEntity.name,
        url: url("/"),
        logo: {
          "@type": "ImageObject",
          url: url("/logo.png"),
        },
        email: legalEntity.email,
        founder: founders,
        sameAs: [repositoryUrl],
        address: {
          "@type": "PostalAddress",
          streetAddress: legalEntity.address,
          addressCountry: "IT",
        },
        vatID: legalEntity.vatNumber,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: url("/"),
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": applicationId,
        name: siteName,
        description: siteDescription,
        url: url("/"),
        image: url("/og-image.png"),
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "AI music generator",
        operatingSystem: "Web browser",
        inLanguage: "en",
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        codeRepository: repositoryUrl,
        publisher: { "@id": organizationId },
        author: founders,
        featureList: [
          "Generate complete songs from a text description",
          "Turn your own lyrics into music",
          "AI-written lyrics from a described theme",
          "Vocal and instrumental tracks",
          "AI-generated song titles and cover art",
          "Downloads in WAV, MP3, and FLAC",
          "Personal music library with public and private songs",
          "Publish and discover community music",
          "Creator profiles, followers, and notifications",
          "Self-hostable MIT-licensed codebase",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            description: "20 free credits on sign-up, no credit card required.",
            price: 0,
            priceCurrency: "USD",
            url: url("/auth/sign-up"),
          },
          ...subscriptionPlans.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            description: `${plan.credits} credits per month. ${plan.description}`,
            price: Number(plan.price.replace(/[^0-9.]/g, "")),
            priceCurrency: "USD",
            url: url("/#pricing"),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: Number(plan.price.replace(/[^0-9.]/g, "")),
              priceCurrency: "USD",
              billingDuration: "P1M",
              unitCode: "MON",
            },
          })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": url("/#faq"),
        isPartOf: { "@id": websiteId },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function breadcrumbStructuredData(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: url("/") },
      { "@type": "ListItem", position: 2, name, item: url(path) },
    ],
  };
}
