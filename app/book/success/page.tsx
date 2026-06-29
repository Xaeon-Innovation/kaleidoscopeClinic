import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC } from "@/components/siteLinks";
import { fulfillCheckoutBySessionId } from "@/lib/booking/fulfillCheckout";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Booking payment received",
  description: "Your consultation deposit payment has been received.",
  path: "/book/success",
  noindex: true,
});

type SearchParams = Promise<{ session_id?: string }>;

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const sessionId = sp.session_id?.trim();
  const hasSession = Boolean(sessionId);

  let fulfillmentError: string | null = null;
  let fulfilled = false;

  if (sessionId) {
    const result = await fulfillCheckoutBySessionId(sessionId);
    if (result.ok) {
      fulfilled = true;
    } else {
      fulfillmentError = result.error;
      console.error("book success fulfill", sessionId, result.error);
    }
  }

  return (
    <div className="min-h-full">
      <SiteHeader />

      <section className="page-section bg-[var(--surface-warm)]">
        <div className="page-section-inner max-w-xl">
          <div className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-8 shadow-[var(--shadow-soft)]">
            <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
              Thank you
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--brand-dark)]/80">
              {fulfilled
                ? "Your deposit payment was received and your consultation is on our calendar. A confirmation email is on its way to you — please also keep the receipt from Stripe for your records."
                : hasSession
                  ? "Your deposit payment was received. We are confirming your appointment — if nothing appears on our calendar within a few minutes, please contact us."
                  : "If you completed payment, your consultation should soon appear on our calendar. You will receive a confirmation email from us, and a payment receipt from Stripe."}
            </p>
            {fulfillmentError && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                We could not add your appointment to the calendar automatically (
                {fulfillmentError}). Please call or email us with your booking
                details so we can confirm manually.
              </p>
            )}
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
        </div>
      </section>
    </div>
  );
}
