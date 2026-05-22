import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { getAppBaseUrl } from "@/lib/booking/config";
import { hasRequiredCalendarScopes } from "@/lib/booking/googleOAuth";
import {
  exchangeOAuthCode,
  fetchGoogleAccountEmail,
  queryFreeBusy,
} from "@/lib/calendar/googleCalendar";
import { saveGoogleCalendarIntegration } from "@/lib/calendar/integration";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const settingsUrl = new URL("/admin/settings", getAppBaseUrl());

  if (oauthError) {
    settingsUrl.searchParams.set("calendar", "denied");
    return NextResponse.redirect(settingsUrl);
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.set("google_oauth_state", "", { maxAge: 0, path: "/" });

  if (!code || !state || !expectedState || state !== expectedState) {
    settingsUrl.searchParams.set("calendar", "error");
    return NextResponse.redirect(settingsUrl);
  }

  try {
    const tokens = await exchangeOAuthCode(code);
    const accessToken = tokens.access_token;
    if (!accessToken) {
      throw new Error("No access token received");
    }

    const grantedScopes = tokens.scope ?? "";
    if (!hasRequiredCalendarScopes(grantedScopes)) {
      console.error("google oauth insufficient scopes", grantedScopes);
      settingsUrl.searchParams.set("calendar", "scopes");
      return NextResponse.redirect(settingsUrl);
    }

    const email = await fetchGoogleAccountEmail(accessToken);

    await saveGoogleCalendarIntegration({
      refreshToken: tokens.refresh_token!,
      accessToken,
      expiryDate: tokens.expiry_date ?? undefined,
      grantedScopes,
      calendarId: "primary",
      connectedEmail: email,
      connectedAt: new Date().toISOString(),
      connectedByAdminUid: admin.uid,
    });

    // Verify freebusy works before declaring success
    const probeStart = new Date();
    const probeEnd = new Date(probeStart.getTime() + 24 * 60 * 60 * 1000);
    await queryFreeBusy({ timeMin: probeStart, timeMax: probeEnd });

    settingsUrl.searchParams.set("calendar", "connected");
    return NextResponse.redirect(settingsUrl);
  } catch (e) {
    console.error("google oauth callback", e);
    settingsUrl.searchParams.set("calendar", "error");
    return NextResponse.redirect(settingsUrl);
  }
}
