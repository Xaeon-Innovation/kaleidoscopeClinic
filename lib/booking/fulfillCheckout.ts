import "server-only";

import type Stripe from "stripe";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { deleteBookingHold } from "@/lib/booking/holds";
import {
  calendarEventExists,
  findConsultationEventBySessionId,
  insertConsultationEvent,
} from "@/lib/calendar/googleCalendar";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe } from "@/lib/stripe/server";
import {
  GENERAL_CONSULTATION_NAME,
  GENERAL_CONSULTATION_SLUG,
} from "@/lib/treatments";
import { consultationNameForSlug as resolveConsultationName } from "@/lib/content/getContent";

export type FulfillResult =
  | { ok: true; status: "confirmed" | "already_confirmed" }
  | { ok: false; error: string };

/**
 * Idempotent: creates Google Calendar event + Firestore appointment for a paid Checkout session.
 */
export async function fulfillPaidCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<FulfillResult> {
  if (session.payment_status !== "paid") {
    return { ok: false, error: "Payment not completed." };
  }

  const sessionId = session.id;
  if (!sessionId) {
    return { ok: false, error: "Missing session id." };
  }

  const db = getAdminDb();
  if (!db) {
    return { ok: false, error: "Database not configured." };
  }

  const meta = session.metadata ?? {};
  const slotStart = meta.slotStart;
  const slotEnd = meta.slotEnd;
  const consultationTreatment =
    meta.consultationTreatment?.trim() || GENERAL_CONSULTATION_SLUG;
  const consultationTreatmentName =
    meta.consultationTreatmentName?.trim() ||
    (await resolveConsultationName(consultationTreatment)) ||
    GENERAL_CONSULTATION_NAME;
  const patientName = meta.patientName?.trim();
  const patientEmail = meta.patientEmail?.trim();
  const patientPhone = meta.patientPhone?.trim();
  const patientNote = meta.patientNote?.trim() || undefined;

  if (
    !slotStart ||
    !slotEnd ||
    !patientName ||
    !patientEmail ||
    !patientPhone
  ) {
    console.error("fulfill missing metadata", sessionId, meta);
    return { ok: false, error: "Booking metadata missing on payment session." };
  }

  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { ok: false, error: "Invalid slot times on payment session." };
  }

  const ref = db.collection("appointments").doc(sessionId);
  const existing = (await ref.get()).data();

  let calendarEventId = existing?.calendarEventId as string | undefined;
  let calendarHtmlLink = existing?.calendarHtmlLink as string | undefined;

  if (
    existing?.status === "confirmed" &&
    calendarEventId &&
    (await calendarEventExists(calendarEventId))
  ) {
    return { ok: true, status: "already_confirmed" };
  }

  const pi =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  if (!calendarEventId || !(await calendarEventExists(calendarEventId))) {
    calendarEventId = undefined;
    calendarHtmlLink = undefined;
  }

  if (!calendarEventId) {
    const existingEvent = await findConsultationEventBySessionId(
      sessionId,
      start,
      end
    );
    if (existingEvent) {
      calendarEventId = existingEvent.eventId;
      calendarHtmlLink = existingEvent.htmlLink ?? undefined;
    }
  }

  if (!calendarEventId) {
    try {
      const event = await insertConsultationEvent({
        slotStart: start,
        slotEnd: end,
        consultationTreatmentName,
        patientName,
        patientEmail,
        patientPhone,
        patientNote,
        stripeSessionId: sessionId,
      });
      calendarEventId = event.eventId;
      calendarHtmlLink = event.htmlLink ?? undefined;
    } catch (calErr) {
      console.error("calendar insert failed", sessionId, calErr);
      return {
        ok: false,
        error:
          calErr instanceof Error
            ? calErr.message
            : "Could not create calendar event.",
      };
    }
  }

  try {
    await ref.set(
      {
        stripeSessionId: sessionId,
        calendarEventId,
        calendarHtmlLink,
        status: "confirmed",
        stripePaymentIntentId: pi,
        slotStart: Timestamp.fromDate(start),
        slotEnd: Timestamp.fromDate(end),
        consultationTreatment,
        consultationTreatmentName,
        patientName,
        patientEmail,
        patientPhone,
        ...(patientNote ? { patientNote } : {}),
        createdAt: existing?.createdAt ?? FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (fsErr) {
    console.error("firestore save failed", sessionId, fsErr);
    return { ok: false, error: "Could not save appointment." };
  }

  try {
    await deleteBookingHold(sessionId);
  } catch (hErr) {
    console.warn("hold delete failed", sessionId, hErr);
  }

  return { ok: true, status: "confirmed" };
}

/** Retrieve session from Stripe and fulfill (used by success page + manual API). */
export async function fulfillCheckoutBySessionId(
  sessionId: string
): Promise<FulfillResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Stripe not configured." };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return fulfillPaidCheckoutSession(session);
  } catch (e) {
    console.error("fulfill retrieve session", sessionId, e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not load payment session.",
    };
  }
}
