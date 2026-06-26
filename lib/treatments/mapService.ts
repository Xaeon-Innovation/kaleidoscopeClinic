import type { ServiceDoc } from "@/lib/content/types";
import {
  flagshipSlug as defaultFlagshipSlug,
  treatmentImages,
  type Treatment,
  type TreatmentCategory,
} from "@/lib/treatments";

export type TreatmentDisplay = Treatment & { imageSrc?: string };

const validCategories = new Set<Exclude<TreatmentCategory, "all">>([
  "implants",
  "restorative",
  "aesthetic",
  "preventive",
]);

function normalizeCategory(
  value: unknown
): Exclude<TreatmentCategory, "all"> {
  if (typeof value === "string" && validCategories.has(value as never)) {
    return value as Exclude<TreatmentCategory, "all">;
  }
  return "preventive";
}

export function serviceDocToTreatment(doc: ServiceDoc): Treatment {
  return {
    slug: doc.slug,
    name: doc.name,
    subtitle: doc.subtitle?.trim() || doc.educationalCopy?.trim() || "",
    category: normalizeCategory(doc.category),
    bullets: Array.isArray(doc.shortBenefits)
      ? doc.shortBenefits.filter(Boolean)
      : [],
  };
}

const LEGACY_IMAGE_REDIRECTS: Record<string, string> = {
  "/images/full-arch-implant.png": "/images/full_arch_2.jpeg",
  "/images/full arch.jpeg": "/images/full_arch_2.jpeg",
  "/images/full-arch.jpeg": "/images/full_arch_2.jpeg",
};

export function resolveTreatmentImage(
  slug: string,
  imageUrl?: string
): string | undefined {
  const custom = imageUrl?.trim();
  if (custom) {
    return LEGACY_IMAGE_REDIRECTS[custom] ?? custom;
  }
  return treatmentImages[slug];
}

export function resolveFlagshipSlug(
  services: ServiceDoc[],
  treatments: Treatment[]
): string {
  const flagged = services.find((s) => s.flagship);
  if (flagged?.slug) return flagged.slug;
  if (treatments.some((t) => t.slug === defaultFlagshipSlug)) {
    return defaultFlagshipSlug;
  }
  return treatments[0]?.slug ?? defaultFlagshipSlug;
}

export function treatmentsToImageMap(
  treatments: TreatmentDisplay[]
): Record<string, string> {
  const map: Record<string, string> = { ...treatmentImages };
  for (const t of treatments) {
    if (t.imageSrc) map[t.slug] = t.imageSrc;
  }
  return map;
}
