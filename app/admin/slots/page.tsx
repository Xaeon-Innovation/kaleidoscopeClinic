"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

type Slot = {
  id: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  label: string;
  booked: boolean;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!, 12));
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(dt);
}

// Generate bulk slots: every N minutes between start and end
function generateBulkSlots(
  date: string,
  openTime: string,
  closeTime: string,
  durationMins: number
): Array<{ date: string; startTime: string; endTime: string }> {
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  const openMins = oh! * 60 + om!;
  const closeMins = ch! * 60 + cm!;
  const slots = [];
  for (let start = openMins; start + durationMins <= closeMins; start += durationMins) {
    const end = start + durationMins;
    const fmt = (m: number) =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    slots.push({ date, startTime: fmt(start), endTime: fmt(end) });
  }
  return slots;
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Single slot form
  const [singleDate, setSingleDate] = useState("");
  const [singleStart, setSingleStart] = useState("09:00");
  const [singleEnd, setSingleEnd] = useState("10:00");
  const [singleLabel, setSingleLabel] = useState("");

  // Bulk form
  const [bulkDate, setBulkDate] = useState("");
  const [bulkOpen, setBulkOpen] = useState("09:00");
  const [bulkClose, setBulkClose] = useState("17:00");
  const [bulkDuration, setBulkDuration] = useState("60");
  const [mode, setMode] = useState<"single" | "bulk">("single");

  const today = new Date().toISOString().split("T")[0]!;

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(
        query(
          collection(getFirebaseDb(), "availableSlots"),
          where("date", ">=", today),
          orderBy("date", "asc"),
          orderBy("startTime", "asc")
        )
      );
      setSlots(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Slot, "id">) })));
    } catch {
      setError("Failed to load slots. Make sure Firebase is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function addSingleSlot() {
    if (!singleDate || !singleStart || !singleEnd) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: singleDate,
          startTime: singleStart,
          endTime: singleEnd,
          label: singleLabel.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to add slot.");
      
      setSingleDate("");
      setSingleStart("09:00");
      setSingleEnd("10:00");
      setSingleLabel("");
      await refresh();
    } catch {
      setError("Failed to add slot. You may need to refresh.");
    } finally {
      setSaving(false);
    }
  }

  async function addBulkSlots() {
    if (!bulkDate) return;
    const generated = generateBulkSlots(bulkDate, bulkOpen, bulkClose, Number(bulkDuration) || 60);
    if (generated.length === 0) {
      setError("No slots could be generated with those settings.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        generated.map((s) =>
          fetch("/api/slots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...s, label: "" }),
          })
        )
      );
      setBulkDate("");
      await refresh();
    } catch {
      setError("Failed to add bulk slots.");
    } finally {
      setSaving(false);
    }
  }

  async function removeSlot(id: string) {
    if (!confirm("Remove this slot?")) return;
    try {
      const res = await fetch("/api/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to remove slot.");
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to remove slot.");
    }
  }

  // Group slots by date
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date]!.push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
          Available Booking Slots
        </h1>
        <p className="mt-1 text-sm text-black/55">
          Add time slots that patients can choose from on the booking page.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add slot form */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1 w-fit mb-5">
          {(["single", "bulk"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={[
                "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition",
                mode === m ? "bg-white shadow-sm text-[var(--brand-dark)]" : "text-black/50",
              ].join(" ")}
            >
              {m === "single" ? "Add single slot" : "Bulk generate day"}
            </button>
          ))}
        </div>

        {mode === "single" ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-xs font-semibold text-black/60">Date</span>
              <input
                type="date"
                min={today}
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/60">Start time</span>
              <input
                type="time"
                value={singleStart}
                onChange={(e) => setSingleStart(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/60">End time</span>
              <input
                type="time"
                value={singleEnd}
                onChange={(e) => setSingleEnd(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1 sm:col-span-4">
              <span className="text-xs font-semibold text-black/60">Label (optional, e.g. "Implant Consultation")</span>
              <input
                type="text"
                value={singleLabel}
                onChange={(e) => setSingleLabel(e.target.value)}
                placeholder="Leave blank for generic consultation"
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <div className="sm:col-span-4">
              <button
                disabled={!singleDate || !singleStart || !singleEnd || saving}
                onClick={addSingleSlot}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-50 hover:bg-[var(--gold-2)]"
              >
                {saving ? "Adding…" : "Add slot"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-xs font-semibold text-black/60">Date</span>
              <input
                type="date"
                min={today}
                value={bulkDate}
                onChange={(e) => setBulkDate(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/60">Opens at</span>
              <input
                type="time"
                value={bulkOpen}
                onChange={(e) => setBulkOpen(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/60">Closes at</span>
              <input
                type="time"
                value={bulkClose}
                onChange={(e) => setBulkClose(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/60">Slot duration (minutes)</span>
              <select
                value={bulkDuration}
                onChange={(e) => setBulkDuration(e.target.value)}
                className="h-11 rounded-xl border border-black/10 px-3 text-sm text-[var(--brand-dark)] outline-none focus:border-[var(--gold)]"
              >
                {[30, 45, 60, 90].map((v) => (
                  <option key={v} value={v}>{v} minutes</option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-3 flex items-end">
              {bulkDate && (
                <p className="text-xs text-black/50">
                  Will generate{" "}
                  <strong>
                    {generateBulkSlots(bulkDate, bulkOpen, bulkClose, Number(bulkDuration)).length}
                  </strong>{" "}
                  slots on {formatDisplayDate(bulkDate)}.
                </p>
              )}
            </div>
            <div className="sm:col-span-4">
              <button
                disabled={!bulkDate || saving}
                onClick={addBulkSlots}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-50 hover:bg-[var(--gold-2)]"
              >
                {saving ? "Adding…" : "Generate slots"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slot list */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black/45">
            Upcoming slots ({slots.length})
          </h2>
          <button
            onClick={refresh}
            className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/[0.03]"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-black/[0.04]" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="py-8 text-center text-sm text-black/40">
            No upcoming slots. Add some above.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, daySlots]) => (
              <div key={date}>
                <p className="mb-2 text-xs font-semibold text-[var(--brand-dark)]/70 uppercase tracking-wider">
                  {formatDisplayDate(date)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((s) => (
                    <div
                      key={s.id}
                      className={[
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1",
                        s.booked
                          ? "bg-black/[0.04] text-black/40 ring-black/8 line-through"
                          : "bg-[var(--surface-warm)] text-[var(--brand-dark)] ring-[var(--brand-dark)]/10",
                      ].join(" ")}
                    >
                      <span className="font-medium">
                        {s.startTime}–{s.endTime}
                      </span>
                      {s.label && (
                        <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-xs">
                          {s.label}
                        </span>
                      )}
                      {s.booked && (
                        <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-xs">
                          Booked
                        </span>
                      )}
                      {!s.booked && (
                        <button
                          onClick={() => removeSlot(s.id)}
                          className="ml-1 text-black/30 hover:text-red-600 transition"
                          title="Remove slot"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
