"use client";

import { usePathname } from "next/navigation";
import { StickyMobileBar } from "./StickyMobileBar";
import { WhatsAppWidget } from "./WhatsAppWidget";

export function PublicChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <StickyMobileBar />
      <WhatsAppWidget />
    </>
  );
}
