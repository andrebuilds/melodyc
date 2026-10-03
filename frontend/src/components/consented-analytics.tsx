"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, isConsentValid } from "~/components/cookie-banner";

const STORAGE_KEY = "melodyc-cookie-consent";

function hasAnalyticsConsent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    const consent = JSON.parse(saved) as Parameters<typeof isConsentValid>[0];
    return isConsentValid(consent) && consent.analytics === true;
  } catch {
    return false;
  }
}

// Loads Vercel Analytics and Speed Insights only after analytics consent in the cookie banner.
export function ConsentedAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      const consent = hasAnalyticsConsent();
      // Scripts cannot be unloaded once injected, so a reload applies a revoked consent.
      setEnabled((previous) => {
        if (previous && !consent) window.location.reload();
        return consent;
      });
    };
    update();
    window.addEventListener(COOKIE_CONSENT_EVENT, update);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, update);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
