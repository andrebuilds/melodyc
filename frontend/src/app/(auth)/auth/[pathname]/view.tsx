"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import { Suspense } from "react";
import { ResetPasswordForm } from "~/components/auth/reset-password-form";

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <main className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      {pathname === "reset-password" ? (
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      ) : (
        <AuthCard pathname={pathname} />
      )}
    </main>
  );
}
