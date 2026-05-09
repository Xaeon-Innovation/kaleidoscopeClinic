import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC } from "@/components/siteLinks";

export const metadata = {
  title: "Booking payment received",
};

type SearchParams = Promise<{ session_id?: string }>;

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const hasSession = Boolean(sp.session_id);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl px-4 pb-20 pt-12 sm:px-6">
        <div className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-8 shadow-[var(--shadow-soft)]">
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
            Thank you
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--brand-dark)]/80">
            {hasSession
              ? "Your deposit payment was received. Your consultation should now appear on our calendar, and we will follow up using the contact details you provided."
              : "If you completed payment, your consultation should soon appear on our calendar. Keep the confirmation email from Stripe for your records."}
          </p>
          <p className="mt-4 text-sm text-[var(--brand-dark)]/65">
            Questions? Call{" "}
            <a
              className="font-medium text-[var(--brand-dark)] underline"
              href={CLINIC.phoneHref}
            >
              {CLINIC.phoneDisplay}
            </a>{" "}
            or{" "}
            <a
              className="font-medium text-[var(--brand-dark)] underline"
              href={`mailto:${CLINIC.email}`}
            >
              email us
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton href="/" variant="primary">
              Back to home
            </CtaButton>
            <Link
              href="/treatments"
              className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--gold)] ring-1 ring-[var(--gold)] transition hover:bg-[var(--surface-warm)]"
            >
              View treatments
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
