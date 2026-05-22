import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import type { CaseDoc, ServiceDoc, TeamDoc, TestimonialDoc } from "./types";

function isFirestoreSetupError(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  const message = err instanceof Error ? err.message : String(err);
  return (
    code === "permission-denied" ||
    code === "7" ||
    message.includes("PERMISSION_DENIED") ||
    message.includes("Firestore API has not been used")
  );
}

async function listCollection<T>(name: string, orderField: string) {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db.collection(name).orderBy(orderField, "asc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
  } catch (err) {
    if (isFirestoreSetupError(err)) {
      console.error(
        `[getContent] Firestore unavailable for "${name}". Enable Firestore API and create a database: https://console.firebase.google.com/project/kaleidoscope-clinic/firestore`
      );
      return [];
    }
    throw err;
  }
}

export async function getServices() {
  return await listCollection<ServiceDoc>("services", "priority");
}

export async function getTeam() {
  return await listCollection<TeamDoc>("team", "ordering");
}

export async function getTestimonials() {
  const all = await listCollection<TestimonialDoc>("testimonials", "ordering");
  return all.filter((t) => Boolean((t as TestimonialDoc).published));
}

export async function getCases() {
  const all = await listCollection<CaseDoc>("cases", "ordering");
  return all.filter((c) => Boolean((c as CaseDoc).published));
}

