import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import {
  defaultBookingSettings,
  getBookingSettings,
  normalizeBookingSettings,
  saveBookingSettings,
  type BookingSettings,
} from "@/lib/booking/settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  try {
    const settings = await getBookingSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("booking settings GET", e);
    return NextResponse.json(
      { settings: defaultBookingSettings() },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  let body: Partial<BookingSettings>;
  try {
    body = (await request.json()) as Partial<BookingSettings>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalized = normalizeBookingSettings(body);
  const enabledDays = normalized.days.filter((d) => d.enabled);
  if (enabledDays.length === 0) {
    return NextResponse.json(
      { error: "At least one working day must be enabled." },
      { status: 400 }
    );
  }

  if (
    normalized.weekAvailabilityMode === "weeks_only" &&
    (normalized.enabledWeeks?.length ?? 0) === 0
  ) {
    return NextResponse.json(
      { error: "At least one week must be enabled in weeks-only mode." },
      { status: 400 }
    );
  }

  try {
    const settings = await saveBookingSettings(normalized);
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    console.error("booking settings PUT", e);
    return NextResponse.json(
      { error: "Failed to save booking settings." },
      { status: 500 }
    );
  }
}
