export type DaySchedule = {
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  weekday: number;
  enabled: boolean;
  openHour: number;
  closeHour: number;
};

export type BookingSettings = {
  timezone: string;
  slotMinutes: number;
  depositPence: number;
  currency: string;
  holdMinutes: number;
  days: DaySchedule[];
  updatedAt?: string;
};
