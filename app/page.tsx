import { CtaButton } from "@/components/CtaButton";
import { BeforeAfterCases } from "@/components/BeforeAfterCases";
import { ConcernMatcherSection } from "@/components/ConcernMatcherSection";
import { HeroFlipCard } from "@/components/HeroFlipCard";
import { ImplantTreatmentsSection } from "@/components/ImplantTreatmentsSection";
import { SiteHeader } from "@/components/SiteHeader";
import { OurProcessTimeline } from "@/components/OurProcessTimeline";
import { TrustStats } from "@/components/TrustStats";
import { TeamSection } from "@/components/TeamSection";
import { getWhatsAppHref } from "@/components/siteLinks";
import {
  getCases,
  getTeam,
  getTestimonials,
  getTreatmentsContent,
} from "@/lib/content/getContent";

export default async function Home() {
  const [cases, testimonials, treatmentsContent, team] = await Promise.all([
    getCases(),
    getTestimonials(),
    getTreatmentsContent(),
    getTeam(),
  ]);
  const carouselCases = cases
    .filter((c) => c.beforeImageUrl && c.afterImageUrl)
    .map((c) => ({
      id: c.id,
      title: c.title,
      beforeImageUrl: c.beforeImageUrl,
      afterImageUrl: c.afterImageUrl,
    }));
  return (
    <div className="min-h-full">
      <SiteHeader />
      {/* 1) Hero (fixed copy) — full-bleed */}
      <section className="page-section page-section-hero relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] text-[var(--brand-dark)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            className="absolute left-1/2 top-1/2 h-[min(240vh,2800px)] w-auto -translate-x-1/2 -translate-y-1/2 lg:h-[min(260vh,3200px)]"
            viewBox="0 0 580 820"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M290 8 L470 172 L470 648 L290 812 L110 648 L110 172 Z"
              stroke="#1E433A"
              strokeWidth="1"
              opacity="0.06"
            />
            <path
              d="M290 129 L416 243 L416 577 L290 691 L164 577 L164 243 Z"
              stroke="#1E433A"
              strokeWidth="1"
              opacity="0.05"
            />
            <path
              d="M290 249 L362 315 L362 505 L290 571 L218 505 L218 315 Z"
              stroke="#1E433A"
              strokeWidth="1"
              opacity="0.04"
            />
          </svg>
        </div>

        <div className="page-section-inner relative">
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
            <h1 className="font-[var(--font-serif)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Permanent,<br />
                Natural-Looking Teeth.<br />
                Delivered by a Specialist.
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-[var(--brand-dark)]/80 sm:text-lg">
                Advanced implant and restorative dentistry designed for long-term
                function, aesthetics, and confidence.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CtaButton
                  href="/book"
                  variant="primary"
                  className="h-11"
                >
                  Book Your Consultation
                </CtaButton>
                <CtaButton
                  href={getWhatsAppHref("Hi, I’d like to book a consultation.")}
                  variant="secondary"
                  className="h-11"
                >
                  Message us on WhatsApp
                </CtaButton>
              </div>
              <ul className="grid gap-3 pt-2 text-sm text-[var(--brand-dark)]/85 sm:grid-cols-3">
                <li className="rounded-2xl bg-white/50 p-4 ring-1 ring-[var(--brand-dark)]/10">
                  Consultant-led care
                </li>
                <li className="rounded-2xl bg-white/50 p-4 ring-1 ring-[var(--brand-dark)]/10">
                  Advanced digital planning
                </li>
                <li className="rounded-2xl bg-white/50 p-4 ring-1 ring-[var(--brand-dark)]/10">
                  Natural, long-lasting results
                </li>
              </ul>
            </div>

            <HeroFlipCard
              src="/images/hero-checkup-v2.png"
              alt="A smiling patient receiving a dental checkup in a modern, bright clinic"
            />
          </div>
        </div>
      </section>

      <ConcernMatcherSection />

      <ImplantTreatmentsSection
        treatments={treatmentsContent.treatments}
        flagshipSlug={treatmentsContent.flagshipSlug}
        treatmentImages={treatmentsContent.treatmentImages}
      />

        {carouselCases.length > 0 ? (
          <section className="page-section bg-linear-to-r from-[var(--section-cream)] via-[var(--section-cream-warm)] to-[var(--section-cream)]">
            <div className="page-section-inner">
              <div className="mx-auto mb-8 max-w-xl text-center">
                <div className="mx-auto inline-flex rounded-full bg-[var(--charcoal)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--gold)]">
                  BEFORE &amp; AFTER
                </div>
                <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight">
                  Real cases, presented clinically.
                </h2>
                <p className="mt-3 text-sm text-black/65">
                  Consistent framing. Clear labels. No heavy editing.
                </p>
              </div>
            </div>

            <BeforeAfterCases cases={carouselCases} />

            <div className="page-section-inner mt-6 sm:hidden">
              <CtaButton href="/book" variant="primary" className="w-full">
                Book Consultation
              </CtaButton>
            </div>
          </section>
        ) : null}

        {/* 5) Team / specialists */}
        <section
          className="page-section bg-[radial-gradient(circle_at_100%_100%,var(--section-cream)_0%,var(--section-cream-mid)_55%,var(--section-cream-sage)_100%)]"
          aria-label="Our specialists"
        >
          <div className="page-section-inner">
            <TeamSection
              members={team}
              className="rounded-none bg-transparent px-0 py-0 shadow-none ring-0"
            />
          </div>
        </section>

        <OurProcessTimeline />

        {/* 7) Testimonials + trust stats */}
        <TrustStats
          testimonials={
            testimonials.length > 0
              ? testimonials.map((t) => ({
                  quote: t.quote,
                  name: t.patientNameInitials || "Patient",
                }))
              : undefined
          }
        />

        {/* 8) Final CTA (video background) */}
        <section className="page-section relative min-h-[min(18rem,38svh)]! overflow-hidden py-14! text-white sm:min-h-[min(20rem,42svh)]! sm:py-16!">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
          >
            <source src="/dental.mp4" type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 bg-[#022c22]/55"
            aria-hidden
          />
          <div className="page-section-inner relative z-10">
          <div className="grid gap-5 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-[var(--font-serif)] text-2xl tracking-tight sm:text-3xl">
                Ready to discuss your options?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                Book a consultation to explore implants, full arch options, or
                smile transformations — with clear guidance and a calm, clinical
                process.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <CtaButton href="/book" variant="secondary">
                Book Consultation
              </CtaButton>
              <CtaButton
                href={getWhatsAppHref("Hi, I’d like to book a consultation.")}
                variant="ghost"
              >
                WhatsApp
              </CtaButton>
            </div>
          </div>
          </div>
        </section>
    </div>
  );
}
