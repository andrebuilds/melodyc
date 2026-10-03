"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export default function CustomerPortalRedirect() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const portal = async () => {
      try {
        const result = await authClient.customer.portal();
        if (result?.error) setFailed(true);
      } catch {
        setFailed(true);
      }
    };
    void portal();
  }, []);

  if (failed) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="text-muted-foreground mx-auto size-10" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">
            Customer portal unavailable
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            The customer portal is available once you have a paid plan. If you
            already subscribed and still see this message, please contact
            support.
          </p>
          <Button asChild className="mt-6">
            <Link href="/billing">Back to Billing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-muted-foreground">
          Loading customer portal...
        </span>
      </div>
    </div>
  );
}
