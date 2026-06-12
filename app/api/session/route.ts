import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_EXPIRES_MS,
  ADMIN_SESSION_MAX_AGE_SEC,
} from "@/lib/admin/session";

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

// POST /api/session  — mint Firebase session cookie after client-side login
// DELETE /api/session — clear cookie on logout
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json() as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const { getAdminAuth } = await import("@/lib/firebase/admin");
    const auth = getAdminAuth();
    if (!auth) {
      return NextResponse.json(
        { error: "Server auth not configured" },
        { status: 503 }
      );
    }

    await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ADMIN_SESSION_EXPIRES_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, {
      ...sessionCookieOptions(),
      maxAge: ADMIN_SESSION_MAX_AGE_SEC,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
