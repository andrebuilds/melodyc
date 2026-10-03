"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { authClient } from "~/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthUIProvider
        authClient={authClient}
        redirectTo="/discover"
        emailVerification
        credentials={{ confirmPassword: true }}
        additionalFields={{
          acceptedTerms: {
            label: "I accept the Terms and Conditions and the Privacy Policy",
            type: "boolean",
            required: true,
          },
          acceptedClauses: {
            label:
              "I specifically approve the clauses listed in Section 16 of the Terms (Arts. 1341-1342 Italian Civil Code)",
            type: "boolean",
            required: true,
          },
        }}
        signUp={{ fields: ["name", "acceptedTerms", "acceptedClauses"] }}
        deleteUser
        settings={{ basePath: "/account" }}
        navigate={(url) => router.push(url)}
        replace={(url) => router.replace(url)}
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh();
        }}
        Link={Link}
      >
        {children}
      </AuthUIProvider>
    </ThemeProvider>
  );
}
