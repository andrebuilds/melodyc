import { createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { env } from "~/env";
import { siteUrl } from "~/lib/site-metadata";

const resend = new Resend(env.RESEND_API_KEY);

const BRAND_COLOR = "#d04f99";

export const NOTIFICATION_TYPES = [
  "songReady",
  "songFailed",
  "paymentConfirmed",
  "productUpdates",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

// Signed so unsubscribe links cannot be forged for other users.
function signUnsubscribe(payload: string) {
  return createHmac("sha256", env.BETTER_AUTH_SECRET)
    .update(payload)
    .digest("base64url");
}

export function createUnsubscribeToken(userId: string, type: NotificationType) {
  const payload = Buffer.from(`${userId}:${type}`).toString("base64url");
  return `${payload}.${signUnsubscribe(payload)}`;
}

export function verifyUnsubscribeToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(signUnsubscribe(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  const [userId, type] = Buffer.from(payload, "base64url")
    .toString()
    .split(":");
  if (!userId || !NOTIFICATION_TYPES.includes(type as NotificationType)) {
    return null;
  }

  return { userId, type: type as NotificationType };
}

type EmailContent = {
  subject: string;
  preheader: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; url: string };
  footnote?: string;
};

function renderEmail(content: EmailContent, unsubscribeUrl?: string) {
  const paragraphs = content.paragraphs
    .map(
      (text) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#3f3f46;">${escapeHtml(text)}</p>`,
    )
    .join("");

  const cta = content.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:6px;background:${BRAND_COLOR};">
        <a href="${escapeHtml(content.cta.url)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(content.cta.label)}</a>
      </td></tr></table>
      <p style="margin:0 0 16px;font-size:12px;line-height:18px;color:#71717a;">If the button does not work, copy this link into your browser:<br /><a href="${escapeHtml(content.cta.url)}" style="color:${BRAND_COLOR};word-break:break-all;">${escapeHtml(content.cta.url)}</a></p>`
    : "";

  const footnote = content.footnote
    ? `<p style="margin:0;font-size:13px;line-height:20px;color:#71717a;">${escapeHtml(content.footnote)}</p>`
    : "";

  const unsubscribe = unsubscribeUrl
    ? ` &middot; <a href="${escapeHtml(unsubscribeUrl)}" style="color:#a1a1aa;">Unsubscribe</a> &middot; <a href="${absoluteUrl("/account/settings")}" style="color:#a1a1aa;">Email preferences</a>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(content.subject)}</title></head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;border:1px solid #e4e4e7;">
          <tr><td style="padding:28px 32px 0;">
            <a href="${absoluteUrl("/")}" style="text-decoration:none;">
              <img src="${absoluteUrl("/logo.png")}" width="40" height="40" alt="" style="display:inline-block;vertical-align:middle;border:0;" />
              <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-size:20px;font-weight:800;color:${BRAND_COLOR};">Melodyc</span>
            </a>
          </td></tr>
          <tr><td style="padding:20px 32px 28px;">
            <h1 style="margin:0 0 16px;font-size:22px;line-height:30px;color:#18181b;">${escapeHtml(content.heading)}</h1>
            ${paragraphs}${cta}${footnote}
          </td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;line-height:18px;color:#a1a1aa;">Melodyc &middot; <a href="${absoluteUrl("/")}" style="color:#a1a1aa;">melodyc.com</a>${unsubscribe}</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function renderText(content: EmailContent, unsubscribeUrl?: string) {
  return [
    content.heading,
    "",
    ...content.paragraphs,
    content.cta ? `\n${content.cta.label}: ${content.cta.url}` : "",
    content.footnote ? `\n${content.footnote}` : "",
    unsubscribeUrl ? `\nUnsubscribe: ${unsubscribeUrl}` : "",
  ].join("\n");
}

async function sendEmail(
  to: string,
  content: EmailContent,
  unsubscribe?: { userId: string; type: NotificationType },
) {
  const unsubscribeUrl = unsubscribe
    ? absoluteUrl(
        `/api/email/unsubscribe?token=${createUnsubscribeToken(unsubscribe.userId, unsubscribe.type)}`,
      )
    : undefined;

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: content.subject,
    html: renderEmail(content, unsubscribeUrl),
    text: renderText(content, unsubscribeUrl),
    headers: unsubscribeUrl
      ? {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }
      : undefined,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}

export function sendVerificationEmail(to: string, name: string, url: string) {
  return sendEmail(to, {
    subject: "Verify your Melodyc email",
    preheader: "Confirm your email address to start creating music.",
    heading: `Welcome to Melodyc, ${name}`,
    paragraphs: [
      "Confirm your email address to activate your account and start creating music.",
    ],
    cta: { label: "Verify email", url },
    footnote:
      "This link expires in 1 hour. If you did not create a Melodyc account, you can ignore this email.",
  });
}

export function sendResetPasswordEmail(to: string, name: string, url: string) {
  return sendEmail(to, {
    subject: "Reset your Melodyc password",
    preheader: "Use this link to choose a new password.",
    heading: "Reset your password",
    paragraphs: [
      `Hi ${name}, we received a request to reset the password for your Melodyc account.`,
    ],
    cta: { label: "Choose a new password", url },
    footnote:
      "This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email: your password will not change.",
  });
}

export function sendSongReadyEmail(
  to: string,
  userId: string,
  songTitle: string,
) {
  return sendEmail(
    to,
    {
      subject: `Your song "${songTitle}" is ready`,
      preheader: "Your new track has finished generating.",
      heading: "Your song is ready",
      paragraphs: [
        `"${songTitle}" has finished generating and is waiting for you in your library.`,
      ],
      cta: { label: "Listen now", url: absoluteUrl("/my-music") },
    },
    { userId, type: "songReady" },
  );
}

export function sendSongFailedEmail(
  to: string,
  userId: string,
  songTitle: string,
) {
  return sendEmail(
    to,
    {
      subject: "Your song could not be generated",
      preheader: "No credits were used for this generation.",
      heading: "Generation failed",
      paragraphs: [
        `We could not generate "${songTitle}". No credits were used for this attempt.`,
        "Please try again, or adjust your description if the problem continues.",
      ],
      cta: { label: "Try again", url: absoluteUrl("/create") },
    },
    { userId, type: "songFailed" },
  );
}

export function sendPaymentConfirmedEmail(
  to: string,
  userId: string,
  creditsAdded: number,
  totalCredits: number,
) {
  return sendEmail(
    to,
    {
      subject: "Payment confirmed: your credits are ready",
      preheader: `${creditsAdded} credits were added to your account.`,
      heading: "Payment confirmed",
      paragraphs: [
        `Thank you! ${creditsAdded} credits were added to your Melodyc account.`,
        `You now have ${totalCredits} credits available.`,
      ],
      cta: { label: "Create music", url: absoluteUrl("/create") },
      footnote:
        "Invoices and subscription details are available in the customer portal.",
    },
    { userId, type: "paymentConfirmed" },
  );
}
