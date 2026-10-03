"use server";

import { headers } from "next/headers";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import {
  createPolarCheckout,
  createPolarPortalSession,
  ensurePolarCustomer,
} from "~/lib/polar-api";
import type { ProductSlug } from "~/lib/pricing";

const PRODUCT_IDS: Record<ProductSlug, string> = {
  track: env.POLAR_TRACK_PRODUCT_ID,
  ep: env.POLAR_EP_PRODUCT_ID,
  discography: env.POLAR_DISCOGRAPHY_PRODUCT_ID,
};

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("You must be signed in.");
  return session.user;
}

export async function startCheckout(slug: ProductSlug) {
  const user = await requireUser();
  const productId = PRODUCT_IDS[slug];
  if (!productId) throw new Error("Unknown plan.");

  const customer = await ensurePolarCustomer(user);
  return createPolarCheckout(customer.id, productId);
}

export async function openCustomerPortal() {
  const user = await requireUser();
  const customer = await ensurePolarCustomer(user);
  return createPolarPortalSession(customer.id);
}
