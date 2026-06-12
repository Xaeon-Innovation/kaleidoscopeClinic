"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { CLINIC } from "@/components/siteLinks";
import type { OpeningHourRow } from "@/lib/booking/openingHours";

type PublicFooterClientProps = {
  openingHours: OpeningHourRow[];
};

export function PublicFooterClient({ openingHours }: PublicFooterClientProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <Footer
      clinicName={CLINIC.name}
      phone={CLINIC.phoneDisplay}
      email={CLINIC.email}
      tagline="Specialist-led implant and restorative dentistry, focused on predictable, long-lasting outcomes."
      openingHours={openingHours}
      onSubscribe={(email) => console.log("Subscribed:", email)}
    />
  );
}
