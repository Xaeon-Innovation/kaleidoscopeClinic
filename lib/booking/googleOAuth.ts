import "server-only";

import { getAppBaseUrl } from "@/lib/booking/config";

/** Full calendar access (includes freebusy + events). */
export const GOOGLE_CALENDAR_SCOPE =
  "https://www.googleapis.com/auth/calendar";
/** Required for freebusy — often missing if only calendar.events was granted. */
export const GOOGLE_CALENDAR_READONLY_SCOPE =
  "https://www.googleapis.com/auth/calendar.readonly";
/** Create/update/delete events. */
export const GOOGLE_CALENDAR_EVENTS_SCOPE =
  "https://www.googleapis.com/auth/calendar.events";
export const GOOGLE_USERINFO_EMAIL_SCOPE =
  "https://www.googleapis.com/auth/userinfo.email";

/** Request all scopes needed for availability + booking events. */
export const GOOGLE_OAUTH_SCOPES = [
  GOOGLE_CALENDAR_SCOPE,
  GOOGLE_CALENDAR_READONLY_SCOPE,
  GOOGLE_CALENDAR_EVENTS_SCOPE,
  GOOGLE_USERINFO_EMAIL_SCOPE,
];

export function parseGrantedScopes(scopeStr: string | undefined | null): string[] {
  if (!scopeStr?.trim()) return [];
  return scopeStr.trim().split(/\s+/);
}

/** freebusy.query needs calendar or calendar.readonly */
export function hasCalendarReadScope(scopeStr: string | undefined | null): boolean {
  const scopes = parseGrantedScopes(scopeStr);
  return scopes.some(
    (s) =>
      s === GOOGLE_CALENDAR_SCOPE || s === GOOGLE_CALENDAR_READONLY_SCOPE
  );
}

/** events.insert/delete needs calendar or calendar.events */
export function hasCalendarWriteScope(scopeStr: string | undefined | null): boolean {
  const scopes = parseGrantedScopes(scopeStr);
  return scopes.some(
    (s) =>
      s === GOOGLE_CALENDAR_SCOPE || s === GOOGLE_CALENDAR_EVENTS_SCOPE
  );
}

export function hasRequiredCalendarScopes(
  scopeStr: string | undefined | null
): boolean {
  return hasCalendarReadScope(scopeStr) && hasCalendarWriteScope(scopeStr);
}

export function getGoogleOAuthClientId(): string | null {
  const id = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  return id || null;
}

export function getGoogleOAuthClientSecret(): string | null {
  const secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  return secret || null;
}

export function getGoogleOAuthRedirectUri(): string {
  const explicit = process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  return `${getAppBaseUrl()}/api/admin/google/callback`;
}

export function getGoogleOAuthConfigError(): string | null {
  if (!getGoogleOAuthClientId()) return "Missing GOOGLE_OAUTH_CLIENT_ID";
  if (!getGoogleOAuthClientSecret()) return "Missing GOOGLE_OAUTH_CLIENT_SECRET";
  return null;
}
