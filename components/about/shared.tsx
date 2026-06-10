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

export function KaleidoscopeLogo({
  size = 28,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <polygon
        points="16,6 23,10 23,22 16,26 9,22 9,10"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      <polygon
        points="16,10 20,12.5 20,19.5 16,22 12,19.5 12,12.5"
        fill={color}
        opacity="0.4"
      />
      <circle cx="16" cy="16" r="1.5" fill={color} />
    </svg>
  );
}
