export type TreatmentSeoContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  keywords: string[];
  lastModified: string;
};

export type TreatmentSeoSection = TreatmentSeoContent["sections"][number];
export type TreatmentFaq = TreatmentSeoContent["faqs"][number];
