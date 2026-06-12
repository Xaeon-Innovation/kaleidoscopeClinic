import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { seedMissingServices, seedServicesIfEmpty } from "@/lib/admin/seedServices";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  let mode: "empty" | "missing" = "empty";
  try {
    const body = (await request.json()) as { mode?: string };
    if (body.mode === "missing") mode = "missing";
  } catch {
    // default mode
  }

  try {
    const result =
      mode === "missing"
        ? await seedMissingServices()
        : await seedServicesIfEmpty();
    return NextResponse.json(result);
  } catch (e) {
    console.error("admin services seed", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to seed treatments.",
      },
      { status: 500 }
    );
  }
}
