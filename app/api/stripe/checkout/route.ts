import { NextResponse } from "next/server";
import {
  getAppBaseUrl,
  getBookingCurrency,
  getBookingDepositPence,
  getStripeWebhookSecret,
} from "@/lib/booking/config";
import { getCalendarConfigError } from "@/lib/calendar/googleCalendar";
import { assertSlotStillAvailable } from "@/lib/booking/validateSlot";
import { createBookingHold } from "@/lib/booking/holds";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe } from "@/lib/stripe/server";
import type { SlotInterval } from "@/lib/calendar/slot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function trim(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

/** ISO 8601 slot instants — do not truncate heavily. */
function isoField(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, 80);
}

export async function POST(request: Request) {
  const gcal = getCalendarConfigError();
  if (gcal) {
    return NextResponse.json(
      { error: "Booking unavailable", detail: gcal },
      { status: 503 }
    );
  }

  if (!getAdminDb()) {
    return NextResponse.json(
      {
        error: "Server misconfiguration",
        detail: "FIREBASE_SERVICE_ACCOUNT_JSON is required for bookings.",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe || !getStripeWebhookSecret()) {
    return NextResponse.json(
      {
        error: "Payments not configured",
        detail: "Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slotStart = isoField(body.slotStart);
  const slotEnd = isoField(body.slotEnd);
  const patientName = trim(body.patientName, 120);
  const patientEmail = trim(body.patientEmail, 320);
  const patientPhone = trim(body.patientPhone, 40);

  if (!slotStart || !slotEnd || !patientName || !patientEmail || !patientPhone) {
    return NextResponse.json(
      { error: "slotStart, slotEnd, patientName, patientEmail, patientPhone are required." },
      { status: 400 }
    );
  }

  if (!patientEmail.includes("@")) {
    return NextResponse.json({ error: "Valid patient email required." }, { status: 400 });
  }

  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Invalid slot times." }, { status: 400 });
  }

  const slot: SlotInterval = { start, end };

  try {
    await assertSlotStillAvailable(slot);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Slot unavailable." },
      { status: 409 }
    );
  }

  const base = getAppBaseUrl();
  const currency = getBookingCurrency();
  const amount = getBookingDepositPence();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: "Consultation deposit",
              description: "Deposit to confirm your consultation appointment.",
            },
          },
        },
      ],
      client_reference_id: `${start.getTime()}-${end.getTime()}`,
      success_url: `${base}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/book`,
      metadata: {
        slotStart: start.toISOString(),
        slotEnd: end.toISOString(),
        patientName,
        patientEmail,
        patientPhone,
      },
      payment_intent_data: {
        metadata: {
          slotStart: start.toISOString(),
          slotEnd: end.toISOString(),
          patientName,
          patientEmail,
          patientPhone,
        },
      },
    });

    if (!session.id || !session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session." },
        { status: 500 }
      );
    }

    await createBookingHold({
      stripeSessionId: session.id,
      slot,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout", e);
    return NextResponse.json(
      { error: "Could not start checkout. Try again shortly." },
      { status: 500 }
    );
  }
}
