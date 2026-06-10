"use client";

import { SectionLabel } from "@/components/about/shared";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Choose a time",
    description: "Browse live availability in our calendar",
  },
  {
    number: "02",
    title: "Share your details",
    description: "Tell us how we can help",
  },
  {
    number: "03",
    title: "Secure your slot",
    description: "Pay a deposit via Stripe",
  },
] as const;

const trustPoints = [
  "Stripe-secured payment",
  "GDC-registered specialists",
  "Marylebone, London",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function scrollToBooking() {
  const target = document.getElementById("book-calendar");
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function BookHeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] text-[var(--brand-dark)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg
          className="absolute -right-[10%] top-1/2 h-[min(100vh,900px)] w-auto -translate-y-1/2 opacity-50 lg:right-[-2%]"
          viewBox="0 0 580 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M290 8 L470 172 L470 648 L290 812 L110 648 L110 172 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.07"
          />
          <path
            d="M290 129 L416 243 L416 577 L290 691 L164 577 L164 243 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.05"
          />
        </svg>
        <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-[var(--gold)]/8 blur-3xl" />
        <div className="absolute bottom-8 right-1/3 h-48 w-48 rounded-full bg-[#1E433A]/5 blur-3xl" />
      </div>

      <div className="page-section-inner relative py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl"
          >
            <SectionLabel>Book online</SectionLabel>

            <h1 className="mt-5 font-[var(--font-serif)] text-4xl leading-[1.08] tracking-tight sm:text-[2.65rem] lg:text-5xl">
              Schedule your
              <span className="block text-[var(--brand-dark)]/85">
                specialist consultation
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--brand-dark)]/72 sm:text-lg">
              Select an available time, share a few details, and confirm with a
              secure deposit — all in a few minutes.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {trustPoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + index * 0.07,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="rounded-full border border-[var(--brand-dark)]/10 bg-white/50 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[var(--brand-dark)]/70 backdrop-blur-sm"
                >
                  {point}
                </motion.li>
              ))}
            </ul>

            <motion.button
              type="button"
              onClick={scrollToBooking}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-dark)]/60 transition-colors hover:text-[var(--brand-dark)]"
            >
              <span>View available times</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M8 3v10M8 13l-4-4M8 13l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group flex items-start gap-4 rounded-2xl border border-[var(--brand-dark)]/8 bg-white/60 p-4 shadow-sm shadow-[var(--brand-dark)]/4 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md hover:shadow-[var(--brand-dark)]/6 sm:p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-dark)] font-[var(--font-serif)] text-sm text-white transition-transform duration-300 group-hover:scale-105">
                  {step.number}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-medium tracking-tight text-[var(--brand-dark)]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--brand-dark)]/60">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.35,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="relative mx-auto mt-12 hidden max-w-4xl overflow-hidden rounded-2xl ring-1 ring-[var(--brand-dark)]/8 lg:block"
        >
          <div className="relative aspect-[21/5] w-full">
            <Image
              src="/images/kal.png"
              alt="Kaleidoscope Dental Specialists reception in Marylebone"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 0px, 896px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-[var(--section-cream)]/90 via-[var(--section-cream)]/40 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 flex items-center px-8">
              <p className="max-w-xs font-[var(--font-serif)] text-xl leading-snug tracking-tight text-[var(--brand-dark)]">
                Specialist-led care in the heart of Marylebone
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
