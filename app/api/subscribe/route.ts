import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendClinicEmail } from "@/lib/email/resend";
import {
  newsletterSignupStaffEmailHtml,
  newsletterSignupStaffEmailSubject,
} from "@/lib/email/templates";

const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  return email.length >= 3 && email.length <= 254 && email.includes("@");
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const email = String(payload.email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 254);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      console.error("Firebase Admin not configured — subscriber not saved");
      return NextResponse.json(
        { error: "Subscription unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const existing = await db
      .collection("subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (existing.empty) {
      try {
        await db.collection("subscribers").add({
          email,
          source: "footer",
          createdAt: new Date().toISOString(),
        });
      } catch (firebaseErr) {
        console.error("Firebase subscriber save failed:", firebaseErr);
        return NextResponse.json(
          { error: "Failed to save subscription. Please try again." },
          { status: 500 }
        );
      }

      await sendClinicEmail({
        subject: newsletterSignupStaffEmailSubject(email),
        html: newsletterSignupStaffEmailHtml(email),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
