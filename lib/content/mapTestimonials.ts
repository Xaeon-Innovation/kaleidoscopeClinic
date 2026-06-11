import { defaultHomeTestimonials } from "./defaultTestimonials";
import type { TestimonialDoc } from "./types";

export type TestimonialDisplay = {
  quote: string;
  name: string;
  treatment?: string;
};

export function defaultTestimonialDisplay(): TestimonialDisplay[] {
  return defaultHomeTestimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    treatment: t.treatment,
  }));
}

export function defaultTestimonialDocs(): TestimonialDoc[] {
  return defaultHomeTestimonials.map((t, index) => ({
    patientNameInitials: t.name,
    quote: t.quote,
    treatment: t.treatment,
    ordering: (index + 1) * 10,
    published: true,
  }));
}
