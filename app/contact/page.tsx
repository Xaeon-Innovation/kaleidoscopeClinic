import { CtaButton } from "@/components/CtaButton";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, getWhatsAppHref } from "@/components/siteLinks";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildDentistJsonLd } from "@/lib/seo/jsonld";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Contact Kaleidoscope Dental Specialists in Marylebone, London W1. Call, email, WhatsApp, or send a message — we are here to help with your enquiry.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-full">
      <JsonLd id="jsonld-dentist" data={buildDentistJsonLd()} />
      <SiteHeader />

      <ContactHeroSection />

      <section className="page-section bg-white">
        <div className="page-section-inner">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)] ring-1 ring-black/10">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5">
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps?q=1%20Orchard%20St%2C%20London%20W1H%206HJ&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-3 text-xs text-black/60">
                Map: 1 Orchard St, London W1H 6HJ
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <CtaButton href={getWhatsAppHref()} variant="secondary">
                  Message on WhatsApp
                </CtaButton>
                <CtaButton href={CLINIC.phoneHref} variant="secondary">
                  Call {CLINIC.phoneDisplay}
                </CtaButton>
              </div>
            </div>

            <div
              id="message"
              className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
            >
              <h2 className="font-[var(--font-serif)] text-2xl tracking-tight">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                Leave your details and message below — we’ll get back to you as
                soon as we can.
              </p>

              <LeadForm sourcePage="/contact" variant="contact" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
