import type { TreatmentSeoContent } from "./content/types";
import { fullArchImplantsContent } from "./content/full-arch-implants";
import { dentalImplantsContent } from "./content/dental-implants";
import { smileMakeoversContent } from "./content/smile-makeovers";
import { fullMouthRehabilitationContent } from "./content/full-mouth-rehabilitation";
import { facialAestheticsContent } from "./content/facial-aesthetics";
import { hygienePreventiveCareContent } from "./content/hygiene-preventive-care";

const contentBySlug: Record<string, TreatmentSeoContent> = {
  [fullArchImplantsContent.slug]: fullArchImplantsContent,
  [dentalImplantsContent.slug]: dentalImplantsContent,
  [smileMakeoversContent.slug]: smileMakeoversContent,
  [fullMouthRehabilitationContent.slug]: fullMouthRehabilitationContent,
  [facialAestheticsContent.slug]: facialAestheticsContent,
  [hygienePreventiveCareContent.slug]: hygienePreventiveCareContent,
};

export function getAllTreatmentSeoSlugs(): string[] {
  return Object.keys(contentBySlug);
}

export function getTreatmentSeoContent(
  slug: string
): TreatmentSeoContent | undefined {
  return contentBySlug[slug];
}

export function getAllTreatmentSeoContent(): TreatmentSeoContent[] {
  return Object.values(contentBySlug);
}
