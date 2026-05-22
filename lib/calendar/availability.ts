import "server-only";

import { addDays, addMinutes } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { queryFreeBusy } from "@/lib/calendar/googleCalendar";
import { getActiveHoldsIntervals } from "@/lib/booking/holds";
import {
  getBookingSettings,
  getDaySchedule,
  type BookingSettings,
} from "@/lib/booking/settings";
import type { SlotInterval } from "@/lib/calendar/slot";

export type { SlotInterval } from "@/lib/calendar/slot";

function overlaps(a: SlotInterval, b: SlotInterval): boolean {
  return a.start < b.end && a.end > b.start;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * `fromDay`,`toDay` are yyyy-MM-dd in clinic timezone (inclusive range).
 */
export function generateCandidateSlots(
  fromDay: string,
  toDay: string,
  settings: BookingSettings
): SlotInterval[] {
  const tz = settings.timezone;
  const slotMin = settings.slotMinutes;

  if (fromDay > toDay) return [];

  const out: SlotInterval[] = [];

  function nextYmd(ymd: string): string {
    const noon = toDate(`${ymd}T12:00:00`, { timeZone: tz });
    return formatInTimeZone(addDays(noon, 1), tz, "yyyy-MM-dd");
  }

  for (let dateStr = fromDay; ; dateStr = nextYmd(dateStr)) {
    const noon = toDate(`${dateStr}T12:00:00`, { timeZone: tz });
    const isoWeekday = parseInt(formatInTimeZone(noon, tz, "i"), 10);
    const day = getDaySchedule(settings, isoWeekday);
    if (!day?.enabled) {
      if (dateStr === toDay) break;
      continue;
    }

    const dayEndLimit = toDate(
      `${dateStr}T${pad2(day.closeHour)}:00:00`,
      { timeZone: tz }
    );

    let slotStart = toDate(`${dateStr}T${pad2(day.openHour)}:00:00`, {
      timeZone: tz,
    });

    while (true) {
      const slotEnd = addMinutes(slotStart, slotMin);
      if (slotEnd > dayEndLimit) break;
      out.push({ start: slotStart, end: slotEnd });
      slotStart = addMinutes(slotStart, slotMin);
    }

    if (dateStr === toDay) break;
  }

  return out;
}

export type SlotWithStatus = SlotInterval & { available: boolean };

/**
 * All schedule slots in range with availability (calendar busy + active holds).
 */
export async function getSlotsWithStatus(
  fromDay: string,
  toDay: string
): Promise<SlotWithStatus[]> {
  const settings = await getBookingSettings();
  const tz = settings.timezone;
  const rangeStart = toDate(`${fromDay}T00:00:00`, { timeZone: tz });
  const rangeEnd = toDate(`${toDay}T23:59:59`, { timeZone: tz });

  const candidates = generateCandidateSlots(fromDay, toDay, settings);
  if (candidates.length === 0) return [];

  const busyFromApi = await queryFreeBusy({
    timeMin: rangeStart,
    timeMax: rangeEnd,
  });

  const holds = await getActiveHoldsIntervals(rangeStart, rangeEnd);
  const busy = [...busyFromApi, ...holds];

  return candidates.map((s) => ({
    ...s,
    available: !busy.some((b) => overlaps(s, b)),
  }));
}

/**
 * Returns bookable slots for days `fromDay`–`toDay` (yyyy-MM-dd, clinic TZ).
 */
export async function getAvailableSlots(
  fromDay: string,
  toDay: string
): Promise<SlotInterval[]> {
  const slots = await getSlotsWithStatus(fromDay, toDay);
  return slots.filter((s) => s.available).map(({ start, end }) => ({ start, end }));
}
