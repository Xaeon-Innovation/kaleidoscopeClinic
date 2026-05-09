import "server-only";

/** Base URL for Stripe redirects; set in production. */
export function getAppBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? "";
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
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

export function getBookingDepositPence(): number {
  const raw = process.env.BOOKING_DEPOSIT_PENCE ?? "5000";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 100 ? n : 5000;
}

export function getBookingCurrency(): string {
  return (process.env.BOOKING_CURRENCY ?? "gbp").toLowerCase();
}

export function getBookingTimezone(): string {
  return process.env.BOOKING_TIMEZONE ?? "Europe/London";
}

export function getBookingSlotMinutes(): number {
  const n = parseInt(process.env.BOOKING_SLOT_MINUTES ?? "45", 10);
  return Number.isFinite(n) && n >= 15 && n <= 240 ? n : 45;
}

export function getBookingHoldMinutes(): number {
  const n = parseInt(process.env.BOOKING_HOLD_MINUTES ?? "20", 10);
  return Number.isFinite(n) && n >= 5 && n <= 120 ? n : 20;
}

export function getBookingOpenHour(): number {
  const n = parseInt(process.env.BOOKING_OPEN_HOUR ?? "9", 10);
  return Number.isFinite(n) && n >= 0 && n <= 23 ? n : 9;
}

export function getBookingCloseHour(): number {
  const n = parseInt(process.env.BOOKING_CLOSE_HOUR ?? "17", 10);
  return Number.isFinite(n) && n >= 1 && n <= 24 ? n : 17;
}

/** Weekdays 1=Mon … 7=Sun (ISO). Default Mon–Fri. */
export function getBookingWeekdays(): number[] {
  const raw = process.env.BOOKING_WEEKDAYS ?? "1,2,3,4,5";
  const parts = raw.split(",").map((s) => parseInt(s.trim(), 10));
  const set = parts.filter((n) => n >= 1 && n <= 7);
  return set.length > 0 ? set : [1, 2, 3, 4, 5];
}
