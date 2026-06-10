"use client";

import { SectionLabel } from "@/components/about/shared";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC, getWhatsAppHref } from "@/components/siteLinks";
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
              x: [0, 32, -20, 0],
              y: [0, -24, 16, 0],
              scale: [1, 1.06, 0.97, 1],
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

function ContactHeroBackground() {
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
        className="-left-20 top-6 h-80 w-80 sm:h-96 sm:w-96"
        gradient="radial-gradient(circle, rgba(200,165,90,0.5) 0%, rgba(200,165,90,0.2) 40%, transparent 72%)"
        duration={15}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="bottom-0 right-[6%] h-72 w-72 sm:bottom-8 sm:h-80 sm:w-80"
        gradient="radial-gradient(circle, rgba(200,165,90,0.38) 0%, rgba(200,165,90,0.12) 42%, transparent 70%)"
        duration={13}
        delay={1.5}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="right-[22%] top-[10%] h-48 w-48 sm:h-56 sm:w-56"
        gradient="radial-gradient(circle, rgba(30,67,58,0.3) 0%, rgba(30,67,58,0.12) 45%, transparent 72%)"
        duration={17}
        delay={0.8}
      />

      <div className="absolute -right-[8%] top-1/2 -translate-y-1/2 opacity-35 lg:right-[-1%]">
        <motion.svg
          className="h-[min(95vh,860px)] w-auto"
          viewBox="0 0 580 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "50% 50%" }}
          {...spin(100)}
        >
          <path
            d="M290 8 L470 172 L470 648 L290 812 L110 648 L110 172 Z"
            stroke="#C8A55A"
            strokeWidth="1"
            opacity="0.12"
          />
          <path
            d="M290 129 L416 243 L416 577 L290 691 L164 577 L164 243 Z"
            stroke="#1E433A"
            strokeWidth="1"
            opacity="0.06"
          />
          <path
            d="M290 249 L362 315 L362 505 L290 571 L218 505 L218 315 Z"
            stroke="#C8A55A"
            strokeWidth="1"
            opacity="0.08"
          />
        </motion.svg>
      </div>

      {[
        { top: "18%", left: "12%", size: 9, delay: 0 },
        { top: "55%", left: "8%", size: 6, delay: 1 },
        { top: "30%", right: "18%", size: 7, delay: 0.5 },
        { top: "72%", right: "10%", size: 5, delay: 1.6 },
        { top: "42%", left: "45%", size: 4, delay: 2.2 },
      ].map((dot, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[var(--gold)] shadow-[0_0_16px_rgba(200,165,90,0.5)]"
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
                  opacity: [0.3, 0.85, 0.3],
                  y: [0, -14, 0],
                  scale: [1, 1.12, 1],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 4.5 + index * 0.5,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[var(--gold)]/40 to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.4, 0.8, 0.4] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

const contactPoints = [
  "By appointment",
  "Evening availability",
  "Marylebone, London",
] as const;

const infoRows = [
  {
    label: "Address",
    value: (
      <>
        <span className="block">{CLINIC.addressLines[0]}</span>
        <span className="block">{CLINIC.addressLines[1]}</span>
      </>
    ),
    icon: (
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.375 4.5 8.25 4.5 8.25s4.5-4.875 4.5-8.25A4.5 4.5 0 0 0 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Hours",
    value: "By appointment · Evening availability",
    icon: (
      <path
        d="M8 4.5v3.75L10.5 9.5M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Phone",
    value: CLINIC.phoneDisplay,
    icon: (
      <path
        d="M4.25 3.5h2.5l1 2.5-1.5 1.25a8.5 8.5 0 0 0 4 4L11 10.25l2.5 1v2.5a1 1 0 0 1-1 1A11.5 11.5 0 0 1 3.25 4.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function ContactHeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-[var(--section-cream-sage)] text-[var(--brand-dark)]">
      <ContactHeroBackground />

      <div className="page-section-inner relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.88fr] lg:gap-14">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl"
          >
            <SectionLabel>Get in touch</SectionLabel>

            <h1 className="mt-5 font-[var(--font-serif)] text-4xl leading-[1.08] tracking-tight sm:text-[2.65rem] lg:text-5xl">
              Contact &amp; location
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--brand-dark)]/72 sm:text-lg">
              Reach us by phone, WhatsApp, or the form below. We see patients by
              appointment with evening availability in the heart of Marylebone.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {contactPoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + index * 0.07,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="rounded-full border border-[var(--gold)]/25 bg-white/55 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[var(--brand-dark)]/70 backdrop-blur-sm"
                >
                  {point}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.45,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <CtaButton href="#message" variant="primary">
                Send a message
              </CtaButton>
              <CtaButton href={getWhatsAppHref()} variant="secondary">
                WhatsApp
              </CtaButton>
              <CtaButton href={CLINIC.phoneHref} variant="secondary">
                Call {CLINIC.phoneDisplay}
              </CtaButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative"
          >
            <div
              className="absolute -inset-px rounded-[calc(var(--radius-card)+1px)] bg-linear-to-br from-[var(--gold)]/50 via-[var(--gold)]/20 to-transparent opacity-60"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--gold)]/20 bg-white/70 p-6 shadow-lg shadow-[var(--brand-dark)]/6 backdrop-blur-md sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.375 4.5 8.25 4.5 8.25s4.5-4.875 4.5-8.25A4.5 4.5 0 0 0 8 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                <p className="font-[var(--font-serif)] text-lg tracking-tight text-[var(--brand-dark)]">
                  Visit us
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {infoRows.map((row, index) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.35 + index * 0.08,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="flex gap-4 border-t border-[var(--brand-dark)]/6 pt-5 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        {row.icon}
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--gold)] uppercase">
                        {row.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--brand-dark)]/75">
                        {row.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
