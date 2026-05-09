import { CtaButton } from "@/components/CtaButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getServices } from "@/lib/content/getContent";

export const metadata = {
  title: "Treatments",
};

export default async function TreatmentsPage() {
  const services = await getServices();
  const treatments =
    services.length > 0
      ? services.map((s) => ({ title: s.name, bullets: s.shortBenefits }))
      : [
          {
            title: "Full Arch Implants (Same-day teeth / All-on-X)",
            bullets: [
              "Stable, natural-looking teeth for missing or failing dentition",
              "Digital planning and precision delivery",
              "Designed for long-term function and confidence",
            ],
          },
          {
            title: "Dental Implants (Single & Multiple)",
            bullets: [
              "Replace missing teeth with natural aesthetics",
              "Preserve bite function and oral health",
              "Planned for longevity and comfort",
            ],
          },
          {
            title: "Smile Makeovers (Veneers)",
            bullets: [
              "Refined, natural results—not overdone",
              "Designed around facial harmony",
              "A calm, specialist-led aesthetic process",
            ],
          },
          {
            title: "Full Mouth Rehabilitation",
            bullets: [
              "Complex restorative planning for worn or compromised bites",
              "Function-first dentistry with premium aesthetics",
              "A structured pathway to long-term stability",
            ],
          },
          {
            title: "Facial Aesthetics",
            bullets: [
              "Subtle, balanced enhancements",
              "Clinically-led approach to facial harmony",
              "Natural outcomes with careful planning",
            ],
          },
          {
            title: "Hygiene & Preventive Care",
            bullets: [
              "Maintain implant and restorative results long-term",
              "Professional hygiene support and advice",
              "Comfort-focused, patient-first care",
            ],
          },
        ];
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <header className="space-y-4">
          <h1 className="font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
            Treatments &amp; services
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-black/65 sm:text-base">
            Simple, benefit-driven information—delivered by specialists and
            designed for long-term results.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CtaButton href="/contact#book" variant="primary">
              Book Consultation
            </CtaButton>
            <CtaButton href="/contact" variant="secondary">
              Ask a question
            </CtaButton>
          </div>
        </header>

        <section className="mt-10 grid gap-6 pt-10 md:grid-cols-3">
          {treatments.map((t) => (
            <article
              key={t.title}
              className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
            >
              <div className="aspect-[4/3] w-full rounded-[var(--radius-card)] bg-black/5" />
              <h2 className="text-base font-semibold tracking-tight">
                {t.title}
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-black/65">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <CtaButton href="/contact#book" variant="primary">
                  Book Consultation
                </CtaButton>
                <CtaButton href="/contact" variant="secondary">
                  Contact us
                </CtaButton>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

