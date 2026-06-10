"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";
import type { ServiceCategory, ServiceDoc } from "@/lib/content/types";
import { treatmentImages } from "@/lib/treatments";

type ServiceItem = ServiceDoc & { id: string };

const categories: { value: ServiceCategory; label: string }[] = [
  { value: "implants", label: "Implants" },
  { value: "restorative", label: "Restorative" },
  { value: "aesthetic", label: "Aesthetic" },
  { value: "preventive", label: "Preventive" },
];

const emptyDraft = {
  name: "",
  slug: "",
  subtitle: "",
  shortBenefits: "",
  category: "preventive" as ServiceCategory,
  imageUrl: "",
  priority: "10",
  heroFlag: false,
  flagship: false,
  published: true,
};

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // ignore
  }
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function benefitsToInput(benefits: string[]): string {
  return benefits.length > 0 ? benefits.join("\n") : "";
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildPayload(draft: typeof emptyDraft): ServiceDoc {
  return {
    name: draft.name.trim(),
    slug: draft.slug.trim() || slugify(draft.name),
    subtitle: draft.subtitle.trim(),
    shortBenefits: safeJsonArray(draft.shortBenefits),
    category: draft.category,
    imageUrl: draft.imageUrl.trim() || undefined,
    priority: Number(draft.priority) || 10,
    heroFlag: Boolean(draft.heroFlag),
    flagship: Boolean(draft.flagship),
    published: Boolean(draft.published),
  };
}

function draftFromItem(item: ServiceItem): typeof emptyDraft {
  return {
    name: item.name,
    slug: item.slug,
    subtitle: item.subtitle?.trim() || item.educationalCopy?.trim() || "",
    shortBenefits: benefitsToInput(item.shortBenefits ?? []),
    category: item.category ?? "preventive",
    imageUrl: item.imageUrl ?? treatmentImages[item.slug] ?? "",
    priority: String(item.priority ?? 10),
    heroFlag: Boolean(item.heroFlag),
    flagship: Boolean(item.flagship),
    published: item.published !== false,
  };
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const [draft, setDraft] = useState(emptyDraft);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<ServiceDoc>("services", "priority");
      setItems(data);
      return data;
    } catch {
      setError("Failed to load treatments.");
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function seedFromDefaults(mode: "empty" | "missing" = "missing") {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Seed failed.");
      }
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to import default treatments."
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
        const data = await listDocs<ServiceDoc>("services", "priority");
        if (cancelled) return;

        if (data.length === 0) {
          setImporting(true);
          const res = await fetch("/api/admin/services/seed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "empty" }),
          });
          if (!res.ok) {
            const errData = (await res.json()) as { error?: string };
            throw new Error(errData.error ?? "Seed failed.");
          }
          if (cancelled) return;
          const seeded = await listDocs<ServiceDoc>("services", "priority");
          setItems(seeded);
        } else {
          setItems(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load treatments."
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

  const canCreate = useMemo(() => draft.name.trim().length > 0, [draft.name]);

  async function onCreate() {
    setError(null);
    try {
      await createDoc<ServiceDoc>("services", buildPayload(draft));
      setDraft(emptyDraft);
      await refresh();
    } catch {
      setError("Failed to create treatment.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this treatment?")) return;
    setError(null);
    try {
      await deleteDocById("services", id);
      if (editingId === id) setEditingId(null);
      await refresh();
    } catch {
      setError("Failed to delete treatment.");
    }
  }

  async function onImportDefaults() {
    if (
      items.length > 0 &&
      !confirm(
        "Import any missing default treatments? Existing entries will stay — duplicates are skipped by slug."
      )
    ) {
      return;
    }
    await seedFromDefaults("missing");
  }

  function startEdit(item: ServiceItem) {
    setEditingId(item.id);
    setEditDraft(draftFromItem(item));
  }

  async function onSaveEdit(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await updateDocById<ServiceDoc>("services", id, buildPayload(editDraft));
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
          <span className="text-xs font-semibold text-black/70">Name</span>
          <input
            id={`${idPrefix}-name`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">Slug</span>
          <input
            id={`${idPrefix}-slug`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.slug}
            onChange={(e) => onChange({ ...value, slug: e.target.value })}
            placeholder="auto-generated from name"
          />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-black/70">Subtitle</span>
          <textarea
            id={`${idPrefix}-subtitle`}
            className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
            value={value.subtitle}
            onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">Category</span>
          <select
            id={`${idPrefix}-category`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.category}
            onChange={(e) =>
              onChange({
                ...value,
                category: e.target.value as ServiceCategory,
              })
            }
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-black/70">
            Priority (lower = earlier)
          </span>
          <input
            id={`${idPrefix}-priority`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.priority}
            onChange={(e) => onChange({ ...value, priority: e.target.value })}
          />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-black/70">
            Benefits (one per line)
          </span>
          <textarea
            id={`${idPrefix}-benefits`}
            className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
            value={value.shortBenefits}
            onChange={(e) =>
              onChange({ ...value, shortBenefits: e.target.value })
            }
          />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-black/70">
            Image URL (optional)
          </span>
          <input
            id={`${idPrefix}-image`}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
            value={value.imageUrl}
            onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
            placeholder="/images/treatments/example.jpg"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={value.published}
            onChange={(e) =>
              onChange({ ...value, published: e.target.checked })
            }
          />
          Published on website
        </label>
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={value.heroFlag}
            onChange={(e) =>
              onChange({ ...value, heroFlag: e.target.checked })
            }
          />
          Highlight on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-black/70 md:col-span-2">
          <input
            type="checkbox"
            checked={value.flagship}
            onChange={(e) =>
              onChange({ ...value, flagship: e.target.checked })
            }
          />
          Flagship treatment (large hero card on treatments page)
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Treatments
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Manage treatments shown on the treatments page, booking flow, and
          homepage highlights.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03] disabled:opacity-60"
          onClick={onImportDefaults}
          disabled={importing}
        >
          {importing ? "Importing…" : "Import default treatments"}
        </button>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">
          Add treatment
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
            Current treatments
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
              ? "Loading default treatments from the website…"
              : "No treatments yet."}
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((item) => {
              const isEditing = editingId === item.id;
              const categoryLabel =
                categories.find((c) => c.value === item.category)?.label ??
                "Uncategorised";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/10 p-4"
                >
                  {isEditing ? (
                    <>
                      {renderFormFields(editDraft, setEditDraft, `edit-${item.id}`)}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--gold)] px-4 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
                          onClick={() => onSaveEdit(item.id)}
                          disabled={busyId === item.id || !editDraft.name.trim()}
                        >
                          {busyId === item.id ? "Saving…" : "Save changes"}
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
                            {item.name}
                            {item.published === false && (
                              <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/50">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-black/60">
                            /{item.slug} · {categoryLabel} · Priority{" "}
                            {item.priority ?? "-"}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {item.flagship && (
                            <span className="rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-dark)]">
                              Flagship
                            </span>
                          )}
                          {item.heroFlag && (
                            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black/55">
                              Homepage
                            </span>
                          )}
                          <button
                            className="rounded-full px-3 py-2 text-xs font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03]"
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                            onClick={() => onDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {(item.subtitle || item.educationalCopy) && (
                        <p className="mt-3 text-sm text-black/70">
                          {item.subtitle || item.educationalCopy}
                        </p>
                      )}
                      {Array.isArray(item.shortBenefits) &&
                        item.shortBenefits.length > 0 && (
                          <ul className="mt-3 grid gap-1 text-sm text-black/65">
                            {item.shortBenefits.slice(0, 4).map((benefit) => (
                              <li key={benefit}>• {benefit}</li>
                            ))}
                          </ul>
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
