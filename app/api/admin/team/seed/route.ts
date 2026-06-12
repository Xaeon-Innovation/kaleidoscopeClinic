import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { seedTeamIfEmpty } from "@/lib/admin/seedTeam";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  try {
    const result = await seedTeamIfEmpty();
    return NextResponse.json(result);
  } catch (e) {
    console.error("admin team seed", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Failed to seed team profiles.",
      },
      { status: 500 }
    );
  }
}
