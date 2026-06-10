"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC, getWhatsAppHref } from "@/components/siteLinks";
import { CLINIC_TIMEZONE, CLINIC_TIMEZONE_LABEL } from "@/lib/booking/timezone";

type ConsultationOption = { slug: string; name: string };

const TZ = CLINIC_TIMEZONE;
const AVAILABILITY_DAYS = 60;

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slotStartIso: string;
  slotEndIso: string;
  available: boolean;
};

function ymdInTz(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function hmInTz(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function addDaysYmd(ymd: string, days: number, timeZone: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(y!, m! - 1, d! + days, 12));
  return ymdInTz(utc, timeZone);
}

function mapApiSlot(
  startIso: string,
  endIso: string,
  available: boolean
): Slot {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const date = ymdInTz(start, TZ);
  return {
    id: `${startIso}|${endIso}`,
    date,
    startTime: hmInTz(start, TZ),
    endTime: hmInTz(end, TZ),
    slotStartIso: startIso,
    slotEndIso: endIso,
    available,
  };
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!, 12));
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dt);
}

export function BookAppointmentClient({
  bookableConsultations,
}: {
  bookableConsultations: ConsultationOption[];
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadState, setLoadState] = useState<
    "loading" | "ready" | "error" | "unavailable"
  >("loading");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [consultationTreatment, setConsultationTreatment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const from = ymdInTz(new Date(), TZ);
      const to = addDaysYmd(from, AVAILABILITY_DAYS, TZ);
      const res = await fetch(
        `/api/calendar/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      if (res.status === 503) {
        setSlots([]);
        setLoadState("unavailable");
        return;
      }
      if (!res.ok) {
        setLoadState("error");
        return;
      }
      const data = (await res.json()) as {
        slots?: { start: string; end: string; available?: boolean }[];
      };
      setSlots(
        (data.slots ?? []).map((s) =>
          mapApiSlot(s.start, s.end, s.available !== false)
        )
      );
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const availableDates = useMemo(() => {
    return new Set(
      slots.filter((s) => s.available).map((s) => s.date)
    );
  }, [slots]);

  const daySlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots, selectedDate]);

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotStart: selectedSlot.slotStartIso,
          slotEnd: selectedSlot.slotEndIso,
          consultationTreatment,
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
          ...(note.trim() ? { patientNote: note.trim() } : {}),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setSubmitError(
          data.error ??
            "Could not start payment. Please message us on WhatsApp."
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or contact us on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const consultationNameForSlug = useMemo(() => {
    const bySlug = new Map(
      bookableConsultations.map((option) => [option.slug, option.name])
    );
    return (slug: string) => bySlug.get(slug);
  }, [bookableConsultations]);

  const isValidConsultationSlug = useMemo(() => {
    const slugs = new Set(bookableConsultations.map((option) => option.slug));
    return (slug: string) => slugs.has(slug);
  }, [bookableConsultations]);

  const canConfirm =
    !!selectedSlot &&
    isValidConsultationSlug(consultationTreatment) &&
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 8;

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--brand-dark)]/8 sm:p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[var(--ink-on-gold)]">
            1
          </span>
          <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)]">
            Choose a date
          </h2>
        </div>
        <p className="mb-5 text-sm text-[var(--brand-dark)]/55">
          Dates highlighted in gold have available appointments (live calendar
          availability).
        </p>

        {loadState === "loading" && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-xl bg-black/[0.04]"
              />
            ))}
          </div>
        )}

        {loadState === "unavailable" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            <p className="font-medium">Online booking is not available right now.</p>
            <p className="mt-2">
              Please{" "}
              <a
                href={getWhatsAppHref("Hi, I'd like to book a consultation.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                message us on WhatsApp
              </a>{" "}
              or call{" "}
              <a href={CLINIC.phoneHref} className="font-semibold underline">
                {CLINIC.phoneDisplay}
              </a>
              .
            </p>
          </div>
        )}

        {loadState === "error" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            <p className="font-medium">Could not load available appointments.</p>
            <p className="mt-2">
              Please{" "}
              <a
                href={getWhatsAppHref("Hi, I'd like to book a consultation.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                message us on WhatsApp
              </a>{" "}
              or call{" "}
              <a href={CLINIC.phoneHref} className="font-semibold underline">
                {CLINIC.phoneDisplay}
              </a>
              .
            </p>
          </div>
        )}

        {loadState === "ready" && availableDates.size === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            <p className="font-medium">No appointments available online right now.</p>
            <p className="mt-2">
              Please{" "}
              <a
                href={getWhatsAppHref("Hi, I'd like to book a consultation.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                message us on WhatsApp
              </a>{" "}
              to arrange a time.
            </p>
          </div>
        )}

        {loadState === "ready" && availableDates.size > 0 && (
          <CalendarGrid
            availableDates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        )}
      </div>

      {selectedDate && daySlots.length > 0 && (
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--brand-dark)]/8 sm:p-8">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[var(--ink-on-gold)]">
              2
            </span>
            <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)]">
              Choose a time
            </h2>
          </div>
          <p className="mb-5 text-sm text-[var(--brand-dark)]/55">
            {formatDisplayDate(selectedDate)} — select your preferred slot. All
            times are {CLINIC_TIMEZONE_LABEL}.
          </p>

          <div className="flex flex-wrap gap-2">
            {daySlots.map((s) => {
              const active = selectedSlot?.id === s.id;
              const booked = !s.available;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={booked}
                  onClick={() => !booked && setSelectedSlot(s)}
                  className={[
                    "rounded-full px-5 py-2.5 text-sm font-medium transition",
                    booked
                      ? "cursor-not-allowed border border-[var(--brand-dark)]/8 bg-[var(--brand-dark)]/[0.04] text-[var(--brand-dark)]/40"
                      : active
                        ? "bg-[var(--brand-dark)] text-white shadow"
                        : "border border-[var(--brand-dark)]/15 bg-white text-[var(--brand-dark)] hover:border-[var(--gold)] hover:bg-[var(--surface-warm)]",
                  ].join(" ")}
                >
                  {s.startTime} – {s.endTime}
                  {booked && (
                    <span className="ml-1.5 text-[var(--brand-dark)]/35">
                      · Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--brand-dark)]/8 sm:p-8">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[var(--ink-on-gold)]">
              3
            </span>
            <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)]">
              Your details
            </h2>
          </div>
          <p className="mb-5 text-sm text-[var(--brand-dark)]/55">
            Selected:{" "}
            <strong className="text-[var(--brand-dark)]">
              {formatDisplayDate(selectedSlot.date)},{" "}
              {selectedSlot.startTime} – {selectedSlot.endTime} (
              {CLINIC_TIMEZONE_LABEL})
            </strong>
            {consultationTreatment && (
              <>
                {" "}
                ·{" "}
                <strong className="text-[var(--brand-dark)]">
                  {consultationNameForSlug(consultationTreatment)}
                </strong>
              </>
            )}
          </p>

          <form onSubmit={onConfirm} className="grid w-full max-w-md gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">
                Consultation for
              </span>
              <select
                required
                value={consultationTreatment}
                onChange={(e) => setConsultationTreatment(e.target.value)}
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 bg-white px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              >
                <option value="">Select a treatment or general consultation</option>
                {bookableConsultations.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">
                Full name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">
                Email address
              </span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">
                Phone number
              </span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">
                Note for the clinic{" "}
                <span className="font-normal text-[var(--brand-dark)]/45">
                  (optional)
                </span>
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="e.g. reason for visit, preferred contact method, accessibility needs…"
                className="resize-y rounded-xl border border-[var(--brand-dark)]/15 px-4 py-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
              <span className="text-[10px] text-[var(--brand-dark)]/40">
                Included in your calendar appointment for the team.
              </span>
            </label>

            {submitError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!canConfirm || submitting}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] shadow-md transition hover:bg-[var(--gold-2)] disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {submitting ? "Redirecting to payment…" : "Confirm & pay deposit →"}
            </button>

            <p className="text-xs text-[var(--brand-dark)]/45">
              A deposit secures your slot. You&apos;ll be redirected to Stripe to
              complete payment securely.
            </p>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <CtaButton
          href={getWhatsAppHref("Hi, I'd like to book a consultation.")}
          variant="secondary"
        >
          Book via WhatsApp instead
        </CtaButton>
        <CtaButton href="/contact" variant="secondary">
          Contact us
        </CtaButton>
      </div>
    </div>
  );
}
