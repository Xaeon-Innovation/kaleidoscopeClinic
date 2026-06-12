import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import {
  defaultContactSettings,
  getContactSettings,
  normalizeContactSettings,
  saveContactSettings,
  type ContactSettings,
} from "@/lib/site/contactSettings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  try {
    const settings = await getContactSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("contact settings GET", e);
    return NextResponse.json(
      { settings: defaultContactSettings() },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  let body: Partial<ContactSettings>;
  try {
    body = (await request.json()) as Partial<ContactSettings>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalized = normalizeContactSettings(body);

  try {
    const settings = await saveContactSettings(normalized);
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    console.error("contact settings PUT", e);
    return NextResponse.json(
      { error: "Failed to save contact settings." },
      { status: 500 }
    );
  }
}
