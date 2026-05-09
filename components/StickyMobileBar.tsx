"use client";

import { CLINIC, getWhatsAppHref } from "./siteLinks";
import { CtaButton } from "./CtaButton";

export function StickyMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[var(--surface)]/95 backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2 px-3 py-3">
        <CtaButton href="/contact#book" variant="primary" className="py-3">
          Book
        </CtaButton>
        <CtaButton href={CLINIC.phoneHref} variant="secondary" className="py-3">
          Call Us
        </CtaButton>
        <CtaButton
          href={getWhatsAppHref("Hi, I’d like to book a consultation.")}
          variant="ghost"
          className="py-3"
        >
          WhatsApp
        </CtaButton>
      </div>
    </div>
  );
}

