import "server-only";

import { formatInTimeZone } from "date-fns-tz";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { CLINIC } from "@/components/siteLinks";
import { getBookingSettings } from "@/lib/booking/settings";
import {
  getGoogleOAuthClientId,
  getGoogleOAuthClientSecret,
  getGoogleOAuthConfigError,
  getGoogleOAuthRedirectUri,
  GOOGLE_OAUTH_SCOPES,
  hasRequiredCalendarScopes,
} from "@/lib/booking/googleOAuth";
import {
  getGoogleCalendarIntegration,
  updateGoogleCalendarTokens,
} from "@/lib/calendar/integration";

export function getCalendarConfigError(): string | null {
  const oauthCfg = getGoogleOAuthConfigError();
  if (oauthCfg) return oauthCfg;
  return null;
}

export async function isCalendarConnected(): Promise<boolean> {
  const integration = await getGoogleCalendarIntegration();
  return !!integration?.refreshToken;
}

export async function getCalendarConnectionError(): Promise<string | null> {
  const cfg = getCalendarConfigError();
  if (cfg) return cfg;
  const integration = await getGoogleCalendarIntegration();
  if (!integration?.refreshToken) {
    return "Google Calendar is not connected. An admin must connect it in Settings.";
  }
  if (
    integration.grantedScopes &&
    !hasRequiredCalendarScopes(integration.grantedScopes)
  ) {
    return "Calendar connected with insufficient permissions. Disconnect in Settings and connect again after adding Calendar scopes in Google Cloud.";
  }
  return null;
}

export function isInsufficientScopeError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("insufficient authentication scopes") ||
    message.includes("Insufficient Permission")
  );
}

export function createOAuth2Client(): OAuth2Client | null {
  const clientId = getGoogleOAuthClientId();
  const clientSecret = getGoogleOAuthClientSecret();
  if (!clientId || !clientSecret) return null;
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    getGoogleOAuthRedirectUri()
  );
}

export function getOAuth2AuthorizationUrl(state: string): string | null {
  const client = createOAuth2Client();
  if (!client) return null;
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: GOOGLE_OAUTH_SCOPES,
    state,
  });
}

export async function exchangeOAuthCode(code: string) {
  const client = createOAuth2Client();
  if (!client) throw new Error("OAuth not configured");
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "No refresh token received. Disconnect the app in Google Account settings and try again."
    );
  }
  return tokens;
}

async function getAuthenticatedOAuthClient(): Promise<{
  client: OAuth2Client;
  calendarId: string;
} | null> {
  const integration = await getGoogleCalendarIntegration();
  const oauth2 = createOAuth2Client();
  if (!integration?.refreshToken || !oauth2) return null;

  oauth2.setCredentials({
    refresh_token: integration.refreshToken,
    access_token: integration.accessToken,
    expiry_date: integration.expiryDate,
    scope: integration.grantedScopes,
  });

  const needsRefresh =
    !integration.accessToken ||
    !integration.expiryDate ||
    integration.expiryDate <= Date.now() + 60_000;

  if (needsRefresh) {
    const { credentials } = await oauth2.refreshAccessToken();
    if (credentials.access_token && credentials.expiry_date) {
      await updateGoogleCalendarTokens({
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date,
        scope: credentials.scope ?? integration.grantedScopes,
      });
      oauth2.setCredentials({
        ...credentials,
        scope: credentials.scope ?? integration.grantedScopes,
      });
    }
  }

  return { client: oauth2, calendarId: integration.calendarId };
}

export async function getCalendarClient() {
  const auth = await getAuthenticatedOAuthClient();
  if (!auth) return null;
  return google.calendar({ version: "v3", auth: auth.client });
}

export async function getConnectedCalendarId(): Promise<string | null> {
  const integration = await getGoogleCalendarIntegration();
  return integration?.calendarId ?? null;
}

export async function queryFreeBusy(params: {
  timeMin: Date;
  timeMax: Date;
}): Promise<{ start: Date; end: Date }[]> {
  const calendarId = await getConnectedCalendarId();
  const client = await getCalendarClient();
  if (!calendarId || !client) return [];

  const res = await client.freebusy.query({
    requestBody: {
      timeMin: params.timeMin.toISOString(),
      timeMax: params.timeMax.toISOString(),
      items: [{ id: calendarId }],
    },
  });

  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .map((b) => ({
      start: new Date(b.start ?? ""),
      end: new Date(b.end ?? ""),
    }))
    .filter((b) => !isNaN(b.start.getTime()) && !isNaN(b.end.getTime()));
}

