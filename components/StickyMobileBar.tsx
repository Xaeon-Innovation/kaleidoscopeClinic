"use client";

import { CLINIC, getWhatsAppHref } from "./siteLinks";
import { CtaButton } from "./CtaButton";

export function StickyMobileBar() {
  return (
    <div
      className="sticky-mobile-bar fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[var(--surface)]/95 backdrop-blur sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-1.5 px-2 py-2.5">
        <CtaButton
          href="/book"
          variant="primary"
          className="h-auto min-h-11 px-2 py-2.5 text-xs whitespace-normal"
        >
          Book
        </CtaButton>
        <CtaButton
          href={CLINIC.phoneHref}
          variant="secondary"
          className="h-auto min-h-11 px-2 py-2.5 text-xs whitespace-normal"
        >
          Call
        </CtaButton>
        <CtaButton
          href={getWhatsAppHref("Hi, I’d like to book a consultation.")}
          variant="secondary"
          className="h-auto min-h-11 px-2 py-2.5 text-xs whitespace-normal"
        >
          WhatsApp
        </CtaButton>
      </div>
    </div>
  );
}
