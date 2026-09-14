"use client";

import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { subscriptionPlans, type ProductSlug } from "~/lib/pricing";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Upgrade() {
  const [pendingSlug, setPendingSlug] = useState<ProductSlug | null>(null);

  const upgrade = async (slug: ProductSlug) => {
    setPendingSlug(slug);

    try {
      await authClient.checkout({ slug });
    } finally {
      setPendingSlug(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {subscriptionPlans.map((pack) => (
        <Card
          key={pack.slug}
          className={`relative flex rounded-md ${pack.featured ? "border-2 border-primary shadow-md" : ""}`}
        >
          {pack.featured && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Most popular
            </span>
          )}
          <div className="flex w-full flex-col">
            <CardHeader>
              <CardTitle>{pack.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p>
                <span className="text-4xl font-black">{pack.price}</span>
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  /month
                </span>
              </p>
              <CardDescription className="mt-4 min-h-20 leading-6">
                {pack.description}
              </CardDescription>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{pack.credits} song generations every month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>Unused credits roll over</span>
                </li>
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={pack.featured ? "default" : "outline"}
                disabled={pendingSlug !== null}
                onClick={() => upgrade(pack.slug)}
              >
                {pendingSlug === pack.slug
                  ? "Opening checkout..."
                  : `Subscribe to ${pack.name}`}
              </Button>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
