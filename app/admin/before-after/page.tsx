"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";
import { uploadPublicFile } from "@/components/admin/storageUpload";

type CaseDoc = {
  title: string;
  treatmentType: string;
  labels: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  ordering: number;
  published: boolean;
};

function parseLabels(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // ignore
  }
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminBeforeAfterPage() {
  const [items, setItems] = useState<(CaseDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    title: "",
    treatmentType: "",
    labels: "[]",
    ordering: "10",
    published: true,
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<CaseDoc>("cases", "ordering");
      setItems(data);
    } catch {
      setError("Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const canCreate = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  async function onCreate() {
    setError(null);
    try {
      await createDoc<CaseDoc>("cases", {
        title: draft.title.trim(),
        treatmentType: draft.treatmentType.trim(),
        labels: parseLabels(draft.labels),
        ordering: Number(draft.ordering) || 10,
        published: Boolean(draft.published),
      });
      setDraft({
        title: "",
        treatmentType: "",
        labels: "[]",
        ordering: "10",
        published: true,
      });
      await refresh();
    } catch {
      setError("Failed to create case.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this case?")) return;
    setError(null);
    try {
      await deleteDocById("cases", id);
      await refresh();
    } catch {
      setError("Failed to delete case.");
    }
  }

  async function onTogglePublished(id: string, published: boolean) {
    setError(null);
    try {
      await updateDocById<CaseDoc>("cases", id, { published });
      await refresh();
    } catch {
      setError("Failed to update case.");
    }
  }

  async function onUpload(id: string, which: "before" | "after", file: File) {
    setBusyId(id);
    setError(null);
    try {
      const ext = file.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
      const url = await uploadPublicFile(
        file,
        `public/cases/${id}/${which}.${ext}`
      );
      await updateDocById<CaseDoc>("cases", id, {
        ...(which === "before" ? { beforeImageUrl: url } : { afterImageUrl: url }),
      });
      await refresh();
    } catch {
      setError("Upload failed. Check Storage rules and try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Before &amp; After
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Upload clinical cases with consistent lighting/framing and clear
          labels.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">Add case</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">Title</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">
              Treatment type
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.treatmentType}
              onChange={(e) =>
                setDraft((d) => ({ ...d, treatmentType: e.target.value }))
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
            <span className="text-xs font-semibold text-black/70">
              Labels (JSON array or comma-separated)
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.labels}
              onChange={(e) => setDraft((d) => ({ ...d, labels: e.target.value }))}
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
          disabled={!canCreate}
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
          <h2 className="text-base font-semibold tracking-tight">Cases</h2>
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
          <p className="mt-4 text-sm text-black/65">No cases yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((c) => (
              <div key={c.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      {c.title}
                    </div>
                    <div className="mt-1 text-xs text-black/60">
                      {c.treatmentType || "—"} • Ordering: {c.ordering ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-black/70">
                      <input
                        type="checkbox"
                        checked={Boolean(c.published)}
                        onChange={(e) =>
                          onTogglePublished(c.id, e.target.checked)
                        }
                      />
                      Published
                    </label>
                    <button
                      className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                      onClick={() => onDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-black/[0.03] p-3">
                    <div className="text-xs font-semibold text-black/70">
                      Before image
                    </div>
                    {c.beforeImageUrl ? (
                      <a
                        href={c.beforeImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-xs text-[var(--brand-dark)] underline"
                      >
                        View uploaded
                      </a>
                    ) : (
                      <div className="mt-1 text-xs text-black/60">
                        Not uploaded
                      </div>
                    )}
                    <input
                      className="mt-3 block w-full text-xs"
                      type="file"
                      accept="image/*"
                      aria-label="Upload before image"
                      disabled={busyId === c.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(c.id, "before", file);
                      }}
                    />
                  </div>

                  <div className="rounded-2xl bg-black/[0.03] p-3">
                    <div className="text-xs font-semibold text-black/70">
                      After image
                    </div>
                    {c.afterImageUrl ? (
                      <a
                        href={c.afterImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-xs text-[var(--brand-dark)] underline"
                      >
                        View uploaded
                      </a>
                    ) : (
                      <div className="mt-1 text-xs text-black/60">
                        Not uploaded
                      </div>
                    )}
                    <input
                      className="mt-3 block w-full text-xs"
                      type="file"
                      accept="image/*"
                      aria-label="Upload after image"
                      disabled={busyId === c.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(c.id, "after", file);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

