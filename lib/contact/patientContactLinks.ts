import { whatsappHrefFromNumber } from "@/components/siteLinks";

const CLINIC_NAME = "Kaleidoscope Dental Specialists";

export function normalizeContactEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) return null;
  return trimmed;
}

export function normalizeContactPhone(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  // UK local numbers: 07… → 447…
  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `44${digits.slice(1)}`;
  }

  if (digits.length < 10) return null;
  return digits;
}

type ComposeParams = {
  to: string;
  subject?: string;
  body?: string;
};

export function buildGmailComposeUrl({ to, subject, body }: ComposeParams): string {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", to);
  if (subject) url.searchParams.set("su", subject);
  if (body) url.searchParams.set("body", body);
  return url.toString();
}

/** RFC 6068 mailto with encoded query params for better client compatibility. */
export function buildMailtoUrl({ to, subject, body }: ComposeParams): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${to.trim()}${query ? `?${query}` : ""}`;
}

export function buildPatientWhatsAppUrl(
  phone: string,
  patientName?: string
): string | null {
  const digits = normalizeContactPhone(phone);
  if (!digits) return null;

  const greeting = patientName?.trim()
    ? `Hi ${patientName.trim()},`
    : "Hi,";

  return whatsappHrefFromNumber(
    digits,
    `${greeting} thank you for contacting ${CLINIC_NAME}. `
  );
}

export function buildPatientEmailCompose(patientName?: string) {
  const subject = `Your enquiry — ${CLINIC_NAME}`;
  const greeting = patientName?.trim() ? `Hi ${patientName.trim()},` : "Hi,";
  const body = `${greeting}\n\nThank you for contacting ${CLINIC_NAME}.\n\n`;
  return { subject, body };
}

export function openExternalUrl(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}