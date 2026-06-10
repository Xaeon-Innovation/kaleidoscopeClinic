"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  FileText,
  HeartHandshake,
  ShieldCheck,
  SmilePlus,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    id: 1,
    title: "Book online",
    description:
      "Choose a time that works for you — evenings and weekends included.",
    icon: CalendarCheck2,
  },
  {
    id: 2,
    title: "Gentle consultation",
    description:
      "We listen first, examine second, and explain every finding clearly.",
    icon: SmilePlus,
  },
  {
    id: 3,
    title: "Personalized plan",
    description:
      "We co-create a plan that fits your goals, comfort level, and budget.",
    icon: FileText,
  },
  {
    id: 4,
    title: "Comfortable treatment",
    description:
      "Modern, gentle dentistry with options to reduce anxiety and pain.",
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: "Ongoing care",
    description:
      "Regular checkups, reminders, and support to keep your smile healthy.",
    icon: HeartHandshake,
  },
];

export function OurProcessTimeline() {
  const [activeId, setActiveId] = useState(1);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusStep = useCallback((index: number) => {
    const step = steps[index];
    if (!step) return;
    setActiveId(step.id);
    stepRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        if (index < steps.length - 1) focusStep(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) focusStep(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusStep(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusStep(steps.length - 1);
      }
    },
    [focusStep],
  );

  return (
    <section
      className="page-section bg-linear-to-bl from-[var(--section-cream-warm)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)]"
      aria-labelledby="our-process-heading"
    >
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 max-w-3xl md:mb-14"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--charcoal-2)]">
            Patient journey
          </p>
          <h2
            id="our-process-heading"
            className="font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-[var(--brand-dark)] sm:text-4xl md:text-5xl"
          >
            A calm, structured process.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--brand-dark)]/75 md:text-lg">
            From your first booking to long-term checkups, we follow a clear,
            gentle path so you always know what comes next.
          </p>
        </motion.div>

        <motion.nav
          aria-label="Kaleidoscope patient journey"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Desktop baseline connector */}
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[1.65rem] hidden h-px bg-[var(--brand-dark)]/12 md:block"
            aria-hidden="true"
          />

          <ol className="relative flex flex-col gap-5 md:flex-row md:items-stretch md:justify-between md:gap-4">
            {/* Mobile vertical baseline */}
            <div
              className="pointer-events-none absolute bottom-6 left-5 top-10 w-px bg-[var(--brand-dark)]/12 md:hidden"
              aria-hidden="true"
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeId === step.id;
              const isPast = step.id < activeId;
              const segmentHighlighted = isPast || isActive;

              return (
                <li
                  key={step.id}
                  className="relative flex flex-1 flex-col md:min-w-0 md:max-w-[11.5rem] lg:max-w-none"
                >
                  {/* Desktop segment highlight (step → next) */}
                  {index < steps.length - 1 && (
                    <div
                      className="pointer-events-none absolute left-1/2 top-[1.65rem] hidden h-px w-full md:block"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full transition-colors duration-300 ${
                          segmentHighlighted ? "bg-[var(--charcoal-2)]" : "bg-transparent"
                        }`}
                      />
                    </div>
                  )}

                  {/* Mobile segment highlight */}
                  {index < steps.length - 1 && (
                    <div
                      className="pointer-events-none absolute left-5 top-12 w-px md:hidden"
                      style={{ height: "calc(100% + 1.25rem)" }}
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full w-full transition-colors duration-300 ${
                          segmentHighlighted ? "bg-[var(--charcoal-2)]" : "bg-transparent"
                        }`}
                      />
                    </div>
                  )}

                  <motion.button
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setActiveId(step.id)}
                    onFocus={() => setActiveId(step.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-current={isActive ? "step" : undefined}
                    whileHover={{ y: isActive ? 0 : -2 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={[
                      "group relative z-[1] flex h-full w-full items-start gap-4 rounded-xl border bg-white px-4 py-4 text-left shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F4]",
                      "md:flex-col md:items-center md:gap-0 md:px-4 md:py-5 md:text-center",
                      isActive
                        ? "border-[var(--brand-dark)]/25 shadow-lg shadow-[var(--brand-dark)]/8"
                        : "border-[var(--brand-dark)]/10 hover:border-[var(--charcoal-2)]/30",
                    ].join(" ")}
                  >
                    <div className="relative flex shrink-0 items-center gap-3 md:flex-col md:gap-2">
                      <div
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300",
                          isActive
                            ? "border-[var(--brand-dark)] bg-[var(--brand-dark)] text-white"
                            : isPast
                              ? "border-[var(--charcoal-2)] bg-[var(--brand-dark)]/5 text-[var(--charcoal-2)]"
                              : "border-[var(--brand-dark)]/20 bg-white text-[var(--brand-dark)]/70",
                        ].join(" ")}
                      >
                        {step.id}
                      </div>
                      <Icon
                        className={[
                          "h-5 w-5 transition-colors duration-300",
                          isActive
                            ? "text-[var(--charcoal-2)]"
                            : "text-[var(--brand-dark)]/35 group-hover:text-[var(--charcoal-2)]",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col md:mt-4 md:w-full">
                      <p
                        className={[
                          "text-sm leading-snug transition-[font-weight,color] duration-300 md:flex md:min-h-[2.75rem] md:items-center md:justify-center md:text-[15px]",
                          isActive
                            ? "font-semibold text-[var(--brand-dark)]"
                            : "font-medium text-[var(--brand-dark)]/85",
                        ].join(" ")}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--brand-dark)]/60 md:text-[13px]">
                        {step.description}
                      </p>
                    </div>
                  </motion.button>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      </div>
    </section>
  );
}
