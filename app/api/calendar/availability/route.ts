import { NextResponse } from "next/server";
import { getSlotsWithStatus } from "@/lib/calendar/availability";
import {
  getCalendarConnectionError,
  isInsufficientScopeError,
} from "@/lib/calendar/googleCalendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const cfg = await getCalendarConnectionError();
  if (cfg) {
    return NextResponse.json(
      { error: "Booking unavailable", detail: cfg },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json(
      { error: "Query params `from` and `to` (yyyy-MM-dd) are required." },
      { status: 400 }
    );
  }

  if (from > to) {
    return NextResponse.json(
      { error: "`from` must be on or before `to`." },
      { status: 400 }
    );
  }

  try {
    const slots = await getSlotsWithStatus(from, to);
    return NextResponse.json({
      slots: slots.map((s) => ({
        start: s.start.toISOString(),
        end: s.end.toISOString(),
        available: s.available,
      })),
    });
  } catch (e) {
    console.error("availability GET", e);
    if (isInsufficientScopeError(e)) {
      return NextResponse.json(
        {
          error: "Calendar permissions incomplete",
          detail:
            "Disconnect Google Calendar in Admin → Settings, add Calendar read scopes in Google Cloud OAuth consent screen, then connect again.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to load availability." },
      { status: 500 }
    );
  }
}
