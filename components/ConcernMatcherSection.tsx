"use client";

import { CtaButton } from "@/components/CtaButton";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Baby,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  PhoneCall,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type ConcernKey =
  | "pain"
  | "cost"
  | "time"
  | "trust"
  | "kids"
  | "emergency";

type ConcernItem = {
  key: ConcernKey;
  label: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  text: string;
  proofs: string[];
};

const concernData: ConcernItem[] = [
  {
    key: "pain",
    label: "The pain will be unbearable",
    icon: AlertCircle,
    tag: "Pain Management",
    title: "You won't feel a thing — we design treatment around comfort.",
    text: "We use gentle, modern anesthesia techniques and a calm-first treatment approach to reduce fear before treatment even begins. For anxious patients, we also offer sedation options and extra time so nothing feels rushed.",
    proofs: [
      "Gentle anesthesia and comfort-first protocols",
      "Sedation options available when needed",
      "Extra time for anxious patients",
    ],
  },
  {
    key: "cost",
    label: "It will cost too much",
    icon: BadgeDollarSign,
    tag: "Transparent Pricing",
    title: "Clear pricing first, treatment second.",
    text: "Before any procedure starts, you receive a clear treatment plan with a full cost breakdown. We focus on necessary care, explain alternatives honestly, and offer flexible payment options when possible.",
    proofs: [
      "Detailed quote before treatment begins",
      "No hidden fees or surprise add-ons",
      "Flexible payment options available",
    ],
  },
  {
    key: "time",
    label: "I don't have the time",
    icon: Clock3,
    tag: "Flexible Scheduling",
    title: "Dental care that fits your schedule.",
    text: "We keep appointments efficient, respect your time, and streamline visits wherever possible. For urgent needs, we prioritize fast scheduling so treatment doesn't drag into multiple unnecessary appointments.",
    proofs: [
      "Efficient appointment planning",
      "Fast scheduling for urgent cases",
      "Reduced unnecessary repeat visits",
    ],
  },
  {
    key: "trust",
    label: "Can I trust the quality?",
    icon: ShieldCheck,
    tag: "Clinical Trust",
    title: "Modern dentistry backed by standards, not guesswork.",
    text: "Our clinic follows strict sterilization protocols, uses modern equipment, and explains every treatment step clearly before moving forward. Patients choose us because we combine clinical precision with honest communication.",
    proofs: [
      "Strict sterilization and safety standards",
      "Modern imaging and treatment technology",
      "Transparent explanations before treatment",
    ],
  },
  {
    key: "kids",
    label: "My child is scared of dentists",
    icon: Baby,
    tag: "Child-Friendly Care",
    title: "A calmer experience for children and parents.",
    text: "We create a gentle environment for children using reassuring communication, patience, and a treatment pace that builds trust. The goal is not only to finish the visit, but to make the next one easier too.",
    proofs: [
      "Warm, child-friendly communication",
      "Gentle pacing and reassurance",
      "Focus on long-term trust, not just one visit",
    ],
  },
  {
    key: "emergency",
    label: "I need urgent help today",
    icon: PhoneCall,
    tag: "Emergency Care",
    title: "When it hurts, we move quickly.",
    text: "Dental emergencies need fast action, not long delays. We prioritize urgent cases, respond quickly, and guide you clearly on what to do next so you feel supported from the first call.",
    proofs: [
      "Priority scheduling for urgent cases",
      "Fast response and clear next steps",
      "Support from first contact to treatment",
    ],
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ConcernMatcherSection() {
  const headingId = useId();
  const panelId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = useState<ConcernKey>("pain");

  const selectedIndex = useMemo(
    () => concernData.findIndex((item) => item.key === selectedKey),
    [selectedKey],
  );

  const selected = concernData[selectedIndex]!;

  const focusButtonAt = useCallback((index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]',
    );
    buttons?.[index]?.focus();
  }, []);

  const selectByIndex = useCallback(
    (index: number) => {
      const item = concernData[index];
      if (item) setSelectedKey(item.key);
    },
    [],
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const current = selectedIndex < 0 ? 0 : selectedIndex;
      let next = current;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          next = (current + 1) % concernData.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          next = (current - 1 + concernData.length) % concernData.length;
          break;
        case "Home":
          event.preventDefault();
          next = 0;
          break;
        case "End":
          event.preventDefault();
          next = concernData.length - 1;
          break;
        default:
          return;
      }

      selectByIndex(next);
      focusButtonAt(next);
    },
    [focusButtonAt, selectByIndex, selectedIndex],
  );

  return (
    <section
      className="border-t border-[var(--brand-dark)]/8 bg-[var(--section-cream-mid)] bg-[radial-gradient(ellipse_130%_95%_at_50%_-12%,var(--section-cream)_0%,var(--section-cream-mid)_45%,var(--section-cream-sage)_100%)] py-16 md:py-24"
      aria-labelledby={headingId}
    >
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-10 max-w-2xl md:mb-12"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--charcoal-2)]">
            Why Choose Us
          </p>
          <h2
            id={headingId}
            className="font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-[var(--brand-dark)] sm:text-4xl md:text-5xl"
          >
            What&apos;s holding
            <br />
            you back?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-dark)]/75 md:text-lg">
            Select your biggest concern and we&apos;ll show you exactly how our
            clinic addresses it.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-14 2xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
          >
            <p
              id={`${headingId}-list-label`}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/55"
            >
              I&apos;m worried about…
            </p>

            <div
              ref={listRef}
              role="listbox"
              aria-labelledby={`${headingId}-list-label`}
              aria-activedescendant={`concern-${selectedKey}`}
              onKeyDown={handleListKeyDown}
              className="space-y-2.5 sm:space-y-3"
            >
              {concernData.map((item) => {
                const Icon = item.icon;
                const active = selectedKey === item.key;

                return (
                  <motion.button
                    key={item.key}
                    id={`concern-${item.key}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    aria-pressed={active}
                    tabIndex={active ? 0 : -1}
                    layout
                    onClick={() => setSelectedKey(item.key)}
                    whileHover={active ? undefined : { x: 4 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className={[
                      "group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors duration-300 sm:rounded-2xl sm:py-4",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F4]",
                      active
                        ? "border-[var(--brand-dark)] bg-[var(--brand-dark)] text-white shadow-[var(--shadow-soft)]"
                        : "border-[var(--brand-dark)]/12 bg-white text-[var(--brand-dark)] hover:border-[var(--charcoal-2)]/35 hover:bg-white",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-5 w-5 shrink-0 transition-colors",
                        active ? "text-[var(--gold)]" : "text-[var(--charcoal-2)]",
                      ].join(" ")}
                      aria-hidden
                    />
                    <span className="text-sm font-medium leading-snug sm:text-[15px]">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            role="region"
            aria-live="polite"
            aria-labelledby={panelId}
            className="rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:rounded-2xl md:p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.key}
                id={panelId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.28, ease: easeOut }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--charcoal-2)]">
                  {selected.tag}
                </p>

                <h3 className="font-[var(--font-serif)] text-2xl leading-tight tracking-tight text-[var(--brand-dark)] md:text-3xl">
                  {selected.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--brand-dark)]/75 md:text-base">
                  {selected.text}
                </p>

                <ul className="mt-6 space-y-3" aria-label="How we help">
                  {selected.proofs.map((proof) => (
                    <li
                      key={proof}
                      className="flex items-start gap-3 text-sm text-[var(--brand-dark)]/80"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--charcoal-2)]"
                        aria-hidden
                      />
                      <span>{proof}</span>
                    </li>
                  ))}
                </ul>

                <CtaButton
                  href="/book"
                  variant="primary"
                  className="mt-8 h-11 gap-2 px-6"
                >
                  Book Free Consultation
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </CtaButton>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
