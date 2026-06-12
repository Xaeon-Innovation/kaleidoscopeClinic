import { SectionLabel } from "@/components/about/shared";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_LAST_UPDATED = "12 June 2026";

type LegalPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-[var(--font-serif)] text-xl font-semibold tracking-tight text-[var(--brand-dark)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--brand-dark)]/75">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <div className="min-h-full">
      <SiteHeader />

      <section className="page-section page-section-flow bg-linear-to-b from-[var(--section-cream)] via-white to-[var(--section-cream)]">
        <div className="page-section-inner max-w-3xl">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="mt-4 font-[var(--font-serif)] text-3xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--brand-dark)]/65">
            {description}
          </p>
          <p className="mt-2 text-xs text-[var(--brand-dark)]/50">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>

          <div className="mt-10 space-y-8">{children}</div>

          <p className="mt-12 border-t border-[var(--brand-dark)]/10 pt-6 text-sm text-[var(--brand-dark)]/65">
            Questions about this page?{" "}
            <Link
              href="/contact"
              className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2 hover:decoration-[var(--gold)]"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
