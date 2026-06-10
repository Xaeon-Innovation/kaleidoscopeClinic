"use client";

import { CtaButton } from "@/components/CtaButton";
import { KaleidoscopeLogo, SectionLabel, reveal } from "@/components/about/shared";
import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  "2 GDC Specialists",
  "GDC Registered & Regulated",
  "KCL Academic Affiliation",
] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden lg:flex-row">
      <div className="relative flex flex-1 flex-col justify-center bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] px-6 py-24 text-[var(--brand-dark)] sm:px-10 lg:px-14 xl:px-20">
        <motion.div {...reveal} className="mx-auto w-full max-w-xl lg:mx-0">
          <SectionLabel>Our story</SectionLabel>
          <h1 className="mt-6 font-[var(--font-serif)] text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Built around specialism, not volume
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[var(--brand-dark)]/80 sm:text-lg">
            Kaleidoscope Dental Specialists exists for patients who want more than
            routine dentistry — who want specialist-led care, honest advice, and
            outcomes that genuinely last.
          </p>
          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {stats.map((stat) => (
              <li
                key={stat}
                className="rounded-full border border-[var(--brand-dark)]/10 bg-white/60 px-4 py-2 text-xs font-medium tracking-wide text-[var(--brand-dark)]/75"
              >
                {stat}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CtaButton href="/book" variant="primary" className="h-11">
              Book Consultation
            </CtaButton>
            <CtaButton href="#team" variant="secondary" className="h-11">
              Meet the Specialists
            </CtaButton>
          </div>
          <div className="mt-12 flex items-center gap-2 text-[var(--brand-dark)]/40">
            <KaleidoscopeLogo size={22} color="currentColor" />
            <span className="text-xs tracking-[0.2em] uppercase">
              Kaleidoscope Dental Specialists
            </span>
          </div>
        </motion.div>
      </div>

      <div className="relative min-h-[40vh] flex-1 lg:min-h-svh">
        <Image
          src="/images/kal.png"
          alt="Kaleidoscope Dental Specialists reception in Marylebone, London"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[var(--section-cream)]/80 to-transparent lg:from-[var(--section-cream)]/50"
          aria-hidden
        />
      </div>
    </section>
  );
}
