import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getStripeWebhookSecret } from "@/lib/booking/config";
import { deleteBookingHold } from "@/lib/booking/holds";
import { getAdminDb } from "@/lib/firebase/admin";
import { insertConsultationEvent } from "@/lib/calendar/googleCalendar";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = getStripeWebhookSecret();
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid payload";
    console.error("stripe webhook signature", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const sessionId = session.id;
  if (!sessionId) {
    return NextResponse.json({ received: true });
  }

  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "No database." }, { status: 503 });
    }

    const ref = db.collection("appointments").doc(sessionId);
    const existing = (await ref.get()).data();
    if (existing?.status === "confirmed" && existing?.calendarEventId) {
      return NextResponse.json({ received: true });
    }

    const meta = session.metadata ?? {};
    const slotStart = meta.slotStart;
    const slotEnd = meta.slotEnd;
    const patientName = meta.patientName?.trim();
    const patientEmail = meta.patientEmail?.trim();
    const patientPhone = meta.patientPhone?.trim();

    if (
      !slotStart ||
      !slotEnd ||
      !patientName ||
      !patientEmail ||
      !patientPhone
    ) {
      console.error("webhook missing metadata", sessionId, meta);
      return NextResponse.json({ received: true });
    }

    const start = new Date(slotStart);
    const end = new Date(slotEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("webhook bad dates", sessionId);
      return NextResponse.json({ received: true });
    }

    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    let calendarEventId = existing?.calendarEventId as string | undefined;
    if (!calendarEventId) {
      try {
        calendarEventId = await insertConsultationEvent({
          slotStart: start,
          slotEnd: end,
          patientName,
          patientEmail,
          patientPhone,
        });
        await ref.set(
          {
            stripeSessionId: sessionId,
            calendarEventId,
          },
          { merge: true }
        );
      } catch (calErr) {
        console.error("calendar insert failed", sessionId, calErr);
        return NextResponse.json({ error: "Calendar error" }, { status: 500 });
      }
    }

    try {
      await ref.set(
        {
          stripeSessionId: sessionId,
          calendarEventId,
          status: "confirmed",
          stripePaymentIntentId: pi,
          slotStart: Timestamp.fromDate(start),
          slotEnd: Timestamp.fromDate(end),
          patientName,
          patientEmail,
          patientPhone,
          createdAt: existing?.createdAt ?? FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.error("firestore save failed", sessionId, fsErr);
      return NextResponse.json({ error: "Persist error" }, { status: 500 });
    }

    try {
      await deleteBookingHold(sessionId);
    } catch (hErr) {
      console.warn("hold delete failed", sessionId, hErr);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("webhook handler", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}
