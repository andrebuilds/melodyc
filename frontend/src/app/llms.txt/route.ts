import { faqs } from "~/lib/faqs";
import { legalEntity } from "~/lib/legal";
import { subscriptionPlans } from "~/lib/pricing";
import { repositoryUrl } from "~/lib/site-config";
import { siteUrl } from "~/lib/site-metadata";

export const dynamic = "force-static";

// Follows the llms.txt proposal: https://llmstxt.org
export function GET() {
  const url = (path: string) => new URL(path, siteUrl).toString();

  const plans = subscriptionPlans
    .map(
      (plan) =>
        `- **${plan.name}**: ${plan.price} per month, ${plan.credits} credits (${plan.credits} songs). ${plan.description}`,
    )
    .join("\n");

  const faq = faqs
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const body = `# Melodyc

> Melodyc is an open-source AI music generator that turns a text description, custom lyrics, or style prompts into complete original songs with vocals, instruments, and cover art. It is available as a hosted web studio at ${siteUrl.host} and as an MIT-licensed codebase that anyone can self-host.

Melodyc is built for creators, songwriters, content makers, and people with no music production experience. Users describe the song they imagine, optionally write their own lyrics or let the AI write them, choose vocal or instrumental mode, and receive a finished track they can play, download, and publish.

## Key facts

- **Category**: AI music generator, text-to-music, lyrics-to-music, AI song generator.
- **Inputs**: a free-text song description, custom lyrics, or AI-written lyrics from a described theme, plus genre and style tags.
- **Outputs**: complete songs with vocals or instrumentals, AI-generated lyrics and style tags, automatic categories, and an AI-generated cover image.
- **AI models**: open-source models running on dedicated GPU infrastructure: ACE-Step for music, Qwen2 for lyrics and tags, SDXL-Turbo for cover images.
- **Privacy**: user prompts, lyrics, and songs are not sent to third-party AI providers and are not used to train AI models.
- **Free tier**: 20 free credits on sign-up, no credit card required. One credit generates one complete song, and credits are only used when a generation succeeds.
- **Free demo**: a short song can be generated from the homepage without an account, once per day.
- **Ownership**: Melodyc claims no ownership of generated songs; users may use them for any lawful purpose, including commercial use, subject to the Terms.
- **Community**: users can publish songs to Discover, browse music by genre and mood, search, and like tracks.
- **Open source**: the full platform is released under the MIT License and can be self-hosted with your own models, storage, and database.
- **Language of the interface**: English.
- **Operator**: ${legalEntity.name}, Italy (EU). Personal data is processed under the GDPR.

## Pricing

Monthly subscriptions billed through Polar (Merchant of Record, taxes calculated at checkout). Unused credits roll over every month, and subscriptions can be cancelled anytime from the Billing page.

${plans}

## Main pages

- [Home](${url("/")}): product overview, free demo, features, pricing, FAQ, and open-source information.
- [Help Center](${url("/help")}): documentation for creating music, lyrics and instrumentals, the track library, Discover, credits and billing, account security, the public demo, and self-hosting.
- [Changelog](${url("/changelog")}): new features, improvements, and fixes shipped to Melodyc.
- [Sign up](${url("/auth/sign-up")}): create a free account with 20 credits.

## Open source

- [GitHub repository](${repositoryUrl}): complete source code of the web app and the AI backend.
- [MIT License](${repositoryUrl}/blob/main/LICENSE.MD): license terms for the codebase.
- [Contributing guide](${repositoryUrl}/blob/main/CONTRIBUTING.md): how to contribute to Melodyc.

## Frequently asked questions

${faq}

## Optional

- [Privacy Policy](${url("/privacy")}): how personal data is collected, used, and protected under the GDPR.
- [Terms and Conditions](${url("/terms")}): rules for using the service, credits, subscriptions, refunds, and rights on AI-generated music.
- [Cookie Policy](${url("/cookies")}): cookies and similar technologies used by Melodyc.
- Contact: ${legalEntity.email}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
