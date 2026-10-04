import { db } from "~/server/db";
import { absoluteUrl, verifyUnsubscribeToken } from "~/lib/email";

const LABELS = {
  songReady: "song ready",
  songFailed: "generation failed",
  newFollower: "new follower",
  productUpdates: "product update",
} as const;

function page(title: string, body: string) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" /><title>${title} | Melodyc</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f4f5;color:#18181b;">
<main style="max-width:480px;margin:64px auto;padding:32px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;">
<a href="${absoluteUrl("/")}" style="font-size:20px;font-weight:800;color:#d04f99;text-decoration:none;">Melodyc</a>
<h1 style="font-size:22px;margin:20px 0 12px;">${title}</h1>${body}
</main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

const invalidLink = () =>
  page(
    "Invalid link",
    `<p style="line-height:24px;color:#3f3f46;">This unsubscribe link is invalid. You can manage your email preferences from your <a href="${absoluteUrl("/account/notifications")}" style="color:#d04f99;">notification settings</a>.</p>`,
  );

// GET only shows a confirmation, so link scanners cannot unsubscribe users by prefetching.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const data = verifyUnsubscribeToken(token);
  if (!data) return invalidLink();

  return page(
    "Unsubscribe",
    `<p style="line-height:24px;color:#3f3f46;">Stop receiving ${LABELS[data.type]} emails from Melodyc?</p>
<form method="post" action="?token=${encodeURIComponent(token)}"><button type="submit" style="margin-top:8px;padding:12px 22px;border:0;border-radius:6px;background:#d04f99;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">Unsubscribe</button></form>`,
  );
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const data = verifyUnsubscribeToken(token);
  if (!data) return invalidLink();

  await db.notificationPreference.upsert({
    where: { userId: data.userId },
    create: { userId: data.userId, [data.type]: false },
    update: { [data.type]: false },
  });

  return page(
    "You are unsubscribed",
    `<p style="line-height:24px;color:#3f3f46;">You will no longer receive ${LABELS[data.type]} emails. You can change this at any time from your <a href="${absoluteUrl("/account/notifications")}" style="color:#d04f99;">notification settings</a>.</p>`,
  );
}
