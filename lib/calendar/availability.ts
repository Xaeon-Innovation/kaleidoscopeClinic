import "server-only";

import { addDays, addMinutes } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { queryFreeBusy } from "@/lib/calendar/googleCalendar";
import { getActiveHoldsIntervals } from "@/lib/booking/holds";
import type { SlotInterval } from "@/lib/calendar/slot";
import {
  getBookingCloseHour,
  getBookingOpenHour,
  getBookingSlotMinutes,
  getBookingTimezone,
  getBookingWeekdays,
} from "@/lib/booking/config";

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
  toDay: string
): SlotInterval[] {
  const tz = getBookingTimezone();
  const slotMin = getBookingSlotMinutes();
  const openH = getBookingOpenHour();
  const closeH = getBookingCloseHour();
  const weekdays = new Set(getBookingWeekdays());

  if (fromDay > toDay) return [];

  const out: SlotInterval[] = [];

  function nextYmd(ymd: string): string {
    const noon = toDate(`${ymd}T12:00:00`, { timeZone: tz });
    return formatInTimeZone(addDays(noon, 1), tz, "yyyy-MM-dd");
  }

  for (let dateStr = fromDay; ; dateStr = nextYmd(dateStr)) {
    const noon = toDate(`${dateStr}T12:00:00`, { timeZone: tz });
    const isoWeekday = parseInt(formatInTimeZone(noon, tz, "i"), 10);
    if (weekdays.has(isoWeekday)) {
      const dayEndLimit = toDate(`${dateStr}T${pad2(closeH)}:00:00`, {
        timeZone: tz,
      });

      let slotStart = toDate(`${dateStr}T${pad2(openH)}:00:00`, {
        timeZone: tz,
      });

      while (true) {
        const slotEnd = addMinutes(slotStart, slotMin);
        if (slotEnd > dayEndLimit) break;
        out.push({ start: slotStart, end: slotEnd });
        slotStart = addMinutes(slotStart, slotMin);
      }
    }

    if (dateStr === toDay) break;
  }

  return out;
}

function subtractBusy(
  slots: SlotInterval[],
  busy: SlotInterval[]
): SlotInterval[] {
  return slots.filter((s) => !busy.some((b) => overlaps(s, b)));
}

/**
 * Returns bookable slots for days `fromDay`–`toDay` (yyyy-MM-dd, clinic TZ).
 */
export async function getAvailableSlots(
  fromDay: string,
  toDay: string
): Promise<SlotInterval[]> {
  const tz = getBookingTimezone();
  const rangeStart = toDate(`${fromDay}T00:00:00`, { timeZone: tz });
  const rangeEnd = toDate(`${toDay}T23:59:59`, { timeZone: tz });

  const candidates = generateCandidateSlots(fromDay, toDay);
  if (candidates.length === 0) return [];

  const busyFromApi = await queryFreeBusy({
    timeMin: rangeStart,
    timeMax: rangeEnd,
  });

  const holds = await getActiveHoldsIntervals(rangeStart, rangeEnd);

  const busy = [...busyFromApi, ...holds];
  return subtractBusy(candidates, busy);
}
