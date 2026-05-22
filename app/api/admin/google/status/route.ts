import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import {
  getGoogleOAuthConfigError,
  hasRequiredCalendarScopes,
} from "@/lib/booking/googleOAuth";
import { getGoogleCalendarIntegration } from "@/lib/calendar/integration";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const oauthCfg = getGoogleOAuthConfigError();
  const integration = await getGoogleCalendarIntegration();

  const grantedScopes = integration?.grantedScopes ?? null;
  const scopesOk = integration
    ? hasRequiredCalendarScopes(grantedScopes ?? "")
    : false;

  return NextResponse.json({
    oauthConfigured: !oauthCfg,
    oauthConfigError: oauthCfg,
    connected: !!integration,
    connectedEmail: integration?.connectedEmail ?? null,
    calendarId: integration?.calendarId ?? null,
    connectedAt: integration?.connectedAt ?? null,
    scopesOk,
    needsReconnect: !!integration && !scopesOk,
  });
}
