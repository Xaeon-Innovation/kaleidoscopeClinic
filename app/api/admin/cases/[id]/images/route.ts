import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { removeCaseImageAdmin, uploadCaseImageAdmin } from "@/lib/admin/caseStorage";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
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
  const caseSnap = await db.collection("cases").doc(id).get();
  if (!caseSnap.exists) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const which = form.get("which");
  const file = form.get("file");
  if (which !== "before" && which !== "after") {
    return NextResponse.json(
      { error: 'Missing or invalid "which" (before or after).' },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadCaseImageAdmin(
      id,
      which,
      buffer,
      file.type || "image/jpeg",
      file.name
    );

    await db.collection("cases").doc(id).update({
      [which === "before" ? "beforeImageUrl" : "afterImageUrl"]: url,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ url });
  } catch (e) {
    console.error("admin cases image POST", e);
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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
  const caseSnap = await db.collection("cases").doc(id).get();
  if (!caseSnap.exists) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const which = searchParams.get("which");
  if (which !== "before" && which !== "after") {
    return NextResponse.json(
      { error: 'Missing or invalid "which" query (before or after).' },
      { status: 400 }
    );
  }

  const data = caseSnap.data() as {
    beforeImageUrl?: string;
    afterImageUrl?: string;
  };
  const currentUrl =
    which === "before" ? data.beforeImageUrl : data.afterImageUrl;

  try {
    await removeCaseImageAdmin(id, which, currentUrl);
    await db.collection("cases").doc(id).update({
      [which === "before" ? "beforeImageUrl" : "afterImageUrl"]:
        FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin cases image DELETE", e);
    return NextResponse.json({ error: "Failed to remove image." }, { status: 500 });
  }
}
