"use client";

import { GoldDivider, SectionLabel, reveal } from "@/components/about/shared";
import { motion } from "framer-motion";

const paragraphs = [
  "Kaleidoscope was founded with a clear purpose: to offer patients in London access to genuine specialist-level care in implant and restorative dentistry — without having to navigate complex NHS referral pathways or compromise on the quality of their outcome.",
  "Located in Marylebone, we serve patients from across London and beyond. Many of our patients come to us having had previous dental treatment that has not met their expectations, or facing complex clinical situations that require a specialist's expertise to resolve.",
  "Dr Sherif Elsharkawy and Dr Sumaia Rashed each bring postgraduate credentials and clinical depth that goes beyond what general dentistry can offer. Their collaboration is not incidental — it is central to the way Kaleidoscope works.",
] as const;

export function StorySection() {
  return (
    <section className="bg-[var(--section-cream)] py-20 sm:py-28">
      <div className="page-section-inner">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div {...reveal} className="lg:col-span-5">
            <SectionLabel>Marylebone, London</SectionLabel>
            <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
              Marylebone&apos;s specialist prosthodontic clinic
            </h2>
            <GoldDivider className="mt-6" />
            <span className="mt-8 inline-block rounded-full border border-[var(--brand-dark)]/10 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--brand-dark)]/70 uppercase">
              W1 · Marylebone
            </span>
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.1 }}
            className="space-y-5 lg:col-span-7"
          >
            {paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="text-sm leading-relaxed text-[var(--brand-dark)]/80 sm:text-base"
              >
                {p}
              </p>
            ))}

            <blockquote className="mt-8 border-l-2 border-[var(--gold)] pl-6">
              <p className="font-[var(--font-serif)] text-xl leading-snug text-[var(--brand-dark)] italic sm:text-2xl">
                &ldquo;Every patient at Kaleidoscope is seen by a specialist — not a
                generalist. That difference, quietly, is everything.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
