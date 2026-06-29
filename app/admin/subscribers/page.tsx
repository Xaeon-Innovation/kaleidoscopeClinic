"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  createdAt: string | Timestamp | null;
};

function formatDate(val: string | Timestamp | null): string {
  if (!val) return "—";
  try {
    const d = val instanceof Timestamp ? val.toDate() : new Date(val);
    return new Intl.DateTimeFormat("en-GB", {
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

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(
        query(
          collection(getFirebaseDb(), "subscribers"),
          orderBy("createdAt", "desc")
        )
      );
      setSubscribers(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Subscriber, "id">),
        }))
      );
    } catch {
      setError("Failed to load subscribers. Make sure Firebase is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function deleteSubscriber(id: string) {
    if (!confirm("Delete this subscriber permanently?")) return;
    try {
      await deleteDoc(doc(getFirebaseDb(), "subscribers", id));
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete subscriber.");
    }
  }

  function exportCsv() {
    const header = "Email,Source,Date";
    const rows = subscribers.map((s) =>
      [
        `"${s.email}"`,
        `"${s.source || "footer"}"`,
        `"${formatDate(s.createdAt)}"`,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Newsletter subscribers
          </h1>
          <p className="mt-1 text-sm text-black/55">
            {subscribers.length} total from website footer sign-ups
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
          >
            Refresh
          </button>
          <button
            onClick={exportCsv}
            className="rounded-xl bg-[var(--brand-dark)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--charcoal-2)]"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-white ring-1 ring-black/5"
            />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
          <p className="text-sm text-black/45">No subscribers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[var(--brand-dark)]">
                  {subscriber.email}
                </p>
                <p className="text-xs text-black/45">
                  {formatDate(subscriber.createdAt)} · via{" "}
                  {subscriber.source || "footer"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${subscriber.email}`}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-[var(--brand-dark)] hover:bg-black/[0.03]"
                >
                  Email
                </a>
                <button
                  type="button"
                  onClick={() => deleteSubscriber(subscriber.id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
