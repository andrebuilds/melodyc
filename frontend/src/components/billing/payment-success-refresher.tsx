"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const REFRESH_INTERVAL_MS = 3000;
const MAX_REFRESHES = 10;

// Polar credits arrive via webhook after the redirect, so refresh until they show up.
export function PaymentSuccessRefresher({ credits }: { credits: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCredits = useRef(credits);
  const isPaymentSuccess = searchParams.get("payment") === "success";
  const creditsChanged = credits !== initialCredits.current;

  useEffect(() => {
    if (!isPaymentSuccess || creditsChanged) return;

    let refreshes = 0;
    const intervalId = window.setInterval(() => {
      refreshes += 1;
      router.refresh();
      if (refreshes >= MAX_REFRESHES) window.clearInterval(intervalId);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaymentSuccess, creditsChanged, router]);

  return null;
}
