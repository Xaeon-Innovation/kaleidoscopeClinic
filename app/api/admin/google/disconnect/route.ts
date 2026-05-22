import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import {
  getGoogleCalendarIntegration,
  deleteGoogleCalendarIntegration,
} from "@/lib/calendar/integration";
import { revokeOAuthToken } from "@/lib/calendar/googleCalendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  try {
    const integration = await getGoogleCalendarIntegration();
    if (integration?.refreshToken) {
      await revokeOAuthToken(integration.refreshToken);
    }
    await deleteGoogleCalendarIntegration();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("google disconnect", e);
    return NextResponse.json(
      { error: "Failed to disconnect calendar." },
      { status: 500 }
    );
  }
}
