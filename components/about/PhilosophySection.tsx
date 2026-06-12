"use client";

import { SectionLabel, staggerContainer, staggerItem } from "@/components/about/shared";
import { philosophyTiles } from "@/lib/about-data";
import { motion } from "framer-motion";

const variantStyles = {
  "dark-tall":
    "row-span-2 bg-[var(--brand-dark)] text-white border-white/10",
  cream:
    "bg-[var(--section-cream)] text-[var(--brand-dark)] border-[var(--brand-dark)]/10",
  gold:
    "bg-[var(--surface-warm)] text-[var(--brand-dark)] border-[var(--gold)]/30",
} as const;

export function PhilosophySection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-12 max-w-xl"
        >
          <SectionLabel>Philosophy</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            How we think about care
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid auto-rows-fr gap-4 md:grid-cols-3"
        >
          {philosophyTiles.map((tile) => (
            <motion.article
              key={tile.roman}
              variants={staggerItem}
              className={[
                "flex flex-col rounded-[var(--radius-card)] border p-7 sm:p-8",
                variantStyles[tile.variant],
                tile.variant === "dark-tall" ? "md:row-span-2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span
                className={[
                  "font-[var(--font-serif)] text-2xl",
                  tile.variant === "dark-tall"
                    ? "text-[var(--gold)]"
                    : "text-[var(--gold)]",
                ].join(" ")}
              >
                {tile.roman}
              </span>
              <h3 className="mt-4 font-[var(--font-serif)] text-xl leading-snug tracking-tight sm:text-2xl">
                {tile.title}
              </h3>
              <p
                className={[
                  "mt-4 flex-1 text-sm leading-relaxed",
                  tile.variant === "dark-tall"
                    ? "text-white/75"
                    : "text-[var(--brand-dark)]/75",
                ].join(" ")}
              >
                {tile.body}
              </p>
              {"quote" in tile && tile.quote ? (
                <p className="mt-6 font-[var(--font-serif)] text-base italic text-[var(--gold)] sm:text-lg">
                  {tile.quote}
                </p>
              ) : null}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
