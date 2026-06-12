"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-5 shrink-0 bg-[var(--gold)]" aria-hidden />
      <p className="text-xs font-semibold tracking-[0.15em] text-[var(--gold)] uppercase">
        {children}
      </p>
    </div>
  );
}

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-px w-12 origin-left bg-[var(--gold)] ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    />
  );
}

export { BrandLogo as KaleidoscopeLogo } from "@/components/BrandLogo";
