import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CtaButton } from "@/components/CtaButton";
import { TeamSection } from "@/components/TeamSection";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <section className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            <h1 className="font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
              Specialist-led dentistry, focused on longevity.
            </h1>
            <p className="text-sm leading-relaxed text-black/65 sm:text-base">
              Kaleidoscope Dental Specialists is a specialist-led clinic focused
              on advanced implant dentistry, full mouth rehabilitation, and
              aesthetic treatments. We combine digital workflows, precision
              planning, and high-end patient care to deliver predictable,
              long-lasting results.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaButton href="/contact#book" variant="primary">
                Book Consultation
              </CtaButton>
              <CtaButton href="/treatments" variant="secondary">
                View treatments
              </CtaButton>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10">
            <div className="aspect-[4/3] w-full rounded-[var(--radius-card)] bg-black/5" />
            <p className="mt-4 text-xs text-black/60">
              Clinic and team photography will be added.
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 pt-10 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10">
            <h2 className="font-[var(--font-serif)] text-2xl tracking-tight">
              Mission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              To provide world-class, specialist-led dental care using advanced
              technology and a patient-first approach.
            </p>
            <div className="mt-4">
              <CtaButton href="/contact#book" variant="primary">
                Book Consultation
              </CtaButton>
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10">
            <h2 className="font-[var(--font-serif)] text-2xl tracking-tight">
              Vision
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              To become a leading referral centre for implants and complex
              restorative dentistry in London.
            </p>
            <div className="mt-4">
              <CtaButton href="/contact#book" variant="primary">
                Book Consultation
              </CtaButton>
            </div>
          </div>
        </section>

        <TeamSection className="mt-12" />
      </main>
      <SiteFooter />
    </div>
  );
}

