export type TreatmentCategory =
  | "all"
  | "implants"
  | "restorative"
  | "aesthetic"
  | "preventive";

export type Treatment = {
  slug: string;
  name: string;
  subtitle: string;
  category: Exclude<TreatmentCategory, "all">;
  bullets: string[];
};

export const treatmentCategories: { key: TreatmentCategory; label: string }[] = [
  { key: "all", label: "All treatments" },
  { key: "implants", label: "Implants" },
  { key: "restorative", label: "Restorative" },
  { key: "aesthetic", label: "Aesthetic" },
  { key: "preventive", label: "Preventive" },
];

export const treatmentImages: Record<string, string> = {
  "full-arch-implants": "/images/fullArch.jpeg",
  "dental-implants": "/images/treatments/Dental Implants.jpg",
  "smile-makeovers": "/images/treatments/smile makeover.jpg",
  "full-mouth-rehabilitation": "/images/treatments/Full Mouth Rehabilitation.jpg",
  "facial-aesthetics": "/images/faceAesthetics.jpeg",
  "hygiene-preventive-care": "/images/treatments/hygeine.jpg",
};

export const flagshipSlug = "full-arch-implants";

export const GENERAL_CONSULTATION_SLUG = "general-consultation" as const;
export const GENERAL_CONSULTATION_NAME = "General consultation";

export const treatments: Treatment[] = [
  {
    slug: "full-arch-implants",
    name: "Full Arch Implants",
    subtitle:
      "Same-day teeth and all-on-X solutions for missing or failing dentition.",
    category: "implants",
    bullets: [
      "Stable, natural-looking teeth for advanced tooth loss.",
      "Digitally planned with precision-led delivery.",
      "Built for long-term function and confidence.",
    ],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    subtitle:
      "Single and multiple implants to restore bite stability and natural aesthetics.",
    category: "implants",
    bullets: [
      "Replaces missing teeth with natural-looking results.",
      "Preserves oral function and overall bite balance.",
      "Planned for longevity and day-to-day comfort.",
    ],
  },
  {
    slug: "smile-makeovers",
    name: "Smile Makeovers (Veneers)",
    subtitle:
      "Veneer-led smile design centred around refined, facially balanced outcomes.",
    category: "aesthetic",
    bullets: [
      "Natural results that avoid an overdone appearance.",
      "Designed around facial harmony and proportion.",
      "Delivered through a calm, specialist-led process.",
    ],
  },
  {
    slug: "full-mouth-rehabilitation",
    name: "Full Mouth Rehabilitation",
    subtitle:
      "Comprehensive restorative planning for worn, compromised, or unstable bites.",
    category: "restorative",
    bullets: [
      "Complex planning for compromised dentition and function.",
      "Function-first dentistry with premium aesthetics.",
      "Structured pathway toward long-term stability.",
    ],
  },
  {
    slug: "facial-aesthetics",
    name: "Facial Aesthetics",
    subtitle:
      "Clinically led facial harmony treatments with subtle, balanced enhancement.",
    category: "aesthetic",
    bullets: [
      "Subtle enhancements tailored to facial balance.",
      "Clinically led planning and conservative execution.",
      "Natural outcomes with careful consideration.",
    ],
  },
  {
    slug: "hygiene-preventive-care",
    name: "Hygiene & Preventive Care",
    subtitle:
      "Comfort-focused maintenance and hygiene support that protect long-term results.",
    category: "preventive",
    bullets: [
      "Maintain implant and restorative outcomes over time.",
      "Professional hygiene guidance and support.",
      "Patient-first care with comfort in mind.",
    ],
  },
];

export const bookableConsultations = [
  { slug: GENERAL_CONSULTATION_SLUG, name: GENERAL_CONSULTATION_NAME },
  ...treatments.map((t) => ({ slug: t.slug, name: t.name })),
];

export function isValidConsultationSlug(slug: string): boolean {
  return bookableConsultations.some((c) => c.slug === slug);
}

export function consultationNameForSlug(slug: string): string | undefined {
  return bookableConsultations.find((c) => c.slug === slug)?.name;
}
