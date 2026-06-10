"use client";

import {
  SectionLabel,
  reveal,
  staggerContainer,
  staggerItem,
} from "@/components/about/shared";
import { pillars } from "@/lib/about-data";
import { motion } from "framer-motion";

export function PillarsSection() {
  return (
    <section className="bg-[var(--brand-dark)] py-20 text-white sm:py-28">
      <div className="page-section-inner">
        <motion.div {...reveal} className="mb-12 max-w-2xl">
          <SectionLabel>Our principles</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
            What sets specialist care apart
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {pillars.map((pillar) => (
            <motion.article
              key={pillar.num}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
            >
              <span
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
              <span className="font-[var(--font-serif)] text-3xl text-[var(--gold)]/60">
                {pillar.num}
              </span>
              <h3 className="mt-4 font-[var(--font-serif)] text-xl tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {pillar.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
