"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { authClient } from "~/lib/auth-client";

export default function CustomerPortalRedirect() {
  useEffect(() => {
    const portal = async () => {
      await authClient.customer.portal();
    };
    void portal();
  }, []);

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
