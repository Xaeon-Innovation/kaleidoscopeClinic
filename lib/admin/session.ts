import "server-only";

/** HttpOnly admin session cookie (Firebase session cookie, not a raw ID token). */
export const ADMIN_SESSION_COOKIE = "__session";

/** Five days — must match createSessionCookie expiresIn. */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 5;

export const ADMIN_SESSION_EXPIRES_MS = ADMIN_SESSION_MAX_AGE_SEC * 1000;
