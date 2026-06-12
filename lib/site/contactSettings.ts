import "server-only";

import { CLINIC } from "@/components/siteLinks";
import { getAdminDb } from "@/lib/firebase/admin";
import type {
  ContactSettings,
  PublicContactSettings,
} from "@/lib/site/contactSettingsTypes";

export type { ContactSettings, PublicContactSettings } from "@/lib/site/contactSettingsTypes";

export const CONTACT_SETTINGS_DOC = "contact";

function trimField(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function trimUrl(value: unknown): string {
  const trimmed = trimField(value, 500);
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
}

function trimWhatsapp(value: unknown): string {
  const digits = trimField(value, 30).replace(/\D/g, "");
  return digits.slice(0, 15);
}

export function defaultContactSettings(): ContactSettings {
  return {
    phone: CLINIC.phoneDisplay,
    email: CLINIC.email,
    whatsapp: CLINIC.whatsappNumberE164NoPlus,
    facebookUrl: "",
    instagramUrl: "",
    xUrl: "",
    youtubeUrl: "",
  };
}

export function normalizeContactSettings(
  input: Partial<ContactSettings> | null | undefined
): ContactSettings {
  const base = defaultContactSettings();
  if (!input) return base;

  return {
    phone: trimField(input.phone, 40),
    email: trimField(input.email, 254),
    whatsapp: trimWhatsapp(input.whatsapp),
    facebookUrl: trimUrl(input.facebookUrl),
    instagramUrl: trimUrl(input.instagramUrl),
    xUrl: trimUrl(input.xUrl),
    youtubeUrl: trimUrl(input.youtubeUrl),
    updatedAt: input.updatedAt,
  };
}

export function toPublicContactSettings(
  settings: ContactSettings
): PublicContactSettings {
  return {
    phone: settings.phone || null,
    email: settings.email || null,
    whatsapp: settings.whatsapp || null,
    social: {
      facebook: settings.facebookUrl || null,
      instagram: settings.instagramUrl || null,
      x: settings.xUrl || null,
      youtube: settings.youtubeUrl || null,
    },
  };
}

let cache: { settings: ContactSettings; at: number } | null = null;
const CACHE_MS = 30_000;

export function invalidateContactSettingsCache(): void {
  cache = null;
}

export async function getContactSettings(): Promise<ContactSettings> {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return cache.settings;
  }

  const db = getAdminDb();
  if (!db) {
    const settings = defaultContactSettings();
    cache = { settings, at: Date.now() };
    return settings;
  }

  try {
    const snap = await db.collection("siteSettings").doc(CONTACT_SETTINGS_DOC).get();
    const settings = normalizeContactSettings(
      snap.exists ? (snap.data() as Partial<ContactSettings>) : null
    );
    cache = { settings, at: Date.now() };
    return settings;
  } catch {
    return defaultContactSettings();
  }
}

export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  return toPublicContactSettings(await getContactSettings());
}

export async function saveContactSettings(
  input: Partial<ContactSettings>
): Promise<ContactSettings> {
  const db = getAdminDb();
  if (!db) throw new Error("Database not configured");

  const settings = normalizeContactSettings({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  await db.collection("siteSettings").doc(CONTACT_SETTINGS_DOC).set(settings, {
    merge: false,
  });

  invalidateContactSettingsCache();
  return settings;
}
