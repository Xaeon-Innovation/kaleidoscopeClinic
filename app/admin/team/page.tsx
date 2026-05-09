"use client";

import { useEffect, useState } from "react";
import {
  createDoc,
  deleteDocById,
  listDocs,
} from "@/components/admin/firestoreCrud";

type TeamDoc = {
  name: string;
  titles: string;
  bioShort: string;
  credentials: string;
  headshotUrl?: string;
  ordering: number;
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<(TeamDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    name: "",
    titles: "",
    bioShort: "",
    credentials: "",
    headshotUrl: "",
    ordering: "10",
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<TeamDoc>("team", "ordering");
      setItems(data);
    } catch {
      setError("Failed to load team.");
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
      await createDoc<TeamDoc>("team", {
        name: draft.name.trim(),
        titles: draft.titles.trim(),
        bioShort: draft.bioShort.trim(),
        credentials: draft.credentials.trim(),
        headshotUrl: draft.headshotUrl.trim() || undefined,
        ordering: Number(draft.ordering) || 10,
      });
      setDraft({
        name: "",
        titles: "",
        bioShort: "",
        credentials: "",
        headshotUrl: "",
        ordering: "10",
      });
      await refresh();
    } catch {
      setError("Failed to create team member.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this team profile?")) return;
    setError(null);
    try {
      await deleteDocById("team", id);
      await refresh();
    } catch {
      setError("Failed to delete team member.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Team
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Add and update clinician profiles. More visiting specialists can be
          added later.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h2 className="text-base font-semibold tracking-tight">Add profile</h2>
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
            <span className="text-xs font-semibold text-black/70">Titles</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.titles}
              onChange={(e) =>
                setDraft((d) => ({ ...d, titles: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Bio (short)
            </span>
            <textarea
              className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.bioShort}
              onChange={(e) =>
                setDraft((d) => ({ ...d, bioShort: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Credentials
            </span>
            <textarea
              className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.credentials}
              onChange={(e) =>
                setDraft((d) => ({ ...d, credentials: e.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Headshot URL (optional)
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.headshotUrl}
              onChange={(e) =>
                setDraft((d) => ({ ...d, headshotUrl: e.target.value }))
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
        </div>
        <button
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
          onClick={onCreate}
          disabled={!draft.name.trim()}
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
            Current profiles
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
          <p className="mt-4 text-sm text-black/65">No profiles yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-black/10 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      {m.name}
                    </div>
                    <div className="mt-1 text-xs text-black/60">{m.titles}</div>
                  </div>
                  <button
                    className="rounded-full px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                    onClick={() => onDelete(m.id)}
                  >
                    Delete
                  </button>
                </div>
                {m.bioShort && (
                  <p className="mt-3 text-sm text-black/65">{m.bioShort}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

