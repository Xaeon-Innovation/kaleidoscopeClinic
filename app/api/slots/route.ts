import { NextResponse } from "next/server";

/**
 * @deprecated Booking availability uses Google Calendar via GET /api/calendar/availability.
 * This route is kept for backwards compatibility only.
 */
export async function GET() {
  return NextResponse.json({
    slots: [],
    deprecated: true,
    message:
      "Manual Firestore slots are retired. Use /api/calendar/availability after connecting Google Calendar in admin Settings.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Deprecated",
      message:
        "Slot management moved to Google Calendar. Connect your calendar in /admin/settings.",
    },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: "Deprecated",
      message:
        "Slot management moved to Google Calendar. Connect your calendar in /admin/settings.",
    },
    { status: 410 }
  );
}
