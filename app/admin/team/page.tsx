"use client";

import { useEffect, useState } from "react";
import { ImageUrlField } from "@/components/admin/ImageUrlField";
import {
  createDoc,
  deleteDocById,
  listDocs,
  updateDocById,
} from "@/components/admin/firestoreCrud";
import type { TeamDoc } from "@/lib/content/types";

type TeamItem = TeamDoc & { id: string };

const emptyDraft = {
  name: "",
  badge: "",
  titles: "",
  subtitle: "",
  bioShort: "",
  credentials: "",
  specialties: "",
  headshotUrl: "",
  ordering: "10",
};

function parseList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildPayload(draft: typeof emptyDraft): TeamDoc {
  const specialties = parseList(draft.specialties);
  return {
    name: draft.name.trim(),
    badge: draft.badge.trim() || undefined,
    titles: draft.titles.trim(),
    subtitle: draft.subtitle.trim() || undefined,
    bioShort: draft.bioShort.trim(),
    credentials: draft.credentials.trim(),
    specialties: specialties.length > 0 ? specialties : undefined,
    headshotUrl: draft.headshotUrl.trim() || undefined,
    ordering: Number(draft.ordering) || 10,
  };
}

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [savingHeadshotId, setSavingHeadshotId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocs<TeamDoc>("team", "ordering");
      setItems(data);
      return data;
    } catch {
      setError("Failed to load team.");
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function seedFromDefaults() {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team/seed", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Seed failed.");
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to import default team.");
    } finally {
      setImporting(false);
    }
  }

  async function onCreate() {
    setError(null);
    try {
      await createDoc<TeamDoc>("team", buildPayload(draft));
      setDraft(emptyDraft);
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to create team member."
      );
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this team profile?")) return;
    setError(null);
    try {
      await deleteDocById("team", id);
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to delete team member."
      );
    }
  }

  async function saveHeadshot(id: string, headshotUrl: string) {
    setSavingHeadshotId(id);
    setError(null);
    try {
      await updateDocById<TeamDoc>("team", id, {
        headshotUrl: headshotUrl.trim() || undefined,
      });
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                headshotUrl: headshotUrl.trim() || undefined,
              }
            : item
        )
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update headshot."
      );
    } finally {
      setSavingHeadshotId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Team
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Profiles shown on the home page and about page. Upload a headshot or
          paste an image link for each team member.
        </p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[var(--gold)] px-4 text-sm font-semibold text-[var(--ink-on-gold)] disabled:opacity-60"
          onClick={seedFromDefaults}
          disabled={importing}
        >
          {importing ? "Importing…" : "Import default profiles"}
        </button>
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
            <span className="text-xs font-semibold text-black/70">Badge</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.badge}
              onChange={(e) =>
                setDraft((d) => ({ ...d, badge: e.target.value }))
              }
              placeholder="Honorary Consultant"
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">Role</span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.titles}
              onChange={(e) =>
                setDraft((d) => ({ ...d, titles: e.target.value }))
              }
              placeholder="Specialist in Prosthodontics & Implants"
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Home page accent line (optional)
            </span>
            <input
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.subtitle}
              onChange={(e) =>
                setDraft((d) => ({ ...d, subtitle: e.target.value }))
              }
              placeholder="King's College London"
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
              Credentials (comma or line separated)
            </span>
            <textarea
              className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.credentials}
              onChange={(e) =>
                setDraft((d) => ({ ...d, credentials: e.target.value }))
              }
              placeholder="GDC Specialist, King's College London"
            />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-black/70">
              Specialties (comma or line separated)
            </span>
            <textarea
              className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
              value={draft.specialties}
              onChange={(e) =>
                setDraft((d) => ({ ...d, specialties: e.target.value }))
              }
              placeholder="Dental Implants, Full Arch Restoration"
            />
          </label>

          <ImageUrlField
            value={draft.headshotUrl}
            onChange={(headshotUrl) =>
              setDraft((d) => ({ ...d, headshotUrl }))
            }
          />

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
          disabled={!draft.name.trim() || !draft.titles.trim()}
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
          <p className="mt-4 text-sm text-black/65">
            No profiles yet. Import defaults or add one manually — the site
            shows built-in profiles until Firestore has entries.
          </p>
        ) : (
          <div className="mt-4 grid gap-4">
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
                    {m.badge && (
                      <div className="mt-1 text-xs font-medium text-black/70">
                        {m.badge}
                      </div>
                    )}
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
                {m.specialties && m.specialties.length > 0 && (
                  <p className="mt-2 text-xs text-black/55">
                    {m.specialties.join(" · ")}
                  </p>
                )}

                <div className="mt-4 border-t border-black/10 pt-4">
                  <ImageUrlField
                    label="Headshot"
                    value={m.headshotUrl ?? ""}
                    memberId={m.id}
                    deferUrlCommit
                    disabled={savingHeadshotId === m.id}
                    onChange={(headshotUrl) => {
                      void saveHeadshot(m.id, headshotUrl);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
