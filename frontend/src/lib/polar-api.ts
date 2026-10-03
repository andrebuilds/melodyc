import { env } from "~/env";
import { siteUrl } from "~/lib/site-metadata";

// Direct REST calls: the installed @polar-sh/better-auth/sdk versions cannot set `return_url`.
const API_BASE =
  env.POLAR_SERVER === "production"
    ? "https://api.polar.sh/v1"
    : "https://sandbox-api.polar.sh/v1";

async function polarRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new PolarApiError(response.status, `Polar ${path} failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

class PolarApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type PolarCustomer = { id: string };

// Users created before the switch to production have no production customer yet.
export async function ensurePolarCustomer(user: {
  id: string;
  email: string;
  name: string;
}) {
  try {
    return await polarRequest<PolarCustomer>(
      `/customers/external/${encodeURIComponent(user.id)}`,
    );
  } catch (error) {
    if (!(error instanceof PolarApiError) || error.status !== 404) throw error;
  }

  return polarRequest<PolarCustomer>("/customers/", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      external_id: user.id,
    }),
  });
}

export async function createPolarCheckout(customerId: string, productId: string) {
  const checkout = await polarRequest<{ url: string }>("/checkouts/", {
    method: "POST",
    body: JSON.stringify({
      products: [productId],
      customer_id: customerId,
      success_url: new URL(
        "/billing?payment=success&checkout_id={CHECKOUT_ID}",
        siteUrl,
      ).toString(),
      return_url: new URL("/billing", siteUrl).toString(),
    }),
  });
  return checkout.url;
}

export async function createPolarPortalSession(customerId: string) {
  const session = await polarRequest<{ customer_portal_url: string }>(
    "/customer-sessions/",
    {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        return_url: new URL("/billing", siteUrl).toString(),
      }),
    },
  );
  return session.customer_portal_url;
}
