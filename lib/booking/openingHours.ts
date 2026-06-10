import type { DaySchedule } from "@/lib/booking/settingsTypes";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type OpeningHourRow = {
  day: string;
  hours: string;
  highlight?: boolean;
};

function formatDisplayHour(hour: number, withPeriod: boolean): string {
  if (hour === 24) return withPeriod ? "12:00 am" : "12:00";
  const period = hour < 12 ? "am" : "pm";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const time = `${display}:00`;
  return withPeriod ? `${time} ${period}` : time;
}

function formatHoursRange(openHour: number, closeHour: number): string {
  return `${formatDisplayHour(openHour, false)} – ${formatDisplayHour(closeHour, true)}`;
}

export function openingHoursFromSchedule(days: DaySchedule[]): OpeningHourRow[] {
  const enabledDays = days.filter((day) => day.enabled);
  const maxClose = enabledDays.reduce(
    (max, day) => Math.max(max, day.closeHour),
    0
  );

  return [...days]
    .sort((a, b) => a.weekday - b.weekday)
    .map((day) => {
      const dayName = DAY_NAMES[day.weekday - 1] ?? `Day ${day.weekday}`;
      if (!day.enabled) {
        return { day: dayName, hours: "Closed" };
      }

      const highlight =
        maxClose > 18 && day.closeHour === maxClose ? true : undefined;

      return {
        day: dayName,
        hours: formatHoursRange(day.openHour, day.closeHour),
        highlight,
      };
    });
}
