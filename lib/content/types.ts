export type ServiceCategory =
  | "implants"
  | "restorative"
  | "aesthetic"
  | "preventive";

export type ServiceDoc = {
  name: string;
  slug: string;
  subtitle?: string;
  shortBenefits: string[];
  /** @deprecated Prefer subtitle — kept for legacy documents */
  educationalCopy?: string;
  category?: ServiceCategory;
  imageUrl?: string;
  priority: number;
  heroFlag: boolean;
  flagship?: boolean;
  published?: boolean;
};

export type TeamDoc = {
  name: string;
  badge?: string;
  titles: string;
  subtitle?: string;
  bioShort: string;
  credentials: string;
  specialties?: string[];
  headshotUrl?: string;
  ordering: number;
};

export type TestimonialDoc = {
  patientNameInitials: string;
  quote: string;
  ordering: number;
  published: boolean;
};

export type CaseDoc = {
  title: string;
  treatmentType: string;
  labels: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  ordering: number;
  published: boolean;
};

