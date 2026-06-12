"use client";

import { SectionLabel } from "@/components/about/shared";
import { CLINIC } from "@/components/siteLinks";
import { motion, useReducedMotion } from "framer-motion";

type FloatingOrbProps = {
  className: string;
  gradient: string;
  duration: number;
  delay?: number;
  reduceMotion: boolean | null;
};

function FloatingOrb({
  className,
  gradient,
  duration,
  delay = 0,
  reduceMotion,
}: FloatingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{ background: gradient }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, 36, -24, 0],
              y: [0, -28, 20, 0],
              scale: [1, 1.08, 0.96, 1],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    />
  );
}

function ReferralHeroBackground() {
  const reduceMotion = useReducedMotion();

  const spin = (duration: number, reverse = false) =>
    reduceMotion
      ? {}
      : {
          animate: { rotate: reverse ? -360 : 360 },
          transition: {
            duration,
            repeat: Infinity,
            ease: "linear" as const,
          },
        };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="-left-16 top-8 h-72 w-72 sm:h-80 sm:w-80"
        gradient="radial-gradient(circle, rgba(200,165,90,0.55) 0%, rgba(200,165,90,0.22) 42%, transparent 72%)"
        duration={14}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="bottom-4 right-[8%] h-64 w-64 sm:bottom-10 sm:h-72 sm:w-72"
        gradient="radial-gradient(circle, rgba(30,67,58,0.38) 0%, rgba(30,67,58,0.16) 45%, transparent 72%)"
        duration={18}
        delay={2}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="right-[18%] top-[12%] h-52 w-52 sm:h-60 sm:w-60"
        gradient="radial-gradient(circle, rgba(200,165,90,0.42) 0%, rgba(200,165,90,0.14) 40%, transparent 70%)"
        duration={12}
        delay={1}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="bottom-[28%] left-[6%] h-44 w-44 sm:h-52 sm:w-52"
        gradient="radial-gradient(circle, rgba(6,78,59,0.28) 0%, rgba(6,78,59,0.1) 45%, transparent 70%)"
        duration={16}
        delay={0.5}
      />

      <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 opacity-40 lg:right-[-2%]">
        <motion.svg
          className="h-[min(100vh,900px)] w-auto"
          viewBox="0 0 580 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "50% 50%" }}
          {...spin(90)}
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
          <path
            d="M290 249 L362 315 L362 505 L290 571 L218 505 L218 315 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.04"
          />
        </motion.svg>
      </div>

      <div className="absolute -left-[6%] bottom-0 opacity-25 lg:-left-[2%]">
        <motion.svg
          className="h-[min(70vh,620px)] w-auto"
          viewBox="0 0 580 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "50% 50%" }}
          {...spin(120, true)}
        >
          <path
            d="M290 8 L470 172 L470 648 L290 812 L110 648 L110 172 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.05"
          />
          <path
            d="M290 129 L416 243 L416 577 L290 691 L164 577 L164 243 Z"
            stroke="#C8A55A"
            strokeWidth="1"
            opacity="0.06"
          />
        </motion.svg>
      </div>

      {[
        { top: "20%", left: "14%", size: 10, delay: 0 },
        { top: "58%", left: "10%", size: 7, delay: 1.2 },
        { top: "32%", right: "20%", size: 8, delay: 0.6 },
        { top: "68%", right: "12%", size: 6, delay: 1.8 },
      ].map((dot, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[var(--gold)] shadow-[0_0_18px_rgba(200,165,90,0.55)]"
          style={{
            top: dot.top,
            ...(dot.left ? { left: dot.left } : {}),
            ...(dot.right ? { right: dot.right } : {}),
            width: dot.size,
            height: dot.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.35, 0.9, 0.35],
                  y: [0, -18, 0],
                  scale: [1, 1.15, 1],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 5 + index,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Submit referral",
    description: "Patient details, clinical history, and radiographs",
  },
  {
    number: "02",
    title: "Practice confirmation",
    description: "We acknowledge receipt to your practice promptly",
  },
  {
    number: "03",
    title: "Specialist assessment",
    description: "Patient reviewed and care planned collaboratively",
  },
] as const;

const assurances = [
  "Secure transmission",
  "GDC specialist-led",
  "Colleague-to-colleague",
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function scrollToForm() {
  const target = document.getElementById("referral-form");
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function ReferralHeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] text-[var(--brand-dark)]">
      <ReferralHeroBackground />

      <div className="page-section-inner relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl"
          >
            <SectionLabel>Professional referral</SectionLabel>

            <h1 className="mt-5 font-[var(--font-serif)] text-4xl leading-[1.08] tracking-tight sm:text-[2.65rem] lg:text-5xl">
              Implant referral
              <span className="block text-[var(--brand-dark)]/85">for colleagues</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--brand-dark)]/72 sm:text-lg">
              Refer patients securely for implant assessment or treatment at{" "}
              {CLINIC.name}. We follow up with your practice and the patient as
              clinically appropriate.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {assurances.map((point, index) => (
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
              onClick={scrollToForm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-dark)]/60 transition-colors hover:text-[var(--brand-dark)]"
            >
              <span>Go to referral form</span>
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
      </div>
    </section>
  );
}
