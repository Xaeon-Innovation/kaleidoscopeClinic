"use client";

import { useEffect, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";

type TestimonialDoc = {
  patientNameInitials: string;
  quote: string;
  ordering: number;
  published: boolean;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<(TestimonialDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    patientNameInitials: "",
    quote: "",
    ordering: "10",
    published: true,
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<TestimonialDoc>("testimonials", "ordering");
      setItems(data);
    } catch {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate() {
    setError(null);
    try {
      await createDoc<TestimonialDoc>("testimonials", {
        patientNameInitials: draft.patientNameInitials.trim(),
        quote: draft.quote.trim(),
        ordering: Number(draft.ordering) || 10,
        published: Boolean(draft.published),
      });
      setDraft({
        patientNameInitials: "",
        quote: "",
        ordering: "10",
        published: true,
      });
      await refresh();
    } catch {
      setError("Failed to create testimonial.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setError(null);
    try {
      await deleteDocById("testimonials", id);
      await refresh();
    } catch {
      setError("Failed to delete testimonial.");
    }
  }

  async function onTogglePublished(id: string, published: boolean) {
    setError(null);
    try {
      await updateDocById<TestimonialDoc>("testimonials", id, { published });
      await refresh();
    } catch {
      setError("Failed to update testimonial.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Testimonials
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Publish patient quotes used for trust and conversion.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">
          Add testimonial
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">
              Patient initials
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.patientNameInitials}
              onChange={(e) =>
                setDraft((d) => ({ ...d, patientNameInitials: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">Ordering</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.ordering}
              onChange={(e) =>
                setDraft((d) => ({ ...d, ordering: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">Quote</span>
            <textarea
              className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.quote}
              onChange={(e) =>
                setDraft((d) => ({ ...d, quote: e.target.value }))
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-black/70">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft((d) => ({ ...d, published: e.target.checked }))
              }
            />
            Published
          </label>
        </div>
        <button
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
          onClick={onCreate}
          disabled={!draft.quote.trim()}
        >
          Create
        </button>
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            Current testimonials
          </h2>
          <button
            className="rounded-full px-3 py-2 text-sm font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03]"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-black/65">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-black/65">No testimonials yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-black/10 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      {t.patientNameInitials || "Patient"}
                    </div>
                    <div className="text-xs text-black/60">
                      Ordering: {t.ordering ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-black/70">
                      <input
                        type="checkbox"
                        checked={Boolean(t.published)}
                        onChange={(e) =>
                          onTogglePublished(t.id, e.target.checked)
                        }
                      />
                      Published
                    </label>
                    <button
                      className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                      onClick={() => onDelete(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {t.quote && (
                  <p className="mt-3 text-sm leading-relaxed text-black/70">
                    “{t.quote}”
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

