import { CtaButton } from "@/components/CtaButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC, getWhatsAppHref } from "@/components/siteLinks";
import { LeadForm } from "@/components/LeadForm";
import Script from "next/script";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Kaleidoscope Dental Specialists",
    url: "https://kaleidoscopedental.co.uk",
    telephone: "+447745325295",
    email: "Hello@kaleidoscopedentalspecialists@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Orchard St",
      addressLocality: "London",
      postalCode: "W1H 6HJ",
      addressCountry: "GB",
    },
  };
  return (
    <div className="min-h-full">
      <Script
        id="jsonld-dentist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <header className="grid gap-6 md:grid-cols-2 md:items-end">
          <div className="space-y-4">
            <h1 className="font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
              Contact &amp; location
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-black/65 sm:text-base">
              By appointment, with evening availability. Choose the contact
              route that’s easiest for you.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaButton href="#book" variant="primary">
                Book Consultation
              </CtaButton>
              <CtaButton
                href={getWhatsAppHref("Hi, I’d like to book a consultation.")}
                variant="secondary"
              >
                WhatsApp
              </CtaButton>
              <a
                href={CLINIC.phoneHref}
                className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--gold)] ring-1 ring-[var(--gold)] hover:bg-black/[0.03]"
              >
                Call
              </a>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10">
            <div className="text-sm font-semibold tracking-tight">Address</div>
            <div className="mt-2 text-sm text-black/70">
              <div>{CLINIC.addressLines[0]}</div>
              <div>{CLINIC.addressLines[1]}</div>
            </div>
            <div className="mt-4 text-sm text-black/70">
              <div className="font-semibold tracking-tight">Hours</div>
              <div className="mt-1">By appointment • Evening availability</div>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-6 pt-10 md:grid-cols-2">
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
            id="book"
            className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
          >
            <h2 className="font-[var(--font-serif)] text-2xl tracking-tight">
              Book a consultation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-black/65">
              Share a few details and we’ll respond as soon as possible.
            </p>

            <LeadForm sourcePage="/contact" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

