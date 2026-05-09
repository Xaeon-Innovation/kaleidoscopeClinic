import "server-only";

export type ServiceAccountJson = {
  project_id: string;
  client_email: string;
  private_key: string;
};

/**
 * Calendar/API SA JSON — falls back to Firebase Admin key if unset (same GCP project).
 * Required env: one of `GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON` or `FIREBASE_SERVICE_ACCOUNT_JSON`.
 */
export function parseCalendarServiceAccount(): ServiceAccountJson | null {
  const raw =
    process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON ??
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccountJson;
    if (
      !parsed.project_id ||
      !parsed.client_email ||
      !parsed.private_key
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
