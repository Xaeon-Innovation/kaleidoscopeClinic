import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendReferralThankYouEmails } from "@/lib/email/sendReferralEmails";
import type { ReferralPayload } from "@/lib/leads/submitReferral";

const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

function must(s: string, label: string) {
  const t = s.trim();
  if (!t) throw new Error(`Missing ${label}`);
  return t;
}

function cleanReferralPayload(payload: ReferralPayload) {
  const rd = payload.referringDentist;
  const pt = payload.patient;

  const doc = {
    sourcePage: String(payload.sourcePage ?? "/referral").slice(0, 100),
    utm: payload.utm && typeof payload.utm === "object" ? payload.utm : {},
    referringDentist: {
      name: must(rd.name, "referring dentist name").slice(0, 120),
      practice: must(rd.practice, "practice name").slice(0, 160),
      address: must(rd.address, "practice address").slice(0, 300),
      postcode: must(rd.postcode, "practice postcode").slice(0, 20),
      contact: must(rd.contact, "referring contact number").slice(0, 30),
      email: must(rd.email, "referring email").slice(0, 254),
    },
    patient: {
      name: must(pt.name, "patient name").slice(0, 120),
      dateOfBirth: must(pt.dateOfBirth, "patient date of birth").slice(0, 20),
      address: must(pt.address, "patient address").slice(0, 300),
      postcode: must(pt.postcode, "patient postcode").slice(0, 20),
      contact: must(pt.contact, "patient contact number").slice(0, 30),
      email: must(pt.email, "patient email").slice(0, 254),
      gpAddress: String(pt.gpAddress ?? "").trim().slice(0, 300),
    },
    implantInterests: payload.implantInterests.filter(Boolean).slice(0, 20),
    clinicalHistory: must(payload.clinicalHistory, "clinical history").slice(
      0,
      5000
    ),
    medicalHistory: must(payload.medicalHistory, "medical history").slice(
      0,
      5000
    ),
    radiographSelections: (payload.radiographSelections ?? [])
      .filter(Boolean)
      .slice(0, 10),
    radiographOther: String(payload.radiographOther ?? "").trim().slice(0, 500),
    imagingNotes: String(payload.imagingNotes ?? "").trim().slice(0, 2000),
    attachmentUrls: (payload.attachmentUrls ?? [])
      .filter((url) => typeof url === "string")
      .slice(0, 20),
    signature: must(payload.signature, "signature").slice(0, 160),
    signedDate: must(payload.signedDate, "date").slice(0, 20),
    createdAt: new Date().toISOString(),
  };

  if (doc.implantInterests.length === 0) {
    throw new Error("Select at least one treatment area");
  }

  if (!doc.referringDentist.email.includes("@")) {
    throw new Error("Invalid referring email");
  }
  if (!doc.patient.email.includes("@")) {
    throw new Error("Invalid patient email");
  }

  return doc;
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
    const payload = (await req.json()) as ReferralPayload;
    const doc = cleanReferralPayload(payload);

    const db = getAdminDb();
    if (!db) {
      console.error("Firebase Admin not configured — referral not saved");
      return NextResponse.json(
        { error: "Referral storage unavailable. Please try again later." },
        { status: 503 }
      );
    }

    try {
      await db.collection("referrals").add(doc);
    } catch (firebaseErr) {
      console.error("Firebase referral save failed:", firebaseErr);
      return NextResponse.json(
        { error: "Failed to save your referral. Please try again." },
        { status: 500 }
      );
    }

    await sendReferralThankYouEmails({
      dentistName: doc.referringDentist.name,
      dentistEmail: doc.referringDentist.email,
      patientName: doc.patient.name,
      patientEmail: doc.patient.email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid referral";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
