import { NextResponse } from "next/server";

// POST /api/session  — set cookie after client-side Firebase login
// DELETE /api/session — clear cookie on logout
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json() as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // In production you would verify the idToken with firebase-admin here.
    // For now we just store it as a session indicator cookie. 
    // Once FIREBASE_SERVICE_ACCOUNT_JSON is configured, replace this block with:
    //   const { auth } = await import("firebase-admin");
    //   const decoded = await auth().verifyIdToken(idToken);
    //   const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("__session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("__session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
