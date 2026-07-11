import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CtaButton } from "@/components/CtaButton";
import { releaseUnpaidBookingHold } from "@/lib/booking/holds";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Booking cancelled",
  description: "Your consultation booking was not completed.",
  path: "/book/cancelled",
  noindex: true,
});

type SearchParams = Promise<{ session_id?: string }>;

export default async function BookCancelledPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const sessionId = sp.session_id?.trim();

  let released = false;

  if (sessionId) {
    const result = await releaseUnpaidBookingHold(sessionId);
    released = result.released;
    if (!result.released && result.reason !== "Payment already completed.") {
      console.warn("book cancelled release", sessionId, result.reason);
    }
  }

  return (
    <div className="min-h-full">
      <SiteHeader />

      <section className="page-section bg-[var(--surface-warm)]">
        <div className="page-section-inner max-w-xl">
          <div className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-8 shadow-[var(--shadow-soft)]">
            <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
              Payment cancelled
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--brand-dark)]/80">
              {released
                ? "Your deposit was not charged and your time slot is available again. You can choose another slot whenever you are ready."
                : sessionId
                  ? "Your deposit was not charged. You can return to booking and choose a time that suits you."
                  : "Your deposit was not charged. You can return to booking and choose a time that suits you."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton href="/book" variant="primary">
                Book again
              </CtaButton>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--gold)] ring-1 ring-[var(--gold)] transition hover:bg-[var(--surface-warm)]"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
