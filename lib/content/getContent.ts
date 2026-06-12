import "server-only";

import { getAdminDb } from "@/lib/firebase/admin";
import {
  GENERAL_CONSULTATION_NAME,
  GENERAL_CONSULTATION_SLUG,
  flagshipSlug as defaultFlagshipSlug,
  treatments as defaultTreatments,
} from "@/lib/treatments";
import {
  resolveFlagshipSlug,
  resolveTreatmentImage,
  serviceDocToTreatment,
  type TreatmentDisplay,
} from "@/lib/treatments/mapService";
import {
  defaultTeamDisplay,
  teamDocToDisplay,
  type TeamMemberDisplay,
} from "./mapTeam";
import { defaultTestimonialDocs } from "./mapTestimonials";
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

export type TreatmentsContent = {
  treatments: TreatmentDisplay[];
  flagshipSlug: string;
  treatmentImages: Record<string, string>;
};

export async function getTreatmentsContent(): Promise<TreatmentsContent> {
  const services = await getServices();
  const published = services.filter((s) => s.published !== false);

  if (published.length === 0) {
    const treatments = defaultTreatments.map((t) => ({
      ...t,
      imageSrc: resolveTreatmentImage(t.slug),
    }));
    const treatmentImages: Record<string, string> = {};
    for (const t of treatments) {
      if (t.imageSrc) treatmentImages[t.slug] = t.imageSrc;
    }
    return {
      treatments,
      flagshipSlug: defaultFlagshipSlug,
      treatmentImages,
    };
  }

  const treatments = published.map((s) => ({
    ...serviceDocToTreatment(s),
    imageSrc: resolveTreatmentImage(s.slug, s.imageUrl),
  }));

  const treatmentImages: Record<string, string> = {};
  for (const t of treatments) {
    if (t.imageSrc) treatmentImages[t.slug] = t.imageSrc;
  }

  return {
    treatments,
    flagshipSlug: resolveFlagshipSlug(published, treatments),
    treatmentImages,
  };
}

export async function getBookableConsultations() {
  const { treatments } = await getTreatmentsContent();
  return [
    { slug: GENERAL_CONSULTATION_SLUG, name: GENERAL_CONSULTATION_NAME },
    ...treatments.map((t) => ({ slug: t.slug, name: t.name })),
  ];
}

export async function isValidConsultationSlug(slug: string): Promise<boolean> {
  const options = await getBookableConsultations();
  return options.some((c) => c.slug === slug);
}

export async function consultationNameForSlug(
  slug: string
): Promise<string | undefined> {
  const options = await getBookableConsultations();
  return options.find((c) => c.slug === slug)?.name;
}

export async function getTeam(): Promise<TeamMemberDisplay[]> {
  const docs = await listCollection<TeamDoc>("team", "ordering");
  if (docs.length === 0) return defaultTeamDisplay();
  return docs.map(teamDocToDisplay);
}

export type { TeamMemberDisplay };

export async function getTestimonials() {
  const all = await listCollection<TestimonialDoc>("testimonials", "ordering");
  const published = all.filter((t) => Boolean(t.published));
  if (published.length === 0) {
    return defaultTestimonialDocs().map((t, index) => ({
      id: `default-${index}`,
      ...t,
    }));
  }
  return published;
}

export async function getCases() {
  const all = await listCollection<CaseDoc>("cases", "ordering");
  return all.filter((c) => Boolean((c as CaseDoc).published));
}

