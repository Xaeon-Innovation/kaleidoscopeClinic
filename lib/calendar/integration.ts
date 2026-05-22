import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";

export const GOOGLE_CALENDAR_INTEGRATION_ID = "googleCalendar";

export type GoogleCalendarIntegration = {
  refreshToken: string;
  accessToken?: string;
  expiryDate?: number;
  /** Space-separated scopes returned by Google at connect time */
  grantedScopes?: string;
  calendarId: string;
  connectedEmail: string;
  connectedAt: string;
  connectedByAdminUid: string;
};

export async function getGoogleCalendarIntegration(): Promise<GoogleCalendarIntegration | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db
    .collection("integrations")
    .doc(GOOGLE_CALENDAR_INTEGRATION_ID)
    .get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<GoogleCalendarIntegration>;
  if (!data.refreshToken || !data.connectedEmail) return null;
  return {
    refreshToken: data.refreshToken,
    accessToken: data.accessToken,
    expiryDate: data.expiryDate,
    grantedScopes: data.grantedScopes,
    calendarId: data.calendarId ?? "primary",
    connectedEmail: data.connectedEmail,
    connectedAt: data.connectedAt ?? "",
    connectedByAdminUid: data.connectedByAdminUid ?? "",
  };
}

export async function saveGoogleCalendarIntegration(
  integration: GoogleCalendarIntegration
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Database not configured");
  await db
    .collection("integrations")
    .doc(GOOGLE_CALENDAR_INTEGRATION_ID)
    .set(integration, { merge: false });
}

export async function deleteGoogleCalendarIntegration(): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Database not configured");
  await db
    .collection("integrations")
    .doc(GOOGLE_CALENDAR_INTEGRATION_ID)
    .delete();
}

export async function updateGoogleCalendarTokens(params: {
  accessToken: string;
  expiryDate: number;
  scope?: string;
}): Promise<void> {
  const db = getAdminDb();
  if (!db) return;
  await db
    .collection("integrations")
    .doc(GOOGLE_CALENDAR_INTEGRATION_ID)
    .set(
      {
        accessToken: params.accessToken,
        expiryDate: params.expiryDate,
        ...(params.scope ? { grantedScopes: params.scope } : {}),
      },
      { merge: true }
    );
}
