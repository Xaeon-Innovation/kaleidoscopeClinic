"use client";

import { SectionLabel, staggerContainer, staggerItem } from "@/components/about/shared";
import { techItems } from "@/lib/about-data";
import { motion } from "framer-motion";

export function TechnologySection() {
  return (
    <section className="bg-[var(--brand-dark)] py-20 text-white sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <SectionLabel>Digital workflow</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
            Precision begins before treatment starts
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
            Every case is planned digitally before treatment begins. Our technology
            stack is not there to impress — it exists to improve precision, reduce
            uncertainty, and deliver results that hold up over time.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {techItems.map((item, i) => (
            <motion.article
              key={item.title}
              variants={staggerItem}
              className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-7"
            >
              <span className="font-[var(--font-serif)] text-sm text-[var(--gold)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-[var(--font-serif)] text-xl tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {item.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
