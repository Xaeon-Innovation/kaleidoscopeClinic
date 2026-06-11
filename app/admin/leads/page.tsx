"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  sourcePage: string;
  kind?: "contact" | "enquiry";
  preferredContact: string;
  createdAt: string | Timestamp | null;
  contacted?: boolean;
};

function leadKind(lead: Lead): "contact" | "enquiry" {
  if (lead.kind === "contact" || lead.sourcePage === "/contact") return "contact";
  return "enquiry";
}

function leadKindLabel(kind: "contact" | "enquiry") {
  return kind === "contact" ? "Contact message" : "Enquiry";
}

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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "awaiting" | "replied">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(
        query(collection(getFirebaseDb(), "leads"), orderBy("createdAt", "desc"))
      );
      setLeads(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }))
      );
    } catch {
      setError("Failed to load leads. Make sure Firebase is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function markContacted(id: string, contacted: boolean) {
    setUpdatingId(id);
    setError(null);
    try {
      await updateDoc(doc(getFirebaseDb(), "leads", id), { contacted });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, contacted } : l))
      );
    } catch {
      setError("Failed to update reply status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      await deleteDoc(doc(getFirebaseDb(), "leads", id));
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete lead.");
    }
  }

  function exportCsv() {
    const header = "Name,Email,Phone,Message,Type,Source,Date,Reply status";
    const rows = leads.map((l) =>
      [
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.message?.replace(/"/g, '""')}"`,
        `"${leadKindLabel(leadKind(l))}"`,
        `"${l.sourcePage}"`,
        `"${formatDate(l.createdAt)}"`,
        l.contacted ? "Replied" : "Awaiting reply",
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads.filter((l) => {
    if (filter === "awaiting") return !l.contacted;
    if (filter === "replied") return !!l.contacted;
    return true;
  });

  const awaitingCount = leads.filter((l) => !l.contacted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Leads
          </h1>
          <p className="mt-1 text-sm text-black/55">
            {leads.length} total · {awaitingCount} awaiting reply
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

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/5 w-fit">
        {(
          [
            ["all", "All"],
            ["awaiting", "Awaiting reply"],
            ["replied", "Replied"],
          ] as const
        ).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm font-medium transition",
              filter === f
                ? "bg-[var(--brand-dark)] text-white"
                : "text-black/60 hover:text-black",
            ].join(" ")}
          >
            {label}
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
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-white ring-1 ring-black/5"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
          <p className="text-sm text-black/45">No leads found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const kind = leadKind(lead);
            const isUpdating = updatingId === lead.id;

            return (
              <div
                key={lead.id}
                className={[
                  "rounded-2xl bg-white ring-1 transition",
                  lead.contacted ? "ring-black/5" : "ring-[var(--gold)]/40",
                ].join(" ")}
              >
                <div
                  className="flex cursor-pointer flex-wrap items-center gap-4 px-5 py-4"
                  onClick={() =>
                    setExpanded(expanded === lead.id ? null : lead.id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-[var(--brand-dark)]">
                        {lead.name || "—"}
                      </span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          kind === "contact"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                            : "bg-black/[0.04] text-black/55 ring-1 ring-black/10",
                        ].join(" ")}
                      >
                        {leadKindLabel(kind)}
                      </span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          lead.contacted
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-[var(--gold)] text-[var(--brand-dark)]",
                        ].join(" ")}
                      >
                        {lead.contacted ? "Replied" : "Awaiting reply"}
                      </span>
                    </div>
                    <p className="truncate text-xs text-black/50">
                      {lead.email} • {lead.phone}
                    </p>
                    <p className="mt-1 truncate text-xs text-black/45">
                      {lead.message || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-black/40">
                        {formatDate(lead.createdAt)}
                      </p>
                      <p className="text-xs text-black/40 capitalize">
                        via {lead.preferredContact || "form"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={(e) => {
                        e.stopPropagation();
                        void markContacted(lead.id, !lead.contacted);
                      }}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-[var(--brand-dark)] hover:bg-black/[0.03] disabled:opacity-60"
                    >
                      {isUpdating
                        ? "Saving…"
                        : lead.contacted
                          ? "Mark awaiting reply"
                          : "Mark replied"}
                    </button>
                  </div>
                </div>

                {expanded === lead.id && (
                  <div className="border-t border-black/5 px-5 pb-5 pt-4">
                    <div className="rounded-xl bg-[#f8f8f7] p-4">
                      <p className="text-xs font-semibold text-black/50 mb-1">
                        Message
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--brand-dark)]">
                        {lead.message || "—"}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${lead.email}`}
                        className="rounded-xl bg-[var(--brand-dark)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        Email patient
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-black/[0.03]"
                      >
                        Call
                      </a>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => markContacted(lead.id, !lead.contacted)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-black/[0.03] disabled:opacity-60"
                      >
                        {lead.contacted
                          ? "Mark as awaiting reply"
                          : "Mark as replied / contacted"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLead(lead.id)}
                        className="ml-auto rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
