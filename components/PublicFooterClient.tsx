"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { CLINIC } from "@/components/siteLinks";
import type { OpeningHourRow } from "@/lib/booking/openingHours";
import type { PublicContactSettings } from "@/lib/site/contactSettingsTypes";

type PublicFooterClientProps = {
  openingHours: OpeningHourRow[];
  contact: PublicContactSettings;
};

export function PublicFooterClient({
  openingHours,
  contact,
}: PublicFooterClientProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <Footer
      clinicName={CLINIC.name}
      contact={contact}
      tagline="Specialist-led implant and restorative dentistry in Marylebone, London — focused on predictable, long-lasting outcomes."
      openingHours={openingHours}
      onSubscribe={(email) => console.log("Subscribed:", email)}
    />
  );
}
