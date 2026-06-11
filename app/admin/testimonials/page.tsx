"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";
import type { TestimonialDoc } from "@/lib/content/types";

type TestimonialItem = TestimonialDoc & { id: string };

const emptyDraft = {
  patientNameInitials: "",
  quote: "",
  treatment: "",
  ordering: "10",
  published: true,
};

function buildPayload(draft: typeof emptyDraft): TestimonialDoc {
  return {
    patientNameInitials: draft.patientNameInitials.trim(),
    quote: draft.quote.trim(),
    treatment: draft.treatment.trim() || undefined,
    ordering: Number(draft.ordering) || 10,
    published: Boolean(draft.published),
  };
}

function draftFromItem(item: TestimonialItem): typeof emptyDraft {
  return {
    patientNameInitials: item.patientNameInitials ?? "",
    quote: item.quote ?? "",
    treatment: item.treatment ?? "",
    ordering: String(item.ordering ?? 10),
    published: item.published !== false,
  };
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draft, setDraft] = useState(emptyDraft);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  const canCreate = useMemo(() => draft.quote.trim().length > 0, [draft.quote]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<TestimonialDoc>("testimonials", "ordering");
      setItems(data);
      return data;
    } catch {
      setError("Failed to load testimonials.");
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function seedFromDefaults() {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials/seed", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Seed failed.");
      }
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to import default testimonials."
      );
    } finally {
      setImporting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      setError(null);
      try {
        const data = await listDocs<TestimonialDoc>("testimonials", "ordering");
        if (cancelled) return;

        if (data.length === 0) {
          setImporting(true);
          const res = await fetch("/api/admin/testimonials/seed", {
            method: "POST",
          });
          if (!res.ok) {
            const errData = (await res.json()) as { error?: string };
            throw new Error(errData.error ?? "Seed failed.");
          }
          if (cancelled) return;
          const seeded = await listDocs<TestimonialDoc>("testimonials", "ordering");
          setItems(seeded);
        } else {
          setItems(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load testimonials."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setImporting(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCreate() {
    setError(null);
    try {
      await createDoc<TestimonialDoc>("testimonials", buildPayload(draft));
      setDraft(emptyDraft);
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
      if (editingId === id) setEditingId(null);
      await refresh();
    } catch {
      setError("Failed to delete testimonial.");
    }
  }

  function startEdit(item: TestimonialItem) {
    setEditingId(item.id);
    setEditDraft(draftFromItem(item));
  }

  async function onSaveEdit(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await updateDocById<TestimonialDoc>(
        "testimonials",
        id,
        buildPayload(editDraft)
      );
      setEditingId(null);
      await refresh();
    } catch {
      setError("Failed to save changes.");
    } finally {
      setBusyId(null);
    }
  }

  function renderFormFields(
    value: typeof emptyDraft,
    onChange: (next: typeof emptyDraft) => void,
    idPrefix: string
  ) {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">
            Patient name / initials
          </span>
          <input
            id={`${idPrefix}-name`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.patientNameInitials}
            onChange={(e) =>
              onChange({ ...value, patientNameInitials: e.target.value })
            }
            placeholder="Olivia T."
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">
            Treatment (optional)
          </span>
          <input
            id={`${idPrefix}-treatment`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.treatment}
            onChange={(e) =>
              onChange({ ...value, treatment: e.target.value })
            }
            placeholder="Crown Restoration"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">Ordering</span>
          <input
            id={`${idPrefix}-ordering`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.ordering}
            onChange={(e) =>
              onChange({ ...value, ordering: e.target.value })
            }
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm text-black/70">
          <input
            type="checkbox"
            checked={value.published}
            onChange={(e) =>
              onChange({ ...value, published: e.target.checked })
            }
          />
          Published on website
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-black/70">Quote</span>
          <textarea
            id={`${idPrefix}-quote`}
            className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
            value={value.quote}
            onChange={(e) => onChange({ ...value, quote: e.target.value })}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Testimonials
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Patient quotes shown in the home page trust section. Edit, add, or
          remove entries — changes appear on the website when published.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03] disabled:opacity-60"
          onClick={seedFromDefaults}
          disabled={importing}
        >
          {importing ? "Importing…" : "Import default testimonials"}
        </button>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">
          Add testimonial
        </h2>
        {renderFormFields(draft, setDraft, "create")}
        <button
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
          onClick={onCreate}
          disabled={!canCreate}
        >
          Create
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

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
          <p className="mt-4 text-sm text-black/65">
            {importing
              ? "Loading default testimonials from the website…"
              : "No testimonials yet."}
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((t) => {
              const isEditing = editingId === t.id;

              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-black/10 p-4"
                >
                  {isEditing ? (
                    <>
                      {renderFormFields(
                        editDraft,
                        setEditDraft,
                        `edit-${t.id}`
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--gold)] px-4 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
                          onClick={() => onSaveEdit(t.id)}
                          disabled={
                            busyId === t.id || !editDraft.quote.trim()
                          }
                        >
                          {busyId === t.id ? "Saving…" : "Save changes"}
                        </button>
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03]"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold tracking-tight">
                            {t.patientNameInitials || "Patient"}
                            {t.published === false && (
                              <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/50">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-black/60">
                            Ordering: {t.ordering ?? "-"}
                            {t.treatment ? ` · ${t.treatment}` : ""}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            className="rounded-full px-3 py-2 text-xs font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03]"
                            onClick={() => startEdit(t)}
                          >
                            Edit
                          </button>
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
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
