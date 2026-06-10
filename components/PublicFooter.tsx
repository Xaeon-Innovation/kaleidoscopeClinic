import { getBookingSettings } from "@/lib/booking/settings";
import { openingHoursFromSchedule } from "@/lib/booking/openingHours";
import { PublicFooterClient } from "@/components/PublicFooterClient";

export async function PublicFooter() {
  const settings = await getBookingSettings();
  const openingHours = openingHoursFromSchedule(settings.days);

  return <PublicFooterClient openingHours={openingHours} />;
}
