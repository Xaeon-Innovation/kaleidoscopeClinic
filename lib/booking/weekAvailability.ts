import { addDays } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import type { BookingSettings, WeekOverride } from "@/lib/booking/settingsTypes";

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

export function addDaysYmd(
  ymd: string,
  days: number,
  timezone: string
): string {
  const noon = toDate(`${ymd}T12:00:00`, { timeZone: timezone });
  return formatInTimeZone(addDays(noon, days), timezone, "yyyy-MM-dd");
}

/** ISO week start (Monday) for `ymd` in clinic timezone. */
export function getIsoWeekStart(ymd: string, timezone: string): string {
  let dateStr = ymd;
  while (true) {
    const noon = toDate(`${dateStr}T12:00:00`, { timeZone: timezone });
    const isoWeekday = parseInt(formatInTimeZone(noon, timezone, "i"), 10);
    if (isoWeekday === 1) return dateStr;
    dateStr = formatInTimeZone(addDays(noon, -1), timezone, "yyyy-MM-dd");
  }
}

export function formatWeekRange(weekStart: string, timezone: string): string {
  const weekEnd = addDaysYmd(weekStart, 6, timezone);
  const startDt = toDate(`${weekStart}T12:00:00`, { timeZone: timezone });
  const endDt = toDate(`${weekEnd}T12:00:00`, { timeZone: timezone });
  const startLabel = formatInTimeZone(startDt, timezone, "d MMM");
  const endLabel = formatInTimeZone(endDt, timezone, "d MMM yyyy");
  return `${startLabel} – ${endLabel}`;
}

export function normalizeWeekOverrides(
  raw: unknown,
  timezone: string
): WeekOverride[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: WeekOverride[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const weekStartRaw = (item as WeekOverride).weekStart;
    if (typeof weekStartRaw !== "string" || !YMD_RE.test(weekStartRaw)) {
      continue;
    }
    const weekStart = getIsoWeekStart(weekStartRaw, timezone);
    if (seen.has(weekStart)) continue;
    seen.add(weekStart);
    const label = (item as WeekOverride).label;
    out.push({
      weekStart,
      ...(typeof label === "string" && label.trim()
        ? { label: label.trim().slice(0, 100) }
        : {}),
    });
  }
  return out.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export function isWeekBookable(ymd: string, settings: BookingSettings): boolean {
  const tz = settings.timezone;
  const weekStart = getIsoWeekStart(ymd, tz);
  const mode = settings.weekAvailabilityMode ?? "recurring";

  if (mode === "weeks_only") {
    return (settings.enabledWeeks ?? []).some((w) => w.weekStart === weekStart);
  }

  return !(settings.disabledWeeks ?? []).some((w) => w.weekStart === weekStart);
}

export function listUpcomingWeeks(
  fromYmd: string,
  count: number,
  timezone: string
): string[] {
  const first = getIsoWeekStart(fromYmd, timezone);
  const weeks: string[] = [];
  let current = first;
  for (let i = 0; i < count; i++) {
    weeks.push(current);
    current = addDaysYmd(current, 7, timezone);
  }
  return weeks;
}

export function todayYmdInTimezone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}
