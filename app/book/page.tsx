import { BookAppointmentClient } from "@/components/BookAppointmentClient";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Book a consultation",
  description:
    "Choose an appointment time and pay a consultation deposit online.",
};

export default function BookPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Book online
          </p>
          <h1 className="font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Consultation booking
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--brand-dark)]/80 sm:text-base">
            Pick an available time from our live calendar, enter your details,
            and pay a deposit to confirm your slot. You will be redirected to
            Stripe to complete payment securely.
          </p>
        </header>

        <div className="mt-10">
          <BookAppointmentClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
