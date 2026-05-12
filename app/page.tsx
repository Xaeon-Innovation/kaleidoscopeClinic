import { CtaButton } from "@/components/CtaButton";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamSection } from "@/components/TeamSection";
import { getWhatsAppHref } from "@/components/siteLinks";
import { getCases, getServices, getTestimonials } from "@/lib/content/getContent";

export default async function Home() {
  const [services, cases, testimonials] = await Promise.all([
    getServices(),
    getCases(),
    getTestimonials(),
  ]);
  const keyTreatments =
    services.length > 0
      ? services
          .filter((s) => Boolean(s.heroFlag))
          .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
          .slice(0, 3)
      : null;
  return (
    <div className="min-h-full">
      <SiteHeader />
      {/* 1) Hero (fixed copy) — full-bleed */}
      <section className="relative overflow-hidden bg-[var(--surface-warm)] text-[var(--brand-dark)]">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-[var(--brand-dark)]/10" />
          <div className="absolute -right-10 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-[var(--brand-dark)]/10" />
          <div className="absolute -right-32 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full border border-[var(--brand-dark)]/5" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="font-[var(--font-serif)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Permanent, Natural-Looking Teeth. Delivered by a Specialist.
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-[var(--brand-dark)]/80 sm:text-lg">
                Advanced implant and restorative dentistry designed for long-term
                function, aesthetics, and confidence.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CtaButton
                  href="/contact#book"
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

            <div className="rounded-[24px] bg-white/50 p-6 ring-1 ring-[var(--brand-dark)]/10">
              <div className="aspect-[4/3] w-full rounded-[20px] bg-black/5" />
              <p className="mt-4 text-sm text-[var(--brand-dark)]/70">
                Clinic imagery and before/after cases will be added here (real
                patient photography, neutral backgrounds).
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-0 sm:px-6">

        {/* 2) Trust / Authority */}
        <section className="py-12">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto inline-flex rounded-full bg-[var(--charcoal)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--gold)]">
              TRUSTED • SPECIALIST-LED • PRECISE
            </div>
            <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight">
              Trusted, precise, patient-first.
            </h2>
            <p className="mt-3 text-sm text-black/65">
              Short, clear reasons patients choose Kaleidoscope.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Specialist-led treatment",
                copy: "Complex cases planned for long-term results.",
              },
              {
                title: "Digital workflows",
                copy: "Precision planning for predictable outcomes.",
              },
              {
                title: "Concierge-style care",
                copy: "Quality over volume, with evening availability.",
              },
              {
                title: "Predictable results",
                copy: "Natural aesthetics built for longevity.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
              >
                <div className="text-sm font-semibold tracking-tight text-black">
                  {c.title}
                </div>
                <div className="mt-3 text-sm text-black/65">{c.copy}</div>
                <div className="mt-5">
                  <CtaButton href="/contact#book" variant="primary">
                    Book Consultation
                  </CtaButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3) Key Treatments */}
        <section className="py-12">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto inline-flex rounded-full bg-[var(--gold)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--ink-on-gold)]">
              KEY TREATMENTS
            </div>
            <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight">
              Focused treatments, specialist delivered.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(keyTreatments
              ? keyTreatments.map((s) => ({
                  title: s.name,
                  copy:
                    s.educationalCopy ||
                    "Specialist-led dentistry designed for long-term outcomes.",
                }))
              : [
                  {
                    title: "Full Arch Implants",
                    copy: "Same-day teeth options with precision planning and a calm, clinical process.",
                  },
                  {
                    title: "Single & Multiple Implants",
                    copy: "Natural-looking replacements designed to function and feel like real teeth.",
                  },
                  {
                    title: "Smile Transformations",
                    copy: "Veneers and aesthetic dentistry for refined, natural results.",
                  },
                ]
            ).map((c) => (
              <div
                key={c.title}
                className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
              >
                <div className="aspect-[4/3] w-full rounded-[var(--radius-card)] bg-black/5" />
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-black/65">{c.copy}</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <CtaButton href="/contact#book" variant="primary">
                    Book Consultation
                  </CtaButton>
                  <CtaButton href="/treatments" variant="secondary">
                    View details
                  </CtaButton>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <CtaButton href="/treatments" variant="secondary" className="hidden sm:inline-flex">
              View all treatments
            </CtaButton>
          </div>
        </section>

        {/* 4) Full Arch Highlight (dark section) */}
        <section className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--charcoal)] px-6 py-12 text-white md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <div className="absolute -left-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute -left-10 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-white/10" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--gold)] ring-1 ring-white/15">
                FULL ARCH IMPLANTS
              </div>
              <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
                Full Arch Implants — a specialist-led approach.
              </h2>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                A calm, clinical pathway to restore function and confidence.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-white/90 sm:grid-cols-2">
                <li className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  Digital planning & guided placement
                </li>
                <li className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  Natural aesthetics, built for longevity
                </li>
                <li className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  Calm, clinical process
                </li>
                <li className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  Evening availability
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CtaButton href="/contact#book" variant="secondary">
                  Book Consultation
                </CtaButton>
                <CtaButton
                  href={getWhatsAppHref("Hi, I’m interested in full arch implants.")}
                  variant="ghost"
                >
                  WhatsApp a question
                </CtaButton>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
              <div className="aspect-[4/3] w-full rounded-2xl bg-white/10" />
              <div className="mt-4 text-sm text-white/80">
                A clinically-presented case preview (same framing, clear labels).
              </div>
            </div>
          </div>
        </section>

        {/* 5) Before & After */}
        <section className="py-12">
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

          <div className="mt-6 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:grid-cols-2 lg:grid-cols-3">
            {(cases.length > 0 ? cases.slice(0, 6) : Array.from({ length: 6 })).map(
              (c: any, i: number) => (
                <div
                  key={c?.id ?? i}
                  className="w-[85%] shrink-0 snap-start rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)] ring-2 ring-[var(--charcoal)] sm:w-auto"
                >
                  <BeforeAfterSlider
                    beforeSrc={c?.beforeImageUrl}
                    afterSrc={c?.afterImageUrl}
                    altBase={c?.title || "Case"}
                  />
                  {c?.title ? (
                    <div className="mt-3 text-xs font-semibold text-black/70">
                      {c.title}
                    </div>
                  ) : null}
                </div>
              )
            )}
          </div>
          <div className="mt-6 sm:hidden">
            <CtaButton href="/contact#book" variant="primary" className="w-full">
              Book Consultation
            </CtaButton>
          </div>
        </section>

        {/* 6) Team / specialists */}
        <section className="py-12" aria-label="Our specialists">
          <TeamSection />
        </section>

        {/* 7) Patient Journey */}
        <section className="py-12">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto inline-flex rounded-full bg-[var(--gold)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--ink-on-gold)]">
              PATIENT JOURNEY
            </div>
            <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight">
              A calm, structured process.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "1", title: "Consultation", copy: "Understand your goals and clinical needs." },
              { step: "2", title: "Digital planning", copy: "Precision planning for predictable outcomes." },
              { step: "3", title: "Treatment", copy: "Calm, specialist-led delivery." },
              { step: "4", title: "Aftercare", copy: "Long-term support and maintenance." },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
              >
                <div className="text-xs font-semibold text-black/55">
                  Step {s.step}
                </div>
                <div className="mt-2 text-sm font-semibold tracking-tight">{s.title}</div>
                <div className="mt-2 text-sm text-black/65">{s.copy}</div>
                <div className="mt-4">
                  <CtaButton href="/contact#book" variant="primary">
                    Book Consultation
                  </CtaButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8) Testimonials */}
        <section className="py-12">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto inline-flex rounded-full bg-[var(--charcoal)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--gold)]">
              TESTIMONIALS
            </div>
            <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight">
              Trusted by patients.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(testimonials.length > 0
              ? testimonials.slice(0, 6).map((t) => ({
                  quote: t.quote,
                  by: t.patientNameInitials || "Patient",
                }))
              : [
                  {
                    quote:
                      "Calm, professional, and incredibly thorough from start to finish.",
                    by: "Patient (initials)",
                  },
                  {
                    quote:
                      "The planning was meticulous — the result looks completely natural.",
                    by: "Patient (initials)",
                  },
                  {
                    quote:
                      "High-end care without pressure. I felt listened to throughout.",
                    by: "Patient (initials)",
                  },
                ]
            ).slice(0, 3).map((t) => (
              <figure
                key={`${t.by}-${t.quote.slice(0, 24)}`}
                className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-black/10"
              >
                <blockquote className="text-sm leading-relaxed text-black/70">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold text-black/55">
                  {t.by}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 sm:hidden">
            <CtaButton href="/contact#book" variant="primary" className="w-full">
              Book Consultation
            </CtaButton>
          </div>
        </section>

        {/* 9) Final CTA (dark green) */}
        <section className="rounded-3xl bg-[var(--charcoal)] px-6 py-10 text-white md:px-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
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
              <CtaButton href="/contact#book" variant="secondary">
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
