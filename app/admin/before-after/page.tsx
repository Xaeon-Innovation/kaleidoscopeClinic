"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  prepareImageForUpload,
  uploadCaseImage,
} from "@/lib/admin/uploadAdminImage";

type CaseDoc = {
  title: string;
  treatmentType: string;
  labels: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  ordering: number;
  published: boolean;
};

type CaseItem = CaseDoc & { id: string };

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

function labelsToInput(labels: string[]): string {
  return labels.length > 0 ? labels.join(", ") : "";
}

async function readApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`;
}

async function fetchCases(): Promise<CaseItem[]> {
  const res = await fetch("/api/admin/cases");
  if (!res.ok) throw new Error(await readApiError(res));
  const data = (await res.json()) as { cases: CaseItem[] };
  return data.cases;
}

async function createCaseApi(payload: Omit<CaseDoc, "beforeImageUrl" | "afterImageUrl">) {
  const res = await fetch("/api/admin/cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readApiError(res));
  return (await res.json()) as { id: string };
}

async function updateCaseApi(
  id: string,
  payload: Partial<CaseDoc> & {
    beforeImageUrl?: string | null;
    afterImageUrl?: string | null;
  }
) {
  const res = await fetch(`/api/admin/cases/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readApiError(res));
}

async function deleteCaseApi(id: string) {
  const res = await fetch(`/api/admin/cases/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readApiError(res));
}

async function uploadCaseImageApi(
  id: string,
  which: "before" | "after",
  file: File
) {
  await uploadCaseImage(id, which, file);
}

async function removeCaseImageApi(id: string, which: "before" | "after") {
  const res = await fetch(
    `/api/admin/cases/${id}/images?which=${which}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(await readApiError(res));
}

function CaseImageSlot({
  label,
  imageUrl,
  busy,
  inputKey,
  onUpload,
  onRemove,
}: {
  label: string;
  imageUrl?: string;
  busy: boolean;
  inputKey: number;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl bg-black/[0.03] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-black/70">{label}</div>
        {imageUrl ? (
          <button
            type="button"
            className="rounded-full px-2 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
            onClick={onRemove}
            disabled={busy}
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="mt-2 overflow-hidden rounded-xl bg-black/5 ring-1 ring-black/10">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-xs text-black/45">
            No image yet
          </div>
        )}
      </div>

      <input
        key={inputKey}
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        aria-label={`Upload ${label.toLowerCase()}`}
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
      <button
        type="button"
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-white text-xs font-semibold text-black/80 ring-1 ring-black/10 hover:bg-black/[0.03] disabled:opacity-60"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
      </button>
    </div>
  );
}

export default function AdminBeforeAfterPage() {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadKeys, setUploadKeys] = useState<Record<string, number>>({});

  const [draft, setDraft] = useState({
    title: "",
    treatmentType: "",
    labels: "",
    ordering: "10",
    published: true,
  });
  const [draftBefore, setDraftBefore] = useState<File | null>(null);
  const [draftAfter, setDraftAfter] = useState<File | null>(null);
  const [draftBeforePreview, setDraftBeforePreview] = useState<string | null>(
    null
  );
  const [draftAfterPreview, setDraftAfterPreview] = useState<string | null>(
    null
  );

  const [editDraft, setEditDraft] = useState({
    title: "",
    treatmentType: "",
    labels: "",
    ordering: "10",
    published: true,
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchCases());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!draftBefore) {
      setDraftBeforePreview(null);
      return;
    }
    const url = URL.createObjectURL(draftBefore);
    setDraftBeforePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [draftBefore]);

  useEffect(() => {
    if (!draftAfter) {
      setDraftAfterPreview(null);
      return;
    }
    const url = URL.createObjectURL(draftAfter);
    setDraftAfterPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [draftAfter]);

  const canCreate = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  function bumpUploadKey(id: string) {
    setUploadKeys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  async function onCreate() {
    setCreating(true);
    setCreateStatus("Saving case…");
    setError(null);
    try {
      const { id } = await createCaseApi({
        title: draft.title.trim(),
        treatmentType: draft.treatmentType.trim(),
        labels: parseLabels(draft.labels),
        ordering: Number(draft.ordering) || 10,
        published: Boolean(draft.published),
      });

      if (draftBefore) {
        setCreateStatus("Uploading before photo…");
        await uploadCaseImageApi(id, "before", draftBefore);
      }
      if (draftAfter) {
        setCreateStatus("Uploading after photo…");
        await uploadCaseImageApi(id, "after", draftAfter);
      }

      setDraft({
        title: "",
        treatmentType: "",
        labels: "",
        ordering: "10",
        published: true,
      });
      setDraftBefore(null);
      setDraftAfter(null);
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to create case. Check your connection and try again."
      );
    } finally {
      setCreating(false);
      setCreateStatus(null);
    }
  }

  async function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title || "this case"}"? This cannot be undone.`)) {
      return;
    }
    setError(null);
    try {
      await deleteCaseApi(id);
      if (editingId === id) setEditingId(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete case.");
    }
  }

  async function onTogglePublished(id: string, published: boolean) {
    setError(null);
    try {
      await updateCaseApi(id, { published });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update case.");
    }
  }

  async function onUpload(id: string, which: "before" | "after", file: File) {
    setBusyId(id);
    setError(null);
    try {
      await uploadCaseImageApi(id, which, file);
      bumpUploadKey(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function onRemoveImage(id: string, which: "before" | "after") {
    if (!confirm(`Remove the ${which} image?`)) return;
    setBusyId(id);
    setError(null);
    try {
      await removeCaseImageApi(id, which);
      bumpUploadKey(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove image.");
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(item: CaseItem) {
    setEditingId(item.id);
    setEditDraft({
      title: item.title,
      treatmentType: item.treatmentType,
      labels: labelsToInput(item.labels ?? []),
      ordering: String(item.ordering ?? 10),
      published: Boolean(item.published),
    });
  }

  async function onSaveEdit(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await updateCaseApi(id, {
        title: editDraft.title.trim(),
        treatmentType: editDraft.treatmentType.trim(),
        labels: parseLabels(editDraft.labels),
        ordering: Number(editDraft.ordering) || 10,
        published: Boolean(editDraft.published),
      });
      setEditingId(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes.");
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
          Add clinical cases with before and after photos. Published cases appear
          on the homepage carousel.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">Add new case</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">Title</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Smile makeover — upper arch"
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
              placeholder="e.g. Veneers"
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
              Labels (comma-separated)
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.labels}
              onChange={(e) => setDraft((d) => ({ ...d, labels: e.target.value }))}
              placeholder="e.g. veneers, whitening"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-black/70 md:col-span-2">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft((d) => ({ ...d, published: e.target.checked }))
              }
            />
            Published on website
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 rounded-2xl border border-dashed border-black/15 p-4">
            <span className="text-xs font-semibold text-black/70">
              Before photo (optional)
            </span>
            {draftBeforePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draftBeforePreview}
                alt="Before preview"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-black/[0.03] text-xs text-black/45">
                Choose a before image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setDraftBefore(null);
                  return;
                }
                void prepareImageForUpload(file)
                  .then(setDraftBefore)
                  .catch((err) => {
                    setDraftBefore(null);
                    setError(
                      err instanceof Error ? err.message : "Could not process image."
                    );
                  });
              }}
            />
          </label>

          <label className="grid gap-2 rounded-2xl border border-dashed border-black/15 p-4">
            <span className="text-xs font-semibold text-black/70">
              After photo (optional)
            </span>
            {draftAfterPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draftAfterPreview}
                alt="After preview"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-black/[0.03] text-xs text-black/45">
                Choose an after image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setDraftAfter(null);
                  return;
                }
                void prepareImageForUpload(file)
                  .then(setDraftAfter)
                  .catch((err) => {
                    setDraftAfter(null);
                    setError(
                      err instanceof Error ? err.message : "Could not process image."
                    );
                  });
              }}
            />
          </label>
        </div>

        <button
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
          onClick={onCreate}
          disabled={!canCreate || creating}
        >
          {creating ? createStatus ?? "Creating…" : "Create case"}
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
            Existing cases ({items.length})
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
            No cases yet. Create one above to get started.
          </p>
        ) : (
          <div className="mt-4 grid gap-4">
            {items.map((c) => {
              const isEditing = editingId === c.id;
              const isBusy = busyId === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-black/10 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold tracking-tight">
                        {c.title || "Untitled case"}
                      </div>
                      <div className="mt-1 text-xs text-black/60">
                        {c.treatmentType || "No treatment type"} • Order:{" "}
                        {c.ordering ?? "—"}
                        {c.labels?.length ? ` • ${c.labels.join(", ")}` : ""}
                      </div>
                      <div className="mt-1 text-xs text-black/50">
                        {c.beforeImageUrl && c.afterImageUrl
                          ? "Both images uploaded"
                          : c.beforeImageUrl
                            ? "Before only"
                            : c.afterImageUrl
                              ? "After only"
                              : "No images yet"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-black/70">
                        <input
                          type="checkbox"
                          checked={Boolean(c.published)}
                          onChange={(e) =>
                            onTogglePublished(c.id, e.target.checked)
                          }
                          disabled={isBusy}
                        />
                        Published
                      </label>
                      <button
                        type="button"
                        className="rounded-full px-3 py-2 text-xs font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03] disabled:opacity-60"
                        onClick={() =>
                          isEditing ? setEditingId(null) : startEdit(c)
                        }
                        disabled={isBusy}
                      >
                        {isEditing ? "Cancel" : "Edit details"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
                        onClick={() => onDelete(c.id, c.title)}
                        disabled={isBusy}
                      >
                        Delete case
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-4 grid gap-3 rounded-2xl bg-black/[0.02] p-4 md:grid-cols-2">
                      <label className="grid gap-1 md:col-span-2">
                        <span className="text-xs font-semibold text-black/70">
                          Title
                        </span>
                        <input
                          className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--gold)]"
                          value={editDraft.title}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, title: e.target.value }))
                          }
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-black/70">
                          Treatment type
                        </span>
                        <input
                          className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--gold)]"
                          value={editDraft.treatmentType}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              treatmentType: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-black/70">
                          Ordering
                        </span>
                        <input
                          className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--gold)]"
                          value={editDraft.ordering}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              ordering: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="grid gap-1 md:col-span-2">
                        <span className="text-xs font-semibold text-black/70">
                          Labels
                        </span>
                        <input
                          className="h-10 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[var(--gold)]"
                          value={editDraft.labels}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, labels: e.target.value }))
                          }
                        />
                      </label>
                      <label className="flex items-center gap-2 text-sm text-black/70 md:col-span-2">
                        <input
                          type="checkbox"
                          checked={editDraft.published}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              published: e.target.checked,
                            }))
                          }
                        />
                        Published on website
                      </label>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--gold)] px-4 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60 md:col-span-2"
                        onClick={() => onSaveEdit(c.id)}
                        disabled={isBusy || !editDraft.title.trim()}
                      >
                        {isBusy ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  ) : null}

                  {c.beforeImageUrl && c.afterImageUrl ? (
                    <div className="mt-4 max-w-md">
                      <div className="mb-2 text-xs font-semibold text-black/60">
                        Preview (as shown on site)
                      </div>
                      <BeforeAfterSlider
                        beforeSrc={c.beforeImageUrl}
                        afterSrc={c.afterImageUrl}
                        altBase={c.title || "Case"}
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <CaseImageSlot
                      label="Before"
                      imageUrl={c.beforeImageUrl}
                      busy={isBusy}
                      inputKey={uploadKeys[c.id] ?? 0}
                      onUpload={(file) => onUpload(c.id, "before", file)}
                      onRemove={() => onRemoveImage(c.id, "before")}
                    />
                    <CaseImageSlot
                      label="After"
                      imageUrl={c.afterImageUrl}
                      busy={isBusy}
                      inputKey={(uploadKeys[c.id] ?? 0) + 1}
                      onUpload={(file) => onUpload(c.id, "after", file)}
                      onRemove={() => onRemoveImage(c.id, "after")}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
