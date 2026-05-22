import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type { SlotInterval } from "@/lib/calendar/slot";
import { getBookingSettings } from "@/lib/booking/settings";

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
