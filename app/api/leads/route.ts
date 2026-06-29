import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendClinicEmail } from "@/lib/email/resend";
import {
  contactLeadEmailHtml,
  contactLeadEmailSubject,
} from "@/lib/email/templates";

// ── Simple in-memory rate limiter (5 req / IP / 60s) ─────────────────────
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

export async function POST(req: Request) {
  // Origin check
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Content-Type check
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const payload = await req.json();

    const sourcePage = String(payload.sourcePage ?? "").slice(0, 100);
    const cleaned = {
      name: String(payload.name ?? "").trim().slice(0, 120),
      email: String(payload.email ?? "").trim().slice(0, 254),
      phone: String(payload.phone ?? "").trim().slice(0, 30),
      message: String(payload.message ?? "").trim().slice(0, 2000),
      preferredContact: payload.preferredContact ?? "form",
      sourcePage,
      kind: sourcePage === "/contact" ? "contact" : "enquiry",
      contacted: false,
      utm: payload.utm && typeof payload.utm === "object" ? payload.utm : {},
      createdAt: new Date().toISOString(),
    };

    if (!cleaned.name || !cleaned.email || !cleaned.phone || !cleaned.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Save to Firebase (required for admin dashboard)
    const db = getAdminDb();
    if (!db) {
      console.error("Firebase Admin not configured — lead not saved");
      return NextResponse.json(
        { error: "Lead storage unavailable. Please try again later." },
        { status: 503 }
      );
    }
    try {
      await db.collection("leads").add(cleaned);
    } catch (firebaseErr) {
      console.error("Firebase save failed:", firebaseErr);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // 2. Email via Resend
    const isContact = cleaned.sourcePage === "/contact";
    await sendClinicEmail({
      subject: contactLeadEmailSubject({
        name: cleaned.name,
        email: cleaned.email,
        phone: cleaned.phone,
        message: cleaned.message,
        preferredContact: String(cleaned.preferredContact),
        sourcePage: cleaned.sourcePage,
        isContact,
      }),
      html: contactLeadEmailHtml({
        name: cleaned.name,
        email: cleaned.email,
        phone: cleaned.phone,
        message: cleaned.message,
        preferredContact: String(cleaned.preferredContact),
        sourcePage: cleaned.sourcePage,
        isContact,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

