"use client";

import { CtaButton } from "@/components/CtaButton";
import { SectionLabel } from "@/components/about/shared";
import { TreatmentsHeroSection } from "@/components/treatments/TreatmentsHeroSection";
import {
  treatmentCategories,
  type TreatmentCategory,
} from "@/lib/treatments";
import type { TreatmentDisplay } from "@/lib/treatments/mapService";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

const categoryLabel: Record<Exclude<TreatmentCategory, "all">, string> = {
  implants: "Implants",
  restorative: "Restorative",
  aesthetic: "Aesthetic",
  preventive: "Preventive",
};

const contentTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

function FlagshipCard({
  treatment,
  imageSrc,
}: {
  treatment: TreatmentDisplay;
  imageSrc?: string;
}) {
  const resolvedImage = imageSrc ?? treatment.imageSrc;

  return (
    <article className="group relative min-h-[22rem] overflow-hidden rounded-3xl shadow-2xl shadow-[var(--brand-dark)]/20 transition-transform duration-200 hover:-translate-y-0.5 md:min-h-[19rem]">
      {resolvedImage && (
        <Image
          src={resolvedImage}
          alt=""
          fill
          className="object-cover object-[center_42%]"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#022c22]/88 via-[#022c22]/55 to-[#022c22]/10 md:via-[#022c22]/40 md:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#022c22]/50 via-transparent to-transparent md:hidden"
        aria-hidden
      />

      <div className="relative grid md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
        <div className="relative space-y-4 p-6 text-white md:p-8 lg:p-10 lg:space-y-5">
          <p
            className="pointer-events-none absolute left-6 top-6 max-w-[min(100%,28rem)] font-[var(--font-serif)] text-[clamp(1.75rem,5vw,3.25rem)] font-medium uppercase leading-[0.95] tracking-tight text-white/[0.07] md:left-8 md:top-8 lg:left-10 lg:top-10"
            aria-hidden
          >
            {treatment.name}
            <span className="block text-[0.55em] normal-case tracking-normal opacity-80">
              Same-day teeth · All-on-X
            </span>
          </p>

          <span className="relative inline-flex rounded-full border border-[var(--gold)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Flagship treatment
          </span>

          <div className="relative space-y-2">
            <h2 className="font-[var(--font-serif)] text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl lg:text-[2.05rem]">
              {treatment.name}
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-white/80 md:text-[0.95rem]">
              {treatment.subtitle}
            </p>
          </div>

          <ul className="relative grid gap-2 text-sm text-white/85 md:grid-cols-2 md:gap-x-4 md:gap-y-2">
            {treatment.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="relative flex flex-wrap items-center gap-3 pt-1">
            <CtaButton href="/book" variant="primary" className="h-10">
              Book Consultation
            </CtaButton>
            <CtaButton
              href="/contact"
              variant="ghost"
              className="h-10 border-white/20 bg-black/30 text-white hover:bg-black/45"
            >
              Ask a question
            </CtaButton>
          </div>
        </div>

        <aside className="relative hidden items-center justify-end p-8 lg:flex lg:p-10">
          <div className="text-right" aria-hidden>
            <p className="font-[var(--font-serif)] leading-none text-[#4a2c35] drop-shadow-sm">
              <span className="text-[clamp(3.5rem,8vw,6rem)] font-medium tracking-tight">
                1
              </span>
              <span className="ml-1 text-[clamp(1.35rem,3vw,2.35rem)] font-normal lowercase tracking-tight">
                day
              </span>
            </p>
            <p className="mt-1 max-w-[14rem] text-xs font-medium uppercase tracking-[0.14em] text-[#4a2c35]/75 md:ml-auto">
              To a full set of teeth.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function TreatmentCard({
  treatment,
  imageSrc,
  index,
}: {
  treatment: TreatmentDisplay;
  imageSrc?: string;
  index: number;
}) {
  const resolvedImage = imageSrc ?? treatment.imageSrc;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ...contentTransition,
        delay: index * 0.04,
      }}
      className="group flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--gold)]/50 hover:shadow-md md:p-6"
    >
      <div>
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[var(--surface-warm)]">
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full items-end p-4">
              <span className="inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/55 ring-1 ring-[var(--brand-dark)]/10">
                {categoryLabel[treatment.category]}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-[var(--brand-dark)] md:text-xl">
          {treatment.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-dark)]/70">
          {treatment.subtitle}
        </p>

        <ul className="mt-4 grid gap-2 text-sm text-[var(--brand-dark)]/70">
          {treatment.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[var(--brand-dark)]/10 pt-4">
        <CtaButton href="/book" variant="primary" className="h-10 w-full">
          Book Consultation
        </CtaButton>
        <CtaButton href="/contact" variant="secondary" className="h-10 w-full">
          Contact us
        </CtaButton>
      </div>
    </motion.article>
  );
}

export function TreatmentsSection({
  treatments,
  flagshipSlug,
  treatmentImages,
}: {
  treatments: TreatmentDisplay[];
  flagshipSlug: string;
  treatmentImages: Record<string, string>;
}) {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory>("all");

  const flagship =
    treatments.find((t) => t.slug === flagshipSlug) ?? treatments[0]!;

  const filteredTreatments = useMemo(() => {
    const list =
      activeCategory === "all"
        ? treatments
        : treatments.filter((t) => t.category === activeCategory);

    return list.filter((t) => t.slug !== flagshipSlug);
  }, [activeCategory, treatments, flagshipSlug]);

  const showFlagship =
    activeCategory === "all" || activeCategory === "implants";

  const sectionLabel =
    activeCategory === "all"
      ? "Other treatments"
      : (treatmentCategories.find((c) => c.key === activeCategory)?.label ?? "");

  return (
    <>
      <TreatmentsHeroSection treatmentCount={treatments.length} />

      <section
        id="treatments-list"
        aria-labelledby="treatments-list-heading"
        className="scroll-mt-20 page-section page-section-flow bg-linear-to-br from-[var(--section-cream)] via-[var(--section-cream-warm)] to-[var(--section-cream-sage-deep)]"
      >
        <div className="page-section-inner">
          <div className="mb-6 space-y-4 md:mb-8">
            <SectionLabel>Browse by category</SectionLabel>
            <h2
              id="treatments-list-heading"
              className="font-[var(--font-serif)] text-2xl font-semibold tracking-tight text-[var(--brand-dark)] md:text-3xl"
            >
              Find the right treatment for you
            </h2>

            <div
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
              role="tablist"
              aria-label="Treatment categories"
            >
              {treatmentCategories.map(({ key, label }) => {
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(key)}
                    className={[
                      "relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-200",
                      isActive
                        ? "text-[var(--ink-on-gold)]"
                        : "border border-[var(--brand-dark)]/10 bg-white/70 text-[var(--brand-dark)]/75 hover:border-[var(--gold)]/40 hover:text-[var(--brand-dark)]",
                    ].join(" ")}
                  >
                    {isActive ? (
                      <span className="absolute inset-0 rounded-full bg-[var(--gold)] shadow-sm" />
                    ) : null}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showFlagship && flagship ? (
            <div className="mb-6 md:mb-8">
              <FlagshipCard
                treatment={flagship}
                imageSrc={treatmentImages[flagship.slug]}
              />
            </div>
          ) : null}

          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={contentTransition}
                className="space-y-4"
              >
                {filteredTreatments.length > 0 ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--charcoal-2)]">
                      {sectionLabel}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                      {filteredTreatments.map((treatment, index) => (
                        <TreatmentCard
                          key={treatment.slug}
                          treatment={treatment}
                          imageSrc={treatmentImages[treatment.slug]}
                          index={index}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white/80 p-6 text-sm text-[var(--brand-dark)]/70">
                    No treatments in this category yet. Please contact us to
                    discuss your needs.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
