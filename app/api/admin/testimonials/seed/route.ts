import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { seedTestimonialsIfEmpty } from "@/lib/admin/seedTestimonials";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  try {
    const result = await seedTestimonialsIfEmpty();
    return NextResponse.json(result);
  } catch (e) {
    console.error("admin testimonials seed", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to seed testimonials.",
      },
      { status: 500 }
    );
  }
}
