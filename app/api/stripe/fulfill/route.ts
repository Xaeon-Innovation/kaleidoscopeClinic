import { NextResponse } from "next/server";
import { fulfillCheckoutBySessionId } from "@/lib/booking/fulfillCheckout";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Confirms booking + calendar when webhook did not run (e.g. local dev without Stripe CLI). */
export async function POST(request: Request) {
  let body: { sessionId?: string };
  try {
    body = (await request.json()) as { sessionId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Valid sessionId required." }, { status: 400 });
  }

  const result = await fulfillCheckoutBySessionId(sessionId);
  if (!result.ok) {
    const status = result.error.includes("not completed") ? 402 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, status: result.status });
}