export type ConsultationEventResult = {
  eventId: string;
  htmlLink: string | null;
};

/** Google Calendar expects local RFC3339 time when `timeZone` is set (no Z offset). */
function toGoogleCalendarDateTime(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ss");
}

function buildConsultationDescription(params: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNote?: string;
  stripeSessionId?: string;
}): string {
  const lines = [
    "Booked via Kaleidoscope website (deposit paid).",
    "",
    `Patient: ${params.patientName}`,
    `Email: ${params.patientEmail}`,
    `Phone: ${params.patientPhone}`,
  ];
  const note = params.patientNote?.trim();
  if (note) {
    lines.push("", "Patient note:", note);
  }
  if (params.stripeSessionId) {
    lines.push("", `Stripe session: ${params.stripeSessionId}`);
  }
  return lines.join("\n");
}

export async function insertConsultationEvent(params: {
  slotStart: Date;
  slotEnd: Date;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNote?: string;
  stripeSessionId?: string;
}): Promise<ConsultationEventResult> {
  const calendarId = await getConnectedCalendarId();
  const client = await getCalendarClient();
  if (!calendarId || !client) {
    throw new Error("Calendar not configured");
  }

  const { timezone: tz } = await getBookingSettings();
  const name = params.patientName.trim() || "Patient";

  const res = await client.events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: `Consultation — ${name}`,
      description: buildConsultationDescription(params),
      location: CLINIC.addressLines.join(", "),
      start: {
        dateTime: toGoogleCalendarDateTime(params.slotStart, tz),
        timeZone: tz,
      },
      end: {
        dateTime: toGoogleCalendarDateTime(params.slotEnd, tz),
        timeZone: tz,
      },
      attendees: [
        {
          email: params.patientEmail,
          displayName: name,
          responseStatus: "needsAction",
        },
      ],
    },
  });

  const id = res.data.id;
  if (!id) throw new Error("Calendar insert returned no event id");
  return { eventId: id, htmlLink: res.data.htmlLink ?? null };
}

/** Find existing consultation event for this Stripe session (avoids duplicate inserts). */
export async function findConsultationEventBySessionId(
  stripeSessionId: string,
  slotStart: Date,
  slotEnd: Date
): Promise<{ eventId: string; htmlLink: string | null } | null> {
  const calendarId = await getConnectedCalendarId();
  const client = await getCalendarClient();
  if (!calendarId || !client || !stripeSessionId) return null;

  const res = await client.events.list({
    calendarId,
    timeMin: new Date(slotStart.getTime() - 86_400_000).toISOString(),
    timeMax: new Date(slotEnd.getTime() + 86_400_000).toISOString(),
    singleEvents: true,
    q: stripeSessionId,
  });

  for (const item of res.data.items ?? []) {
    if (!item.id) continue;
    const desc = item.description ?? "";
    if (!desc.includes(stripeSessionId)) continue;
    return { eventId: item.id, htmlLink: item.htmlLink ?? null };
  }
  return null;
}

export async function calendarEventExists(eventId: string): Promise<boolean> {
  const calendarId = await getConnectedCalendarId();
  const client = await getCalendarClient();
  if (!calendarId || !client) return false;
  try {
    await client.events.get({ calendarId, eventId });
    return true;
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: number }).code
        : undefined;
    if (code === 404) return false;
    throw err;
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendarId = await getConnectedCalendarId();
  const client = await getCalendarClient();
  if (!calendarId || !client) {
    throw new Error("Calendar not configured");
  }
  await client.events.delete({
    calendarId,
    eventId,
    sendUpdates: "all",
  });
}

export async function revokeOAuthToken(refreshToken: string): Promise<void> {
  const client = createOAuth2Client();
  if (!client) return;
  try {
    await client.revokeToken(refreshToken);
  } catch {
    // Token may already be revoked
  }
}

export async function fetchGoogleAccountEmail(
  accessToken: string
): Promise<string> {
  const oauth2 = createOAuth2Client();
  if (!oauth2) throw new Error("OAuth not configured");
  oauth2.setCredentials({ access_token: accessToken });
  const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
  const res = await oauth2Api.userinfo.get();
  const email = res.data.email;
  if (!email) throw new Error("Could not read Google account email");
  return email;
}
