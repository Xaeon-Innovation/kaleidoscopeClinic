"use client";

import { useCallback, useEffect, useState } from "react";
import type { BookingSettings, DaySchedule } from "@/lib/booking/settingsTypes";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function formatHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const CLOSE_OPTIONS = Array.from({ length: 24 }, (_, i) => i + 1);

export function BookingScheduleForm() {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/booking/settings");
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { settings: BookingSettings };
      setSettings(data.settings);
    } catch {
      setError("Could not load booking schedule.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateDay(weekday: number, patch: Partial<DaySchedule>) {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((d) =>
          d.weekday === weekday ? { ...d, ...patch } : d
        ),
      };
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/booking/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as {
        settings?: BookingSettings;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSettings(data.settings ?? settings);
      setMessage("Booking schedule saved. Changes apply to /book immediately.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-black/45">
        Online booking hours
      </h2>
      <p className="mt-2 text-sm text-black/60">
        Set open and close times for each day. Block specific times in Google
        Calendar (meetings, leave). Patients only see slots on enabled days.
      </p>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-black/50">Loading schedule…</p>
      ) : settings ? (
        <form onSubmit={save} className="mt-5 space-y-5">
          <div className="overflow-x-auto rounded-xl border border-black/8">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/8 bg-black/[0.02] text-xs uppercase tracking-wider text-black/45">
                  <th className="px-3 py-2">Day</th>
                  <th className="px-3 py-2 text-center">Book online</th>
                  <th className="px-3 py-2">From</th>
                  <th className="px-3 py-2">Until</th>
                </tr>
              </thead>
              <tbody>
                {settings.days.map((day) => (
                  <tr
                    key={day.weekday}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-3 py-2.5 font-medium text-[var(--brand-dark)]">
                      {DAY_NAMES[day.weekday - 1]}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        aria-label={`${DAY_NAMES[day.weekday - 1]} book online`}
                        onChange={(e) =>
                          updateDay(day.weekday, { enabled: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-black/20"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={day.openHour}
                        disabled={!day.enabled}
                        aria-label={`${DAY_NAMES[day.weekday - 1]} opens`}
                        onChange={(e) =>
                          updateDay(day.weekday, {
                            openHour: Number(e.target.value),
                          })
                        }
                        className="h-9 w-full rounded-lg border border-black/10 px-2 disabled:opacity-40"
                      >
                        {HOUR_OPTIONS.map((h) => (
                          <option key={h} value={h}>
                            {formatHour(h)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={day.closeHour}
                        disabled={!day.enabled}
                        aria-label={`${DAY_NAMES[day.weekday - 1]} closes`}
                        onChange={(e) =>
                          updateDay(day.weekday, {
                            closeHour: Number(e.target.value),
                          })
                        }
                        className="h-9 w-full rounded-lg border border-black/10 px-2 disabled:opacity-40"
                      >
                        {CLOSE_OPTIONS.filter((h) => h > day.openHour).map(
                          (h) => (
                            <option key={h} value={h}>
                              {formatHour(h)}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-black/70">
                Appointment length (minutes)
              </span>
              <select
                value={settings.slotMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    slotMinutes: Number(e.target.value),
                  })
                }
                className="h-10 rounded-xl border border-black/10 px-3"
              >
                {[30, 45, 60, 90].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-black/70">
                Deposit (£)
              </span>
              <input
                type="number"
                min={1}
                step={1}
                value={settings.depositPence / 100}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    depositPence: Math.round(
                      parseFloat(e.target.value || "0") * 100
                    ),
                  })
                }
                className="h-10 rounded-xl border border-black/10 px-3"
              />
            </label>
          </div>

          <p className="text-xs text-black/45">
            Timezone: {settings.timezone} (change via{" "}
            <code className="rounded bg-black/5 px-1">BOOKING_TIMEZONE</code> in
            env if needed)
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save booking schedule"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
