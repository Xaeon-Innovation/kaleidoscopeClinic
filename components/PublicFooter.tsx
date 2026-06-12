import { getBookingSettings } from "@/lib/booking/settings";
import { openingHoursFromSchedule } from "@/lib/booking/openingHours";
import { getPublicContactSettings } from "@/lib/site/contactSettings";
import { PublicFooterClient } from "@/components/PublicFooterClient";

export async function PublicFooter() {
  const [bookingSettings, contact] = await Promise.all([
    getBookingSettings(),
    getPublicContactSettings(),
  ]);
  const openingHours = openingHoursFromSchedule(bookingSettings.days);

  return (
    <PublicFooterClient openingHours={openingHours} contact={contact} />
  );
}
