import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import type { CaseDoc } from "@/lib/content/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseLabels(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 500 }
    );
  }

  try {
    const snap = await db.collection("cases").orderBy("ordering", "asc").get();
    const cases = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseDoc) }));
    return NextResponse.json({ cases });
  } catch (e) {
    console.error("admin cases GET", e);
    return NextResponse.json({ error: "Failed to load cases." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 500 }
    );
  }

  let body: Partial<CaseDoc>;
  try {
    body = (await request.json()) as Partial<CaseDoc>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const data: CaseDoc = {
    title,
    treatmentType: String(body.treatmentType ?? "").trim(),
    labels: parseLabels(body.labels),
    ordering: Number(body.ordering) || 10,
    published: Boolean(body.published),
  };

  try {
    const ref = await db.collection("cases").add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id });
  } catch (e) {
    console.error("admin cases POST", e);
    return NextResponse.json({ error: "Failed to create case." }, { status: 500 });
  }
}
