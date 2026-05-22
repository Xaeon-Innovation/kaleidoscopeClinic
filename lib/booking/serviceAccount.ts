import "server-only";

import { loadServiceAccount } from "@/lib/firebase/serviceAccount";

export type ServiceAccountJson = {
  project_id: string;
  client_email: string;
  private_key: string;
};

/**
 * Calendar/API SA JSON — optional `GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON`, else Firebase admin credentials.
 */
export function parseCalendarServiceAccount(): ServiceAccountJson | null {
  const calRaw = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON?.trim();
  if (calRaw) {
    try {
      const parsed = JSON.parse(calRaw) as ServiceAccountJson;
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return parsed;
      }
    } catch {
      /* fall through */
    }
  }
  return loadServiceAccount();
}
