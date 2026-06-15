import "server-only";

/** Base URL for Stripe redirects; set in production. */
export function getAppBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? "";
  const trimmed = explicit.replace(/\/$/, "");
  const isLocalhost =
    trimmed.includes("localhost") || trimmed.includes("127.0.0.1");

  if (trimmed && !isLocalhost) return trimmed;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (trimmed) return trimmed;

  return "http://localhost:3000";
}

export function getStripeSecretKey(): string | null {
  const k = process.env.STRIPE_SECRET_KEY;
  return k?.startsWith("sk_") ? k : null;
}

export function getStripeWebhookSecret(): string | null {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  return s?.startsWith("whsec_") ? s : null;
}

export function getGoogleCalendarId(): string | null {
  const id = process.env.GOOGLE_CALENDAR_ID?.trim();
  return id || null;
}
