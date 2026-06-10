import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import { defaultTeamDocs } from "@/lib/content/mapTeam";
import type { TeamDoc } from "@/lib/content/types";

export type SeedTeamResult = {
  created: number;
  skipped: number;
  total: number;
};

export async function seedTeamIfEmpty(): Promise<SeedTeamResult> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured.");
  }

  const snap = await db.collection("team").get();
  if (snap.size > 0) {
    return { created: 0, skipped: snap.size, total: snap.size };
  }

  const docs = defaultTeamDocs();
  const batch = db.batch();

  for (const doc of docs) {
    const ref = db.collection("team").doc();
    batch.set(ref, doc as TeamDoc);
  }

  await batch.commit();

  return { created: docs.length, skipped: 0, total: docs.length };
}
