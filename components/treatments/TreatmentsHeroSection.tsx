"use client";

import { CtaButton } from "@/components/CtaButton";
import { SectionLabel } from "@/components/about/shared";
import { treatmentCategories } from "@/lib/treatments";
import { motion } from "framer-motion";
import Image from "next/image";

const highlights = [
  "GDC specialist-led",
  "Digitally planned",
  "Built for longevity",
] as const;

const specialtyCount = treatmentCategories.filter((c) => c.key !== "all").length;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function TreatmentsHeroSection({
  treatmentCount,
}: {
  treatmentCount: number;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] text-[var(--brand-dark)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg
          className="absolute -right-[12%] top-1/2 h-[min(140vh,1200px)] w-auto -translate-y-1/2 opacity-[0.55] lg:right-[-4%]"
          viewBox="0 0 580 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M290 8 L470 172 L470 648 L290 812 L110 648 L110 172 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.07"
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
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--gold)]/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-[#1E433A]/6 blur-3xl" />
      </div>

      <div className="page-section-inner relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-16">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl"
          >
            <SectionLabel>Treatments &amp; services</SectionLabel>

            <h1 className="mt-6 font-[var(--font-serif)] text-4xl leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.15rem]">
              Specialist care,
              <span className="block text-[var(--brand-dark)]/88">
                thoughtfully delivered
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-[var(--brand-dark)]/78 sm:text-lg">
              Specialist dental treatments in Marylebone, London — from full-arch
              implants to preventive maintenance. Clear, benefit-led guidance
              across every stage of your smile, led by GDC-registered specialists
              who plan for outcomes that last.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {treatmentCategories
                .filter((c) => c.key !== "all")
                .map((category) => (
                  <li
                    key={category.key}
                    className="rounded-full border border-[var(--brand-dark)]/10 bg-white/55 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[var(--brand-dark)]/72 backdrop-blur-sm"
                  >
                    {category.label}
                  </li>
                ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaButton href="/book" variant="primary" className="h-11">
                Book Consultation
              </CtaButton>
              <CtaButton
                href="#treatments-list"
                variant="secondary"
                className="h-11"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("treatments-list");
                }}
              >
                Explore treatments
              </CtaButton>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.35 + index * 0.08,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="rounded-2xl bg-white/45 px-4 py-3.5 text-center text-xs font-medium leading-snug text-[var(--brand-dark)]/80 ring-1 ring-[var(--brand-dark)]/8 sm:text-left"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[var(--brand-dark)]/12 ring-1 ring-[var(--brand-dark)]/8 sm:aspect-[5/6]">
              <Image
                src="/images/treatments.jpg"
                alt="Precision dental instruments used in specialist treatment at Kaleidoscope Dental Specialists"
                fill
                className="object-cover object-[62%_center]"
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-[var(--section-cream)]/30 via-transparent to-transparent lg:from-transparent"
                aria-hidden
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.45,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/20 bg-white/92 p-5 shadow-xl shadow-[var(--brand-dark)]/10 backdrop-blur-md sm:left-auto sm:right-6 sm:max-w-[15.5rem]"
            >
              <p className="font-[var(--font-serif)] text-3xl leading-none tracking-tight text-[var(--brand-dark)]">
                {treatmentCount}
                <span className="ml-1.5 text-base font-normal text-[var(--brand-dark)]/55">
                  treatments
                </span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--brand-dark)]/65">
                Across {specialtyCount} specialist areas — implants at the centre
                of everything we do.
              </p>
            </motion.div>

            <div
              className="pointer-events-none absolute -right-3 -top-3 hidden h-24 w-24 rounded-full border border-[var(--gold)]/35 lg:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-6 hidden h-16 w-16 rounded-full border border-[var(--brand-dark)]/10 lg:block"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
