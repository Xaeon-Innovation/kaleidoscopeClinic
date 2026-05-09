import "server-only";

import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { parseCalendarServiceAccount } from "@/lib/booking/serviceAccount";
import {
  getBookingTimezone,
  getGoogleCalendarId,
} from "@/lib/booking/config";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

export function getCalendarConfigError(): string | null {
  if (!parseCalendarServiceAccount())
    return "Missing GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON";
  if (!getGoogleCalendarId()) return "Missing GOOGLE_CALENDAR_ID";
  return null;
}

function getJWT() {
  const sa = parseCalendarServiceAccount();
  if (!sa) return null;
  return new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: [CALENDAR_SCOPE],
    subject: undefined,
  });
}

export function getCalendarClient() {
  const jwt = getJWT();
  if (!jwt) return null;
  return google.calendar({ version: "v3", auth: jwt });
}

export async function queryFreeBusy(params: {
  timeMin: Date;
  timeMax: Date;
}): Promise<{ start: Date; end: Date }[]> {
  const calendarId = getGoogleCalendarId();
  const client = getCalendarClient();
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

export async function insertConsultationEvent(params: {
  slotStart: Date;
  slotEnd: Date;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
}): Promise<string> {
  const calendarId = getGoogleCalendarId();
  const client = getCalendarClient();
  if (!calendarId || !client) {
    throw new Error("Calendar not configured");
  }

  const tz = getBookingTimezone();

  const res = await client.events.insert({
    calendarId,
    sendUpdates: "none",
    requestBody: {
      summary: `Consultation — ${params.patientName}`,
      description: [
        `Patient: ${params.patientName}`,
        `Email: ${params.patientEmail}`,
        `Phone: ${params.patientPhone}`,
        "Booked via website (deposit paid).",
      ].join("\n"),
      start: {
        dateTime: params.slotStart.toISOString(),
        timeZone: tz,
      },
      end: {
        dateTime: params.slotEnd.toISOString(),
        timeZone: tz,
      },
      attendees: [{ email: params.patientEmail }],
    },
  });

  const id = res.data.id;
  if (!id) throw new Error("Calendar insert returned no event id");
  return id;
}
