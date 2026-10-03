import { cookies, headers } from "next/headers";

export type LegalLanguage = "en" | "it";

export const LEGAL_LANGUAGE_COOKIE = "legal_lang";

// Explicit choice from the IT/EN switcher wins, then the browser language.
export async function getLegalLanguage(): Promise<LegalLanguage> {
  const saved = (await cookies()).get(LEGAL_LANGUAGE_COOKIE)?.value;
  if (saved === "it" || saved === "en") return saved;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  return primary.startsWith("it") ? "it" : "en";
}
