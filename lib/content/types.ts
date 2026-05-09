export type ServiceDoc = {
  name: string;
  slug: string;
  shortBenefits: string[];
  educationalCopy: string;
  priority: number;
  heroFlag: boolean;
};

export type TeamDoc = {
  name: string;
  titles: string;
  bioShort: string;
  credentials: string;
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

