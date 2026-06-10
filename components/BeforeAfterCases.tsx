"use client";

import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CasesCarousel } from "@/components/CasesCarousel";

export type BeforeAfterCase = {
  id?: string;
  title?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
};

type Props = {
  cases: BeforeAfterCase[];
};

export function BeforeAfterCases({ cases }: Props) {
  if (cases.length === 0) return null;

  const cards = cases.map((c, i) => (
    <div
      key={c.id ?? i}
      className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)] ring-2 ring-[var(--charcoal)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,0,0,0.13)]"
    >
      <BeforeAfterSlider
        beforeSrc={c.beforeImageUrl}
        afterSrc={c.afterImageUrl}
        altBase={c.title || "Case"}
      />
      {c.title ? (
        <div className="mt-3 text-xs font-semibold text-black/70">{c.title}</div>
      ) : null}
    </div>
  ));

  return <CasesCarousel>{cards}</CasesCarousel>;
}
