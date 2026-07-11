export type DaySchedule = {
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  weekday: number;
  enabled: boolean;
  openHour: number;
  closeHour: number;
};

export type WeekAvailabilityMode = "recurring" | "weeks_only";

export type WeekOverride = {
  /** yyyy-MM-dd, Monday in clinic timezone */
  weekStart: string;
  label?: string;
};

export type BookingSettings = {
  timezone: string;
  slotMinutes: number;
  depositPence: number;
  currency: string;
  holdMinutes: number;
  days: DaySchedule[];
  weekAvailabilityMode?: WeekAvailabilityMode;
  disabledWeeks?: WeekOverride[];
  enabledWeeks?: WeekOverride[];
  updatedAt?: string;
};
