"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = { question: string; answer: string };

export function TreatmentFaqSection({
  faqs,
  heading = "FAQs",
}: {
  faqs: FaqItem[];
  heading?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="page-section bg-[var(--surface-warm)]">
      <div className="page-section-inner max-w-3xl">
        <h2 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-8 divide-y divide-[var(--brand-dark)]/10 rounded-2xl border border-[var(--brand-dark)]/10 bg-white">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-[var(--surface-warm)]/60"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-sm font-semibold text-[var(--brand-dark)] sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className="mt-0.5 shrink-0 text-[var(--gold)] transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--brand-dark)]/75">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
