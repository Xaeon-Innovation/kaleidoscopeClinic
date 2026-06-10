"use client";

import { SectionLabel, staggerContainer, staggerItem } from "@/components/about/shared";
import { processSteps } from "@/lib/about-data";
import { motion } from "framer-motion";

export function ProcessSection() {
  return (
    <section className="bg-[var(--section-cream)] py-20 sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-14 max-w-xl"
        >
          <SectionLabel>Your journey</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            From consultation to lasting results
          </h2>
        </motion.div>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid gap-10 md:grid-cols-4 md:gap-6"
        >
          <div
            className="pointer-events-none absolute top-8 right-[12.5%] left-[12.5%] hidden h-px bg-[var(--gold)] md:block"
            aria-hidden
          />
          {processSteps.map((step) => (
            <motion.li
              key={step.num}
              variants={staggerItem}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-white font-[var(--font-serif)] text-lg text-[var(--brand-dark)] shadow-[0_4px_16px_rgba(2,44,34,0.08)]">
                {step.num}
              </div>
              <h3 className="mt-5 font-[var(--font-serif)] text-xl tracking-tight text-[var(--brand-dark)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--brand-dark)]/75">
                {step.body}
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--gold)]">
                {step.detail}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
