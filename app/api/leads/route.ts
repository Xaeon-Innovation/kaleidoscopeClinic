import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { Resend } from "resend";

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

    const cleaned = {
      name: String(payload.name ?? "").trim().slice(0, 120),
      email: String(payload.email ?? "").trim().slice(0, 254),
      phone: String(payload.phone ?? "").trim().slice(0, 30),
      message: String(payload.message ?? "").trim().slice(0, 2000),
      preferredContact: payload.preferredContact ?? "form",
      sourcePage: String(payload.sourcePage ?? "").slice(0, 100),
      utm: payload.utm && typeof payload.utm === "object" ? payload.utm : {},
      createdAt: new Date().toISOString(),
    };

    if (!cleaned.name || !cleaned.email || !cleaned.phone || !cleaned.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Save to Firebase
    try {
      const db = getAdminDb();
      if (db) await db.collection("leads").add(cleaned);
    } catch (firebaseErr) {
      console.error("Firebase save failed:", firebaseErr);
    }

    // 2. Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ?? "noreply@kaleidoscopedental.co.uk";
      const toEmail =
        process.env.CONTACT_EMAIL ?? "hello@kaleidoscopedental.co.uk";

      await resend.emails.send({
        from: `Kaleidoscope Website <${fromEmail}>`,
        to: toEmail,
        subject: `New Enquiry: ${cleaned.name}`,
        html: `
          <h2 style="font-family:serif;margin:0 0 16px">New consultation enquiry</h2>
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 12px 6px 0;color:#555;width:130px">Name</td><td style="padding:6px 0"><strong>${cleaned.name}</strong></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#555">Email</td><td style="padding:6px 0"><a href="mailto:${cleaned.email}">${cleaned.email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#555">Phone</td><td style="padding:6px 0"><a href="tel:${cleaned.phone}">${cleaned.phone}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#555">Via</td><td style="padding:6px 0">${cleaned.preferredContact}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#555">Source</td><td style="padding:6px 0">${cleaned.sourcePage}</td></tr>
          </table>
          <div style="margin-top:16px;background:#f5f5f5;padding:16px;border-radius:8px;font-family:sans-serif;font-size:14px;line-height:1.6">
            ${cleaned.message.replace(/\n/g, "<br/>")}
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

