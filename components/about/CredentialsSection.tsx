"use client";

import { SectionLabel, staggerContainer, staggerItem } from "@/components/about/shared";
import { credentials } from "@/lib/about-data";
import { motion } from "framer-motion";

export function CredentialsSection() {
  return (
    <section className="bg-[var(--surface-warm)] py-20 sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-12 max-w-xl"
        >
          <SectionLabel>Credentials</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Recognised specialist expertise
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {credentials.map((item) => (
            <motion.article
              key={item.title}
              variants={staggerItem}
              className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-7 shadow-[0_1px_3px_rgba(2,44,34,0.06)]"
            >
              <h3 className="font-[var(--font-serif)] text-xl tracking-tight text-[var(--brand-dark)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--brand-dark)]/75">
                {item.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
