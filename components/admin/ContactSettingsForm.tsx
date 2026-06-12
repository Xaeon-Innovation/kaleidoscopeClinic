"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactSettings } from "@/lib/site/contactSettingsTypes";

const socialFields = [
  { key: "facebookUrl" as const, label: "Facebook", placeholder: "https://facebook.com/…" },
  { key: "instagramUrl" as const, label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "xUrl" as const, label: "X (Twitter)", placeholder: "https://x.com/…" },
  { key: "youtubeUrl" as const, label: "YouTube", placeholder: "https://youtube.com/…" },
];

export function ContactSettingsForm() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/contact/settings");
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { settings: ContactSettings };
      setSettings(data.settings);
    } catch {
      setError("Could not load contact details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateField<K extends keyof ContactSettings>(
    key: K,
    value: ContactSettings[K]
  ) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contact/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as {
        settings?: ContactSettings;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSettings(data.settings ?? settings);
      setMessage("Contact details saved. The footer updates immediately.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-black/45">
        Contact &amp; social
      </h2>
      <p className="mt-2 text-sm text-black/60">
        Shown in the site footer. Leave a field blank to hide it on the public
        site.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-black/50">Loading…</p>
      ) : settings ? (
        <form onSubmit={save} className="mt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--brand-dark)]">Phone</span>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="07745 325295"
                className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-[var(--brand-dark)]">Email</span>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@example.com"
                className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-[var(--brand-dark)]">
                WhatsApp number
              </span>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="447745325295"
                className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
              <span className="text-xs text-black/50">
                Digits only, with country code (no +). Used for the WhatsApp
                link in the footer.
              </span>
            </label>
          </div>

          <div className="border-t border-black/8 pt-5">
            <p className="text-sm font-medium text-[var(--brand-dark)]">
              Social profiles
            </p>
            <p className="mt-1 text-xs text-black/50">
              Icons appear in the footer only when a full URL is saved.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {socialFields.map(({ key, label, placeholder }) => (
                <label key={key} className="block space-y-1.5 text-sm">
                  <span className="font-medium text-[var(--brand-dark)]">
                    {label}
                  </span>
                  <input
                    type="url"
                    value={settings[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
                  />
                </label>
              ))}
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}
          {message ? (
            <p className="text-sm text-emerald-700">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save contact details"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
