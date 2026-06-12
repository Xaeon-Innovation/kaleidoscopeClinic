"use client";

import { CtaButton } from "@/components/CtaButton";
import { getWhatsAppHref } from "@/components/siteLinks";
import { KaleidoscopeLogo, reveal } from "@/components/about/shared";
import { ctaTrustItems } from "@/lib/about-data";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="bg-[var(--brand-dark)] py-20 text-white sm:py-28">
      <div className="page-section-inner">
        <motion.div
          {...reveal}
          className="mx-auto max-w-3xl text-center"
        >
          <KaleidoscopeLogo size={36} color="var(--gold)" />
          <h2 className="mt-8 font-[var(--font-serif)] text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Begin with a specialist consultation
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75">
            Discover what is genuinely possible for your smile. Our team will take
            the time to understand your situation, answer every question, and
            create a plan built entirely around you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton href="/book" variant="primary" className="h-11 px-8">
              Book Your Consultation
            </CtaButton>
            <CtaButton
              href={getWhatsAppHref("Hi, I'd like to book a consultation.")}
              variant="ghost"
              className="h-11 px-8"
            >
              Message on WhatsApp
            </CtaButton>
          </div>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ctaTrustItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs text-white/55"
              >
                <span className="h-1 w-1 rounded-full bg-[var(--gold)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
