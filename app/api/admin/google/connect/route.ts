import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { getGoogleOAuthConfigError } from "@/lib/booking/googleOAuth";
import { getOAuth2AuthorizationUrl } from "@/lib/calendar/googleCalendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const cfgErr = getGoogleOAuthConfigError();
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr }, { status: 503 });
  }

  const state = randomBytes(24).toString("hex");
  const authUrl = getOAuth2AuthorizationUrl(state);
  if (!authUrl) {
    return NextResponse.json(
      { error: "Could not build authorization URL." },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return NextResponse.redirect(authUrl);
}
