import "server-only";

import { formatInTimeZone } from "date-fns-tz";
import { getAvailableSlots } from "@/lib/calendar/availability";
import type { SlotInterval } from "@/lib/calendar/slot";
import { getBookingSettings } from "@/lib/booking/settings";

export async function assertSlotStillAvailable(
  slot: SlotInterval
): Promise<void> {
  const { timezone: tz } = await getBookingSettings();
  const day = formatInTimeZone(slot.start, tz, "yyyy-MM-dd");
  const available = await getAvailableSlots(day, day);
  const ok = available.some(
    (s) =>
      s.start.getTime() === slot.start.getTime() &&
      s.end.getTime() === slot.end.getTime()
  );
  if (!ok) throw new Error("That time slot is no longer available.");
}
