"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC, getWhatsAppHref } from "@/components/siteLinks";

const TZ = "Europe/London";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
  booked: boolean;
};

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(d);
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

export function BookAppointmentClient() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error" | "unavailable">("loading");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Patient form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/slots");
      if (!res.ok) {
        setLoadState("error");
        return;
      }
      const data = await res.json() as { slots?: Slot[]; error?: string };
      const available = (data.slots ?? []).filter((s) => !s.booked);
      setSlots(available);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Build set of dates that have available slots
  const availableDates = useMemo(() => {
    return new Set(slots.map((s) => s.date));
  }, [slots]);

  // Slots for the selected date
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
      // Build a Stripe checkout (or fallback to WhatsApp if Stripe not configured)
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          slotStart: `${selectedSlot.date}T${selectedSlot.startTime}:00`,
          slotEnd: `${selectedSlot.date}T${selectedSlot.endTime}:00`,
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setSubmitError(data.error ?? "Could not start payment. Please message us on WhatsApp.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setSubmitError("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  const canConfirm =
    !!selectedSlot &&
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 8;

  return (
    <div className="space-y-6">
      {/* Step 1 – Calendar */}
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
          Dates highlighted in gold have available appointments.
        </p>

        {loadState === "loading" && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-xl bg-black/[0.04]" />
            ))}
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

      {/* Step 2 – Time slot picker */}
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
            {formatDisplayDate(selectedDate)} — select your preferred slot.
          </p>

          <div className="flex flex-wrap gap-2">
            {daySlots.map((s) => {
              const active = selectedSlot?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={[
                    "rounded-full px-5 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-[var(--brand-dark)] text-white shadow"
                      : "border border-[var(--brand-dark)]/15 bg-white text-[var(--brand-dark)] hover:border-[var(--gold)] hover:bg-[var(--surface-warm)]",
                  ].join(" ")}
                >
                  {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  {s.label ? ` · ${s.label}` : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3 – Patient details */}
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
              {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}
            </strong>
          </p>

          <form onSubmit={onConfirm} className="grid max-w-md gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">Email address</span>
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
              <span className="text-xs font-semibold text-[var(--brand-dark)]/70">Phone number</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl border border-[var(--brand-dark)]/15 px-4 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>

            {submitError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!canConfirm || submitting}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--gold)] px-8 text-sm font-semibold text-[var(--ink-on-gold)] shadow-md transition hover:bg-[var(--gold-2)] disabled:opacity-50"
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
