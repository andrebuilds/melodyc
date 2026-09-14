import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CheckIcon, CoinsIcon, CreditCardIcon } from "lucide-react";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import Upgrade from "~/components/sidebar/upgrade";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc plan"
        title="Billing"
        description="Manage your Melodyc credits, subscription, and payment details."
        icon={CreditCardIcon}
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
              <CoinsIcon className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="mt-4">Available credits</CardTitle>
            <CardDescription>Credits are added after each successful subscription payment and used whenever you generate a new song.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black tabular-nums">{user.credits}</p>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <CreditCardIcon className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="mt-4">Subscription and payments</CardTitle>
            <CardDescription>Update payment methods, review invoices, or manage your subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckIcon className="size-4 text-primary" aria-hidden="true" />Securely managed by Polar</li>
              <li className="flex items-center gap-2"><CheckIcon className="size-4 text-primary" aria-hidden="true" />Invoices and payment history</li>
            </ul>
            <Button variant="outline" asChild>
              <Link href="/customer-portal">Open customer portal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10" aria-labelledby="subscription-plans-title">
        <div className="mb-5">
          <h2 id="subscription-plans-title" className="text-2xl font-bold">
            Subscription plans
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how many songs you want to create each month. Cancel anytime.
          </p>
        </div>
        <Upgrade />
      </section>
    </div>
  );
}