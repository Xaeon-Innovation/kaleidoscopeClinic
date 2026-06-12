import { CLINIC } from "@/components/siteLinks";

export const SITE_NAME = CLINIC.name;
export const SITE_LOCALE = "en_GB" as const;
export const PRODUCTION_URL = "https://kaleidoscopedental.co.uk";

function resolveAppBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? "";
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export function getSiteBaseUrl(): string {
  const base = resolveAppBaseUrl();
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    return PRODUCTION_URL;
  }
  return base.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteBaseUrl()}${normalized}`;
}

export const CLINIC_ADDRESS = {
  streetAddress: CLINIC.addressLines[0] ?? "1 Orchard St",
  addressLocality: "London",
  addressRegion: "Marylebone",
  postalCode: "W1H 6HJ",
  addressCountry: "GB",
} as const;

export const CLINIC_CONTACT = {
  telephone: "+447745325295",
  email: CLINIC.email,
} as const;

export const DEFAULT_DESCRIPTION =
  "Specialist-led implant and restorative dentistry in London. Advanced digital planning, predictable outcomes, and concierge-style care.";
