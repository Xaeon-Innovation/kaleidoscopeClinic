"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { PatientContactActions } from "@/components/admin/PatientContactActions";
import { getFirebaseDb } from "@/lib/firebase/client";
import { CLINIC_TIMEZONE, CLINIC_TIMEZONE_LABEL } from "@/lib/booking/timezone";

type Booking = {
  id: string;
  consultationTreatmentName?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNote?: string;
  slotStart: string | Timestamp;
  slotEnd: string | Timestamp;
  status: "confirmed" | "cancelled" | "attended";
  createdAt: string | Timestamp | null;
  stripeSessionId?: string;
  calendarEventId?: string;
  calendarHtmlLink?: string;
};

function formatDate(val: string | Timestamp | null, timeZone?: string): string {
  if (!val) return "—";
  try {
    const d = val instanceof Timestamp ? val.toDate() : new Date(val);
    return new Intl.DateTimeFormat("en-GB", {
      ...(timeZone ? { timeZone } : {}),
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "—";
  }
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  attended: "bg-blue-50 text-blue-700 ring-blue-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "attended" | "cancelled"
  >("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(
        query(
          collection(getFirebaseDb(), "appointments"),
          orderBy("slotStart", "desc")
        )
      );
      setBookings(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Booking, "id">),
        }))
      );
    } catch {
      setError("Failed to load bookings. Make sure Firebase is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function updateStatus(id: string, status: Booking["status"]) {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Update failed");
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = bookings.filter(
    (b) => filter === "all" || b.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-black/55">
            {bookings.length} total appointments
          </p>
        </div>
        <button
          onClick={refresh}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/5 w-fit">
        {(["all", "confirmed", "attended", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition",
              filter === f
                ? "bg-[var(--brand-dark)] text-white"
                : "text-black/60 hover:text-black",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-black/5"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
          <p className="text-sm text-black/45">No bookings found.</p>
          <p className="mt-2 text-xs text-black/30">
            Bookings appear here once Google Calendar is connected, Stripe is
            configured, and patients complete payment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-white p-5 ring-1 ring-black/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--brand-dark)]">
                      {b.patientName || "—"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 capitalize ${statusStyles[b.status] ?? statusStyles.confirmed}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-black/50">
                    {b.patientEmail} • {b.patientPhone}
                  </p>
                  {b.consultationTreatmentName?.trim() && (
                    <p className="mt-1 text-xs text-black/60">
                      <span className="font-semibold text-black/50">
                        Consultation:
                      </span>{" "}
                      {b.consultationTreatmentName}
                    </p>
                  )}
                  {b.patientNote?.trim() && (
                    <p className="mt-2 text-xs text-black/60">
                      <span className="font-semibold text-black/50">Note:</span>{" "}
                      {b.patientNote}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--brand-dark)]">
                    {formatDate(b.slotStart, CLINIC_TIMEZONE)}
                  </p>
                  <p className="text-xs text-black/40">
                    {CLINIC_TIMEZONE_LABEL}
                  </p>
                  <p className="text-xs text-black/40">
                    Booked {formatDate(b.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PatientContactActions
                  email={b.patientEmail}
                  phone={b.patientPhone}
                  name={b.patientName}
                  primaryEmailLabel="Email"
                  compact
                />
                {b.calendarHtmlLink && (
                  <a
                    href={b.calendarHtmlLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-dark)] hover:bg-black/[0.03]"
                  >
                    Open in Google Calendar
                  </a>
                )}
                {b.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => updateStatus(b.id, "attended")}
                      disabled={updatingId === b.id}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 disabled:opacity-50"
                    >
                      Mark attended
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "cancelled")}
                      disabled={updatingId === b.id}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {b.status !== "confirmed" && (
                  <button
                    onClick={() => updateStatus(b.id, "confirmed")}
                    disabled={updatingId === b.id}
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Restore to confirmed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
