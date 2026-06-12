import { ReferralForm } from "@/components/ReferralForm";
import { ReferralHeroSection } from "@/components/referral/ReferralHeroSection";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC } from "@/components/siteLinks";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Refer a Patient",
  description:
    "Refer patients for dental implants and specialist restorative care to Kaleidoscope Dental Specialists in Marylebone, London.",
  path: "/referral",
});

export default function ReferralPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <ReferralHeroSection />

      <section id="referral-form" className="page-section bg-white">
        <div className="page-section-inner max-w-3xl">
          <ReferralForm />

          <p className="mt-10 border-t border-[var(--brand-dark)]/10 pt-8 text-xs leading-relaxed text-[var(--brand-dark)]/60">
            This form transmits personal and health information for clinical
            triage. Ensure you have appropriate consent to share patient details.
            If you need help, contact us on{" "}
            <a
              className="font-medium text-[var(--brand-dark)] underline underline-offset-2"
              href={CLINIC.phoneHref}
            >
              {CLINIC.phoneDisplay}
            </a>{" "}
            or email{" "}
            <a
              className="font-medium text-[var(--brand-dark)] underline underline-offset-2"
              href={`mailto:${CLINIC.email}`}
            >
              {CLINIC.email}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
