import { NextResponse } from "next/server";
import { requireAdmin, isAdminSession } from "@/lib/admin/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { deleteCalendarEvent } from "@/lib/calendar/googleCalendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_STATUSES = ["confirmed", "cancelled", "attended"] as const;
type AppointmentStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!isAdminSession(admin)) return admin;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing appointment id." }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = body.status as AppointmentStatus | undefined;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "status must be confirmed, cancelled, or attended." },
      { status: 400 }
    );
  }

  const ref = db.collection("appointments").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const data = snap.data()!;
  const previousStatus = data.status as string | undefined;
  const calendarEventId = data.calendarEventId as string | undefined;

  if (status === "cancelled" && calendarEventId && previousStatus !== "cancelled") {
    try {
      await deleteCalendarEvent(calendarEventId);
    } catch (e) {
      console.error("calendar delete failed", id, e);
      return NextResponse.json(
        { error: "Failed to remove calendar event." },
        { status: 500 }
      );
    }
  }

  await ref.set({ status }, { merge: true });

  return NextResponse.json({ ok: true, status });
}
