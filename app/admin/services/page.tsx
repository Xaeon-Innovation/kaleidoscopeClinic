"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";

type ServiceDoc = {
  name: string;
  slug: string;
  shortBenefits: string[];
  educationalCopy: string;
  priority: number;
  heroFlag: boolean;
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

export default function AdminServicesPage() {
  const [items, setItems] = useState<(ServiceDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    shortBenefits: "[]",
    educationalCopy: "",
    priority: "10",
    heroFlag: false,
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<ServiceDoc>("services", "priority");
      setItems(data);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const canCreate = useMemo(() => draft.name.trim().length > 0, [draft.name]);

  async function onCreate() {
    setError(null);
    try {
      await createDoc<ServiceDoc>("services", {
        name: draft.name.trim(),
        slug:
          draft.slug.trim() ||
          draft.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        shortBenefits: safeJsonArray(draft.shortBenefits),
        educationalCopy: draft.educationalCopy.trim(),
        priority: Number(draft.priority) || 10,
        heroFlag: Boolean(draft.heroFlag),
      });
      setDraft({
        name: "",
        slug: "",
        shortBenefits: "[]",
        educationalCopy: "",
        priority: "10",
        heroFlag: false,
      });
      await refresh();
    } catch {
      setError("Failed to create service.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    setError(null);
    try {
      await deleteDocById("services", id);
      await refresh();
    } catch {
      setError("Failed to delete service.");
    }
  }

  async function onToggleHero(id: string, heroFlag: boolean) {
    setError(null);
    try {
      await updateDocById<ServiceDoc>("services", id, { heroFlag });
      await refresh();
    } catch {
      setError("Failed to update service.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Services
        </h1>
        <p className="mt-2 text-sm text-black/65">
          These drive the treatments page and homepage cards.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">Add service</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">Name</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">Slug</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Short benefits (JSON array or one per line)
            </span>
            <textarea
              className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.shortBenefits}
              onChange={(e) =>
                setDraft((d) => ({ ...d, shortBenefits: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Educational copy (short)
            </span>
            <textarea
              className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.educationalCopy}
              onChange={(e) =>
                setDraft((d) => ({ ...d, educationalCopy: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">
              Priority (lower = earlier)
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.priority}
              onChange={(e) =>
                setDraft((d) => ({ ...d, priority: e.target.value }))
              }
            />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm text-black/70">
            <input
              type="checkbox"
              checked={draft.heroFlag}
              onChange={(e) =>
                setDraft((d) => ({ ...d, heroFlag: e.target.checked }))
              }
            />
            Highlight on homepage
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
          <h2 className="text-base font-semibold tracking-tight">
            Current services
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
          <p className="mt-4 text-sm text-black/65">No services yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-black/10 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      {s.name}
                    </div>
                    <div className="text-xs text-black/60">/{s.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-black/70">
                      <input
                        type="checkbox"
                        checked={Boolean(s.heroFlag)}
                        onChange={(e) =>
                          onToggleHero(s.id, e.target.checked)
                        }
                      />
                      Homepage
                    </label>
                    <button
                      className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                      onClick={() => onDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {Array.isArray(s.shortBenefits) && s.shortBenefits.length > 0 && (
                  <ul className="mt-3 grid gap-1 text-sm text-black/65">
                    {s.shortBenefits.slice(0, 4).map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

