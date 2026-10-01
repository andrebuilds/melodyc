"use client";

import { BarChart3, Cookie, Megaphone, Shield, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { COOKIE_CONSENT_MAX_AGE_DAYS, COOKIE_POLICY_VERSION } from "~/lib/legal";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = Partial<CookiePreferences> & {
  policyVersion?: string;
  updatedAt?: string;
};

const STORAGE_KEY = "melodyc-cookie-consent";
export const COOKIE_CONSENT_EVENT = "melodyc:cookie-consent-updated";

const rejectAll: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function isConsentValid(consent: StoredConsent) {
  if (consent.policyVersion !== COOKIE_POLICY_VERSION || !consent.updatedAt) {
    return false;
  }
  const ageMs = Date.now() - new Date(consent.updatedAt).getTime();
  return ageMs < COOKIE_CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(rejectAll);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StoredConsent;
        setPreferences({
          necessary: true,
          analytics: parsed.analytics === true,
          marketing: parsed.marketing === true,
        });
        if (isConsentValid(parsed)) {
          setHasChoice(true);
          setIsMinimized(true);
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const panelOpen = isOpen && !isMinimized;

  const minimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...prefs,
        policyVersion: COOKIE_POLICY_VERSION,
        updatedAt: new Date().toISOString(),
      }),
    );
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setPreferences(prefs);
    setHasChoice(true);
    minimize();
    toast.success("Cookie preferences saved");
  };

  // Garante 2021 guidelines: closing the banner without a choice keeps only necessary cookies.
  const dismiss = () => {
    if (hasChoice) minimize();
    else saveConsent(rejectAll);
  };

  useEffect(() => {
    if (!panelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const openPanel = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  return (
    <>
      {isMinimized && (
        <button
          type="button"
          onClick={openPanel}
          className="animate-in slide-in-from-left fade-in fixed left-0 z-40 flex flex-col items-center gap-2 rounded-r-xl border border-l-0 bg-card px-2.5 py-4 shadow-md transition-shadow duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
          aria-label="Manage cookies"
        >
          <Cookie className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
          <span
            className="text-[10px] font-medium text-muted-foreground"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Cookies
          </span>
        </button>
      )}

      {panelOpen && (
        <div
          className="animate-in slide-in-from-bottom-24 fade-in pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-center p-4 duration-300 md:p-6"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div
            role="dialog"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-description"
            className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border bg-background/95 shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-5 p-5 sm:space-y-6 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Cookie className="size-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      id="cookie-banner-title"
                      className="text-lg font-semibold"
                    >
                      Cookie preferences
                    </h3>
                    <p
                      id="cookie-banner-description"
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      We use cookies to keep Melodyc working and, with your
                      consent, to improve your experience. Read our{" "}
                      <Link
                        href="/cookies"
                        className="underline hover:text-primary"
                      >
                        Cookie Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismiss}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label={
                    hasChoice
                      ? "Close cookie banner"
                      : "Close and continue with necessary cookies only"
                  }
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="space-y-4 rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Shield
                      className="size-4 text-green-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">Necessary</span>
                  </div>
                  <Switch checked disabled aria-label="Necessary cookies" />
                </div>
                <p className="ml-6 text-xs text-muted-foreground">
                  Essential for sign-in, security, and core features. Always
                  active.
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BarChart3
                      className="size-4 text-sky-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                    aria-label="Analytics cookies"
                  />
                </div>
                <p className="ml-6 text-xs text-muted-foreground">
                  Help us understand how the site is used so we can improve it.
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Megaphone
                      className="size-4 text-amber-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">Marketing</span>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, marketing: checked }))
                    }
                    aria-label="Marketing cookies"
                  />
                </div>
                <p className="ml-6 text-xs text-muted-foreground">
                  Used to show you content relevant to your interests.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button
                  onClick={() =>
                    saveConsent({
                      necessary: true,
                      analytics: true,
                      marketing: true,
                    })
                  }
                  className="h-11 flex-1"
                >
                  Accept all
                </Button>
                <Button
                  onClick={() => saveConsent(rejectAll)}
                  className="h-11 flex-1"
                >
                  Reject all
                </Button>
                <Button
                  onClick={() => saveConsent(preferences)}
                  variant="outline"
                  className="h-11 flex-1"
                >
                  Save preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
