import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type { SlotInterval } from "@/lib/calendar/slot";
import { getBookingSettings } from "@/lib/booking/settings";
import { getStripe } from "@/lib/stripe/server";

const HOLDS = "booking_holds";

export async function createBookingHold(params: {
  stripeSessionId: string;
  slot: SlotInterval;
}): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");

  const { holdMinutes } = await getBookingSettings();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(
    now.toMillis() + holdMinutes * 60 * 1000
  );

  await db.collection(HOLDS).doc(params.stripeSessionId).set({
    slotStart: Timestamp.fromDate(params.slot.start),
    slotEnd: Timestamp.fromDate(params.slot.end),
    expiresAt,
    stripeSessionId: params.stripeSessionId,
    createdAt: now,
  });
}

export async function deleteBookingHold(stripeSessionId: string): Promise<void> {
  const db = getAdminDb();
  if (!db) return;
  await db.collection(HOLDS).doc(stripeSessionId).delete();
}

export type ReleaseHoldResult =
  | { released: true }
  | { released: false; reason: string };

/**
 * Deletes a temporary hold for an unpaid/abandoned Checkout session.
 * Safe to call on cancel, expiry, or idempotent retries — never removes holds for paid sessions.
 */
export async function releaseUnpaidBookingHold(
  sessionId: string
): Promise<ReleaseHoldResult> {
  const trimmed = sessionId.trim();
  if (!trimmed) {
    return { released: false, reason: "Missing session id." };
  }

  const stripe = getStripe();
  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(trimmed);
      if (session.payment_status === "paid") {
        return { released: false, reason: "Payment already completed." };
      }
    } catch (e) {
      console.warn("release hold: could not retrieve session", trimmed, e);
    }
  }

  try {
    await deleteBookingHold(trimmed);
    return { released: true };
  } catch (e) {
    console.warn("release hold: delete failed", trimmed, e);
    return {
      released: false,
      reason: e instanceof Error ? e.message : "Could not release hold.",
    };
  }
}

function overlaps(a: SlotInterval, b: SlotInterval): boolean {
  return a.start < b.end && a.end > b.start;
}

/**
 * Active holds overlapping the query window (treat hold as busy for whole slot).
 */
export async function getActiveHoldsIntervals(
  rangeStart: Date,
  rangeEnd: Date
): Promise<SlotInterval[]> {
  const db = getAdminDb();
  if (!db) return [];

  const now = Timestamp.now();
  const snap = await db
    .collection(HOLDS)
    .where("expiresAt", ">", now)
    .get();

  const out: SlotInterval[] = [];
  for (const doc of snap.docs) {
    const data = doc.data();
    const s = (data.slotStart as Timestamp)?.toDate();
    const e = (data.slotEnd as Timestamp)?.toDate();
    if (!s || !e || isNaN(s.getTime()) || isNaN(e.getTime())) continue;
    const interval: SlotInterval = { start: s, end: e };
    if (interval.end < rangeStart || interval.start > rangeEnd) continue;
    out.push(interval);
  }
  return out;
}
