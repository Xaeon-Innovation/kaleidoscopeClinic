import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import type { ServiceDoc } from "@/lib/content/types";
import { defaultServiceDocs } from "@/lib/treatments/seedServices";

export type SeedServicesResult = {
  created: number;
  skipped: number;
  total: number;
};

export async function seedServicesIfEmpty(): Promise<SeedServicesResult> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured.");
  }

  const snap = await db.collection("services").get();
  if (snap.size > 0) {
    return { created: 0, skipped: snap.size, total: snap.size };
  }

  const docs = defaultServiceDocs();
  const batch = db.batch();

  for (const doc of docs) {
    const ref = db.collection("services").doc();
    batch.set(ref, doc as ServiceDoc);
  }

  await batch.commit();

  return { created: docs.length, skipped: 0, total: docs.length };
}

export async function seedMissingServices(): Promise<SeedServicesResult> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured.");
  }

  const snap = await db.collection("services").get();
  const existingSlugs = new Set(
    snap.docs.map((doc) => String((doc.data() as ServiceDoc).slug ?? ""))
  );

  const toCreate = defaultServiceDocs().filter(
    (doc) => !existingSlugs.has(doc.slug)
  );

  if (toCreate.length === 0) {
    return { created: 0, skipped: snap.size, total: snap.size };
  }

  const batch = db.batch();
  for (const doc of toCreate) {
    const ref = db.collection("services").doc();
    batch.set(ref, doc as ServiceDoc);
  }
  await batch.commit();

  return {
    created: toCreate.length,
    skipped: snap.size,
    total: snap.size + toCreate.length,
  };
}
