import type { ServiceDoc } from "@/lib/content/types";
import {
  flagshipSlug,
  treatmentImages,
  treatments,
} from "@/lib/treatments";

/** Default treatments matching the treatments page and booking flow. */
export function defaultServiceDocs(): ServiceDoc[] {
  return treatments.map((treatment, index) => ({
    name: treatment.name,
    slug: treatment.slug,
    subtitle: treatment.subtitle,
    shortBenefits: treatment.bullets,
    category: treatment.category,
    imageUrl: treatmentImages[treatment.slug],
    priority: (index + 1) * 10,
    heroFlag: treatment.slug === flagshipSlug,
    flagship: treatment.slug === flagshipSlug,
    published: true,
  }));
}
