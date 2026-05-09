import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import type { CaseDoc, ServiceDoc, TeamDoc, TestimonialDoc } from "./types";

async function listCollection<T>(name: string, orderField: string) {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db.collection(name).orderBy(orderField, "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
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

