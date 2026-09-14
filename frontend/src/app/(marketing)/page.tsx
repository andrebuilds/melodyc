import Link from "next/link";
import {
  AudioWaveformIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  Code2Icon,
  CreditCardIcon,
  GithubIcon,
  LifeBuoyIcon,
  MusicIcon,
  ScrollTextIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FeatureShowcase } from "~/components/marketing/feature-showcase";
import { FreeStudioDemo } from "~/components/marketing/free-studio-demo";
import { subscriptionPlans } from "~/lib/pricing";
import { repositoryUrl } from "~/lib/site-config";

const faqs = [
  {
    question: "Can Melodyc really turn one sentence into a song?",
    answer:
      "Yes. Describe the mood, story, genre, or sound in your head and Melodyc turns it into a complete original track. Add your own lyrics and creative direction when you want more control.",
  },
  {
    question: "What if I have never produced music before?",
    answer:
      "That is exactly where Melodyc shines. You bring the idea; the studio handles the composition and production. Start with a prompt, listen to the result, and refine your sound as you go.",
  },
  {
    question: "What can I create with my 20 free credits?",
    answer:
      "Twenty original songs. One credit creates one complete track, so you have plenty of room to test ideas, explore genres, and find your sound before choosing a plan.",
  },
  {
    question: "Will I lose the credits I do not use this month?",
    answer:
      "No. Every unused credit rolls over and stays in your balance. Your next monthly allowance is added on top, so inspiration never has to follow a billing calendar.",
  },
  {
    question: "Can I change my mind about a subscription?",
    answer:
      "Of course. Manage or cancel your subscription anytime from the customer portal in Billing. No support ticket, no hidden steps, and no long-term commitment.",
  },
  {
    question: "Why is the entire platform open source?",
    answer:
      "Because your creative tools should be yours. Melodyc is MIT licensed, so you can inspect every line, run it on your infrastructure, and keep complete control of your models, storage, and data.",
  },
] as const;

export default function MarketingHomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div aria-hidden="true" className="absolute inset-0 opacity-35">
          {[22, 30, 38, 46, 54].map((top) => (
            <span
              key={top}
              className="absolute right-0 left-0 h-px bg-primary/30"
              style={{ top: `${top}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:pt-28 lg:pb-20">
          <div className="max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-xs">
              <AudioWaveformIcon className="size-4" aria-hidden="true" />
              Open-source AI music studio
            </div>
            <h1 className="text-5xl leading-[1.05] font-black tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Turn your ideas into original music.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Go from a sentence to an original track. Shape the lyrics, style,
              and mood, then listen to your idea come alive.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  <MusicIcon aria-hidden="true" />
                  Create your first song
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={repositoryUrl} target="_blank" rel="noreferrer">
                  <GithubIcon aria-hidden="true" />
                  View on GitHub
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Hosted for convenience. Free to self-host under the MIT license.
            </p>
          </div>

          <FreeStudioDemo />
        </div>
      </section>

      <FeatureShowcase />

      <section id="pricing" className="scroll-mt-24 border-b bg-muted/35 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
              <CreditCardIcon className="size-4" aria-hidden="true" />
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Start free, then create at your pace.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Get 20 free credits when you join. Upgrade for monthly credits with rollover, or run the complete studio on your own infrastructure.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.slug}
                className={`relative flex rounded-md ${plan.featured ? "border-2 border-primary shadow-md" : ""}`}
              >
                {plan.featured && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <CardContent className="flex w-full flex-col p-6">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p>
                      <span className="text-4xl font-black">{plan.price}</span>
                      <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
                    </p>
                    <CardDescription className="mt-3 max-w-md leading-6">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <ul className="mt-7 space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      {plan.credits} song generations monthly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      Unused credits roll over
                    </li>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button
                      className={`w-full ${plan.featured ? "" : "border-primary/70 hover:border-primary"}`}
                      variant={plan.featured ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/auth/sign-up">Start free - get 20 credits</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="flex rounded-md border-dashed lg:col-span-3">
              <CardContent className="grid w-full gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Code2Icon className="size-5 text-primary" aria-hidden="true" />
                    <CardTitle>Self-hosted</CardTitle>
                  </div>
                  <p className="mt-2 text-3xl font-black">Free forever</p>
                  <CardDescription className="mt-2 leading-6">
                    Run the complete MIT-licensed Melodyc platform on your own infrastructure with full control over models, storage, and data.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/70 hover:border-primary"
                  asChild
                >
                  <Link href={repositoryUrl} target="_blank" rel="noreferrer">
                    <GithubIcon aria-hidden="true" />
                    View repository
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-b bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
              <CircleHelpIcon className="size-4" aria-hidden="true" />
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
              Everything you need to know before creating your first track.
            </p>
          </div>

          <div className="mt-10 border-y">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b last:border-b-0"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold marker:content-none">
                  {faq.question}
                  <ChevronDownIcon
                    className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-open:grid-rows-[1fr] group-open:opacity-100">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl -translate-y-2 pb-5 leading-7 text-muted-foreground transition-transform duration-300 ease-out group-open:translate-y-0">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/help">
                <LifeBuoyIcon aria-hidden="true" />
                Help center
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/changelog">
                <ScrollTextIcon aria-hidden="true" />
                Changelog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="open-source" className="scroll-mt-24 border-b bg-secondary py-20 text-secondary-foreground sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <div className="flex items-center gap-3">
              <GithubIcon className="size-7" aria-hidden="true" />
              <span className="font-mono text-sm font-bold uppercase">MIT licensed</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Your music stack should be yours.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 opacity-80">Inspect every line, run Melodyc on your own infrastructure, and build on top of the same complete codebase that powers the hosted product.</p>
          <Button size="lg" variant="outline" className="mt-9 border-secondary-foreground/40 bg-transparent" asChild>
            <Link href={repositoryUrl} target="_blank" rel="noreferrer">
              <Code2Icon aria-hidden="true" />
              Explore the code
            </Link>
          </Button>
        </div>
      </section>

    </>
  );
}