"use client";

import { useRouter } from "next/navigation";
import type { LegalLanguage } from "~/lib/legal-language";
import { cn } from "~/lib/utils";

const OPTIONS: { value: LegalLanguage; label: string; name: string }[] = [
  { value: "it", label: "IT", name: "Italiano" },
  { value: "en", label: "EN", name: "English" },
];

export function LegalLanguageSwitcher({ current }: { current: LegalLanguage }) {
  const router = useRouter();

  const select = (value: LegalLanguage) => {
    if (value === current) return;
    document.cookie = `legal_lang=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  };

  return (
    <div
      role="group"
      aria-label={current === "it" ? "Lingua del documento" : "Document language"}
      className="bg-background inline-flex rounded-md border p-0.5 text-sm"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          title={option.name}
          aria-pressed={option.value === current}
          onClick={() => select(option.value)}
          className={cn(
            "rounded px-3 py-1 font-semibold transition-colors",
            option.value === current
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
