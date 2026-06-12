import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import {
  resolveTeamMemberKey,
  uploadTeamHeadshotAdmin,
} from "@/lib/admin/teamStorage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file." }, { status: 400 });
  }

  const memberId = form.get("memberId");
  const memberKey = resolveTeamMemberKey(
    typeof memberId === "string" ? memberId : undefined
  );

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadTeamHeadshotAdmin(
      memberKey,
      buffer,
      file.type || "image/jpeg",
      file.name
    );
    return NextResponse.json({ url });
  } catch (e) {
    console.error("admin team upload POST", e);
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
