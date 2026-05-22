import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import type { BookingSettings, DaySchedule } from "@/lib/booking/settingsTypes";

export type { BookingSettings, DaySchedule } from "@/lib/booking/settingsTypes";

export const BOOKING_SETTINGS_DOC = "booking";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function dayLabel(weekday: number): string {
  return DAY_LABELS[weekday - 1] ?? `Day ${weekday}`;
}

function envInt(name: string, fallback: number, min: number, max: number): number {
  const n = parseInt(process.env[name] ?? String(fallback), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function defaultDaysFromEnv(): DaySchedule[] {
  const open = envInt("BOOKING_OPEN_HOUR", 9, 0, 23);
  const close = envInt("BOOKING_CLOSE_HOUR", 17, 1, 24);
  const raw = process.env.BOOKING_WEEKDAYS ?? "1,2,3,4,5";
  const enabledSet = new Set(
    raw
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => n >= 1 && n <= 7)
  );
  if (enabledSet.size === 0) [1, 2, 3, 4, 5].forEach((d) => enabledSet.add(d));

  return [1, 2, 3, 4, 5, 6, 7].map((weekday) => ({
    weekday,
    enabled: enabledSet.has(weekday),
    openHour: open,
    closeHour: close,
  }));
}

export function defaultBookingSettings(): BookingSettings {
  return {
    timezone: process.env.BOOKING_TIMEZONE ?? "Europe/London",
    slotMinutes: envInt("BOOKING_SLOT_MINUTES", 45, 15, 240),
    depositPence: envInt("BOOKING_DEPOSIT_PENCE", 5000, 100, 1_000_000),
    currency: (process.env.BOOKING_CURRENCY ?? "gbp").toLowerCase(),
    holdMinutes: envInt("BOOKING_HOLD_MINUTES", 20, 5, 120),
    days: defaultDaysFromEnv(),
  };
}

function clampHour(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function normalizeDaySchedule(raw: Partial<DaySchedule>): DaySchedule | null {
  const weekday = raw.weekday;
  if (typeof weekday !== "number" || weekday < 1 || weekday > 7) return null;
  const openHour = clampHour(raw.openHour ?? 9, 0, 23);
  let closeHour = clampHour(raw.closeHour ?? 17, 1, 24);
  if (closeHour <= openHour) closeHour = Math.min(24, openHour + 1);
  return {
    weekday,
    enabled: Boolean(raw.enabled),
    openHour,
    closeHour,
  };
}

export function normalizeBookingSettings(
  input: Partial<BookingSettings> | null | undefined
): BookingSettings {
  const base = defaultBookingSettings();
  if (!input) return base;

  const daysByWeekday = new Map<number, DaySchedule>();
  for (const d of base.days) daysByWeekday.set(d.weekday, { ...d });

  if (Array.isArray(input.days)) {
    for (const raw of input.days) {
      const d = normalizeDaySchedule(raw);
      if (d) daysByWeekday.set(d.weekday, d);
    }
  }

  const slotMinutes = (() => {
    const legacy = input as { slotDurations?: number[] };
    const fromArray = legacy.slotDurations?.[0];
    const n = input?.slotMinutes ?? fromArray ?? base.slotMinutes;
    if (!Number.isFinite(n)) return base.slotMinutes;
    return Math.min(240, Math.max(15, Math.round(n)));
  })();

  return {
    timezone:
      typeof input.timezone === "string" && input.timezone.trim()
        ? input.timezone.trim()
        : base.timezone,
    slotMinutes,
    depositPence: (() => {
      const n = input.depositPence ?? base.depositPence;
      if (!Number.isFinite(n)) return base.depositPence;
      return Math.min(1_000_000, Math.max(100, Math.round(n)));
    })(),
    currency:
      typeof input.currency === "string" && input.currency.trim()
        ? input.currency.trim().toLowerCase()
        : base.currency,
    holdMinutes: clampHour(input.holdMinutes ?? base.holdMinutes, 5, 120),
    days: [1, 2, 3, 4, 5, 6, 7].map((w) => daysByWeekday.get(w)!),
    updatedAt: input.updatedAt,
  };
}

export function getDaySchedule(
  settings: BookingSettings,
  isoWeekday: number
): DaySchedule | undefined {
  return settings.days.find((d) => d.weekday === isoWeekday);
}

let cache: { settings: BookingSettings; at: number } | null = null;
const CACHE_MS = 30_000;

export function invalidateBookingSettingsCache(): void {
  cache = null;
}

export async function getBookingSettings(): Promise<BookingSettings> {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return cache.settings;
  }

  const db = getAdminDb();
  if (!db) {
    const settings = defaultBookingSettings();
    cache = { settings, at: Date.now() };
    return settings;
  }

  try {
    const snap = await db.collection("siteSettings").doc(BOOKING_SETTINGS_DOC).get();
    const settings = normalizeBookingSettings(
      snap.exists ? (snap.data() as Partial<BookingSettings>) : null
    );
    cache = { settings, at: Date.now() };
    return settings;
  } catch {
    return defaultBookingSettings();
  }
}

export async function saveBookingSettings(
  input: Partial<BookingSettings>
): Promise<BookingSettings> {
  const db = getAdminDb();
  if (!db) throw new Error("Database not configured");

  const settings = normalizeBookingSettings({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  await db.collection("siteSettings").doc(BOOKING_SETTINGS_DOC).set(settings, {
    merge: false,
  });

  invalidateBookingSettingsCache();
  return settings;
}
