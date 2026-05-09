import { ReferralForm } from "@/components/ReferralForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC } from "@/components/siteLinks";

export const metadata = {
  title: "Professional referral",
  description:
    "Refer patients for dental implants and related care to Kaleidoscope Dental Specialists.",
};

export default function ReferralPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Professional referral
          </p>
          <h1 className="font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Implant referral form
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--brand-dark)]/80 sm:text-base">
            Use this secure form to refer a patient for implant assessment or
            treatment at {CLINIC.name}. We will acknowledge receipt and follow
            up with your practice and the patient as appropriate.
          </p>
        </header>

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
      </main>
      <SiteFooter />
    </div>
  );
}
