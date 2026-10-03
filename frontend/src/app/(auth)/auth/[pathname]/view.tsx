"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import Link from "next/link";
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
        <>
          <AuthCard
            pathname={pathname}
            classNames={
              pathname === "sign-up"
                ? {
                    base: "sm:max-w-2xl",
                    form: {
                      // Name|Email and Password|Confirm side by side; checkboxes and button full width.
                      base: "sm:grid-cols-2 sm:gap-x-4 sm:[&>*:nth-child(n+5)]:col-span-2",
                    },
                  }
                : undefined
            }
          />
          {pathname === "sign-up" && (
            <p className="text-muted-foreground max-w-sm text-center text-xs leading-5">
              Before creating your account, read the{" "}
              <Link href="/terms" target="_blank" className="text-primary underline-offset-4 hover:underline">
                Terms and Conditions
              </Link>
              , including Section 16, and the{" "}
              <Link href="/privacy" target="_blank" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </>
      )}
    </main>
  );
}
