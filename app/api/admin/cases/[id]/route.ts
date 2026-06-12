import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import type { CaseDoc } from "@/lib/content/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

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

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 500 }
    );
  }

  const { id } = await context.params;
  let body: Partial<CaseDoc>;
  try {
    body = (await request.json()) as Partial<CaseDoc>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    patch.title = title;
  }
  if (body.treatmentType !== undefined) {
    patch.treatmentType = String(body.treatmentType).trim();
  }
  if (body.labels !== undefined) patch.labels = parseLabels(body.labels);
  if (body.ordering !== undefined) patch.ordering = Number(body.ordering) || 10;
  if (body.published !== undefined) patch.published = Boolean(body.published);
  if (body.beforeImageUrl === null) patch.beforeImageUrl = FieldValue.delete();
  if (body.afterImageUrl === null) patch.afterImageUrl = FieldValue.delete();

  try {
    await db.collection("cases").doc(id).update(patch);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin cases PATCH", e);
    return NextResponse.json({ error: "Failed to update case." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 500 }
    );
  }

  const { id } = await context.params;

  try {
    await db.collection("cases").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin cases DELETE", e);
    return NextResponse.json({ error: "Failed to delete case." }, { status: 500 });
  }
}
