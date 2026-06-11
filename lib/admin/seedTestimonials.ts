import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import { defaultTestimonialDocs } from "@/lib/content/mapTestimonials";
import type { TestimonialDoc } from "@/lib/content/types";

export type SeedTestimonialsResult = {
  created: number;
  skipped: number;
  total: number;
};

export async function seedTestimonialsIfEmpty(): Promise<SeedTestimonialsResult> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured.");
  }

  const snap = await db.collection("testimonials").get();
  if (snap.size > 0) {
    return { created: 0, skipped: snap.size, total: snap.size };
  }

  const docs = defaultTestimonialDocs();
  const batch = db.batch();

  for (const doc of docs) {
    const ref = db.collection("testimonials").doc();
    batch.set(ref, doc as TestimonialDoc);
  }

  await batch.commit();

  return { created: docs.length, skipped: 0, total: docs.length };
}
