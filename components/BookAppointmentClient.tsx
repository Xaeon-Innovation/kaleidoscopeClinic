"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CtaButton } from "@/components/CtaButton";
import { CLINIC } from "@/components/siteLinks";

const TZ = "Europe/London";

type SlotDto = { start: string; end: string };

function ymdInTz(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function addDaysToYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utc = Date.UTC(y!, m! - 1, d! + delta, 12, 0, 0);
  return ymdInTz(new Date(utc));
}

function formatSlotLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function groupSlotsByDay(slots: SlotDto[]): Map<string, SlotDto[]> {
  const map = new Map<string, SlotDto[]>();
  for (const s of slots) {
    const day = ymdInTz(new Date(s.start));
    const list = map.get(day) ?? [];
    list.push(s);
    map.set(day, list);
  }
  return map;
}

export function BookAppointmentClient() {
  const [fromDay, setFromDay] = useState(() => ymdInTz(new Date()));
  const toDay = useMemo(() => addDaysToYmd(fromDay, 13), [fromDay]);

  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "error" | "unavailable"
  >("idle");
  const [fetchDetail, setFetchDetail] = useState<string | null>(null);

  const [selected, setSelected] = useState<SlotDto | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    setFetchDetail(null);
    try {
      const u = new URL("/api/calendar/availability", window.location.origin);
      u.searchParams.set("from", fromDay);
      u.searchParams.set("to", toDay);
      const res = await fetch(u.toString());
      const data = (await res.json()) as {
        error?: string;
        detail?: string;
        slots?: SlotDto[];
      };
      if (res.status === 503) {
        setLoadState("unavailable");
        setFetchDetail(data.detail ?? data.error ?? null);
        setSlots([]);
        return;
      }
      if (!res.ok) {
        setLoadState("error");
        setFetchDetail(data.error ?? `Error ${res.status}`);
        setSlots([]);
        return;
      }
      setSlots(data.slots ?? []);
      setLoadState("idle");
    } catch {
      setLoadState("error");
      setFetchDetail("Network error");
      setSlots([]);
    }
  }, [fromDay, toDay]);

  useEffect(() => {
    void load();
  }, [load]);

  const byDay = useMemo(() => groupSlotsByDay(slots), [slots]);
  const dayKeys = useMemo(() => Array.from(byDay.keys()).sort(), [byDay]);

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotStart: selected.start,
          slotEnd: selected.end,
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setSubmitError(data.error ?? "Could not start payment.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setSubmitError("No checkout URL returned.");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canPay =
    selected &&
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 8;

  return (
    <div className="space-y-10">
      <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
            Choose a time
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--brand-dark)]/20 px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--surface-warm)]"
              onClick={() =>
                setFromDay((d) => addDaysToYmd(d, -7))
              }
            >
              Previous week
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--brand-dark)]/20 px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--surface-warm)]"
              onClick={() =>
                setFromDay((d) => addDaysToYmd(d, 7))
              }
            >
              Next week
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-[var(--brand-dark)]/70">
          Showing availability {fromDay} to {toDay} ({TZ.replace("_", " ")}).
        </p>

        {loadState === "loading" ? (
          <p className="mt-6 text-sm text-[var(--brand-dark)]/65">
            Loading slots…
          </p>
        ) : null}
        {loadState === "unavailable" ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-medium">Online booking is not available.</p>
            {fetchDetail ? (
              <p className="mt-1 text-xs opacity-90">{fetchDetail}</p>
            ) : null}
            <p className="mt-3 text-sm">
              Call{" "}
              <a
                className="font-semibold underline"
                href={CLINIC.phoneHref}
              >
                {CLINIC.phoneDisplay}
              </a>{" "}
              or email{" "}
              <a
                className="font-semibold underline"
                href={`mailto:${CLINIC.email}`}
              >
                {CLINIC.email}
              </a>
              .
            </p>
          </div>
        ) : null}
        {loadState === "error" ? (
          <p className="mt-6 text-sm text-red-700">
            {fetchDetail ?? "Could not load availability."}{" "}
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => void load()}
            >
              Retry
            </button>
          </p>
        ) : null}

        {loadState === "idle" && dayKeys.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--brand-dark)]/65">
            No open slots in this two-week window. Try another week or contact
            the clinic.
          </p>
        ) : null}

        <div className="mt-6 space-y-8">
          {dayKeys.map((day) => (
            <div key={day}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--gold)]">
                {(() => {
                  const [yy, mm, dd] = day.split("-").map(Number);
                  const noon = new Date(Date.UTC(yy!, mm! - 1, dd!, 12, 0, 0));
                  return new Intl.DateTimeFormat("en-GB", {
                    timeZone: TZ,
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(noon);
                })()}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(byDay.get(day) ?? []).map((s) => {
                  const active =
                    selected?.start === s.start && selected?.end === s.end;
                  return (
                    <button
                      key={s.start}
                      type="button"
                      onClick={() => setSelected(s)}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-medium transition",
                        active
                          ? "bg-[var(--gold)] text-[var(--ink-on-gold)]"
                          : "border border-[var(--brand-dark)]/20 bg-white text-[var(--brand-dark)] hover:bg-[var(--surface-warm)]",
                      ].join(" ")}
                    >
                      {formatSlotLabel(s.start)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected ? (
        <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
            Your details &amp; deposit
          </h2>
          <p className="mt-2 text-sm text-[var(--brand-dark)]/75">
            Selected:{" "}
            <span className="font-medium text-[var(--brand-dark)]">
              {formatSlotLabel(selected.start)} –{" "}
              {new Intl.DateTimeFormat("en-GB", {
                timeZone: TZ,
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(selected.end))}
            </span>
          </p>
          <p className="mt-2 text-sm text-[var(--brand-dark)]/65">
            A deposit secures this appointment. You&apos;ll complete payment on
            Stripe, then receive confirmation.
          </p>

          <form onSubmit={onPay} className="mt-6 grid max-w-lg gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]">
                Full name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-11 rounded-xl border border-[var(--brand-dark)]/15 px-3 py-2 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]">
                Email
              </span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11 rounded-xl border border-[var(--brand-dark)]/15 px-3 py-2 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[var(--brand-dark)]">
                Phone
              </span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-11 rounded-xl border border-[var(--brand-dark)]/15 px-3 py-2 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>

            {submitError ? (
              <p className="text-sm text-red-700">{submitError}</p>
            ) : null}

            <button
              type="submit"
              disabled={!canPay || submitting}
              className="mt-2 inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-[var(--gold)] px-8 text-sm font-semibold text-[var(--ink-on-gold)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--gold-2)] disabled:opacity-50"
            >
              {submitting ? "Redirecting to Stripe…" : "Pay deposit & confirm"}
            </button>
          </form>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <CtaButton href="/contact" variant="secondary">
          Contact us instead
        </CtaButton>
      </div>
    </div>
  );
}
