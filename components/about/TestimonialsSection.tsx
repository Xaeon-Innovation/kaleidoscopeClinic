"use client";

import { SectionLabel, staggerContainer, staggerItem } from "@/components/about/shared";
import { testimonials } from "@/lib/about-data";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const featured = testimonials.find((t) => t.featured)!;
  const others = testimonials.filter((t) => !t.featured);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-12"
        >
          <SectionLabel>Patient voices</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            What our patients say
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.blockquote
            variants={staggerItem}
            className="flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-[var(--section-cream)] p-8 sm:p-10 lg:row-span-2"
          >
            <p className="font-[var(--font-serif)] text-2xl leading-snug text-[var(--brand-dark)] italic sm:text-3xl">
              &ldquo;{featured.text}&rdquo;
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-dark)] font-[var(--font-serif)] text-lg text-[var(--gold)]">
                {featured.initial}
              </span>
              <cite className="not-italic text-sm font-semibold text-[var(--brand-dark)]">
                {featured.name}
              </cite>
            </footer>
          </motion.blockquote>

          {others.map((t) => (
            <motion.blockquote
              key={t.name}
              variants={staggerItem}
              className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[0_1px_3px_rgba(2,44,34,0.06)]"
            >
              <p className="text-sm leading-relaxed text-[var(--brand-dark)]/80">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-warm)] font-[var(--font-serif)] text-sm text-[var(--brand-dark)]">
                  {t.initial}
                </span>
                <cite className="not-italic text-xs font-semibold text-[var(--brand-dark)]/70">
                  {t.name}
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
