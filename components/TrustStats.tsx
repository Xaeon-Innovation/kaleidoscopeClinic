"use client";

import { CtaButton } from "@/components/CtaButton";
import { LeadSpecialistQuote } from "@/components/LeadSpecialistQuote";
import { defaultTestimonialDisplay } from "@/lib/content/mapTestimonials";
import { useEffect, useRef, useState } from "react";
export type TrustStatsTestimonial = {
  quote: string;
  name: string;
  treatment?: string;
};

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
  smallSuffix?: boolean;
}

const STATS: StatItem[] = [
  { value: 4800, suffix: "+", label: "Happy Patients" },
  { value: 4.9, suffix: "", label: "Average Rating", isDecimal: true },
  { value: 12, suffix: "", label: "Years of Excellence" },
  { value: 98, suffix: "%", label: "Recommend Us", smallSuffix: true },
];

const DEFAULT_TESTIMONIALS: TrustStatsTestimonial[] =
  defaultTestimonialDisplay();

function useCountUp(target: number, isDecimal = false, triggered: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    if (isDecimal) {
      setCount(target);
      return;
    }
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 24);
    return () => clearInterval(timer);
  }, [triggered, target, isDecimal]);

  return count;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
}

function StatCounter({
  stat,
  triggered,
  index,
  total,
}: {
  stat: StatItem;
  triggered: boolean;
  index: number;
  total: number;
}) {
  const count = useCountUp(stat.value, stat.isDecimal, triggered);
  const displayValue = stat.isDecimal ? stat.value.toFixed(1) : count.toLocaleString();

  return (
    <div
      className={[
        "flex flex-col items-center px-6 py-7 text-center sm:px-8 sm:py-8",
        index % 2 === 0 ? "max-lg:border-r max-lg:border-white/[0.08]" : "",
        index < 2 ? "max-lg:border-b max-lg:border-white/[0.08]" : "",
        index < total - 1 ? "lg:border-r lg:border-white/[0.08]" : "",
      ].join(" ")}
    >
      <span className="font-[var(--font-serif)] text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold leading-none text-[var(--gold)]">
        {displayValue}
        {stat.suffix ? (
          <span
            className={
              stat.smallSuffix
                ? "ml-0.5 text-[0.55em] font-bold leading-none"
                : ""
            }
          >
            {stat.suffix}
          </span>
        ) : null}
      </span>
      {stat.isDecimal ? (
        <div className="mb-1 mt-2.5 flex gap-0.5 text-[var(--gold)]" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
      ) : null}
      <span className="mt-2 text-[clamp(0.65rem,0.6rem+0.2vw,0.75rem)] font-medium uppercase tracking-[0.08em] text-white/45">
        {stat.label}
      </span>
    </div>
  );
}

function initialsFromName(name: string) {
  const cleaned = name.replace(/\./g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function buildCarouselItems(items: TrustStatsTestimonial[]): TrustStatsTestimonial[] {
  const source = items.length > 0 ? items : DEFAULT_TESTIMONIALS;
  const minSlides = 6;
  const expanded: TrustStatsTestimonial[] = [];
  while (expanded.length < minSlides) {
    for (const item of source) {
      expanded.push(item);
      if (expanded.length >= minSlides) break;
    }
  }
  return expanded;
}

function TestimonialCarousel({ items }: { items: TrustStatsTestimonial[] }) {
  const slides = buildCarouselItems(items);
  const loop = [...slides, ...slides];

  return (
    <div
      className="testimonial-marquee relative w-full overflow-hidden"
      aria-label="Patient testimonials"
      role="region"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#0a2523] to-transparent sm:w-16"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#0a2523] to-transparent sm:w-16"
        aria-hidden="true"
      />

      <div className="testimonial-marquee-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
        {loop.map((t, i) => (
          <div
            key={`${i}-${t.name}-${t.quote.slice(0, 16)}`}
            className={[
              "w-[min(85vw,320px)] shrink-0 sm:w-[340px] lg:w-[360px]",
              i >= slides.length ? "testimonial-marquee-duplicate" : "",
            ].join(" ")}
          >
            <MiniCard t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCard({ t }: { t: TrustStatsTestimonial }) {
  const initials = initialsFromName(t.name);

  return (
    <figure className="flex h-full min-h-[220px] flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm transition-[border-color,background-color] duration-200 hover:border-white/15 hover:bg-white/10">
      <div className="flex gap-0.5 text-[var(--gold)]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      <blockquote className="flex-1 text-[clamp(0.875rem,0.8rem+0.35vw,1rem)] leading-relaxed text-white/75">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-1">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate text-[clamp(0.875rem,0.8rem+0.35vw,1rem)] font-semibold text-white">
            {t.name}
          </div>
          {t.treatment ? (
            <div className="truncate text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] text-white/45">
              {t.treatment}
            </div>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

export function TrustStats({
  testimonials,
}: {
  testimonials?: TrustStatsTestimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  const carouselItems =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="page-section scroll-mt-20 bg-[#0a2523] text-white"
      aria-labelledby="trust-stats-heading"
    >
      <div className="page-section-inner max-w-[68.75rem]">
        <LeadSpecialistQuote />

        <div className="mb-10 mt-10 text-center sm:mb-12 sm:mt-12">
          <h2
            id="trust-stats-heading"
            className="font-[var(--font-serif)] text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] leading-tight tracking-tight text-white"
          >
            Trusted by Thousands of Patients
          </h2>
          <p className="mt-2 text-[clamp(0.875rem,0.8rem+0.35vw,1rem)] text-white/50">
            Numbers don&apos;t lie — and neither do our patients
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatCounter
                key={stat.label}
                stat={stat}
                triggered={triggered}
                index={i}
                total={STATS.length}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 w-full sm:mt-12">
        <TestimonialCarousel items={carouselItems} />
      </div>

      <div className="page-section-inner max-w-[68.75rem]">
        <div className="mt-8 sm:hidden">
          <CtaButton href="/book" variant="secondary" className="w-full">
            Book Consultation
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
