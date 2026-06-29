"use client";

export type ReferringDentist = {
  name: string;
  practice: string;
  address: string;
  postcode: string;
  contact: string;
  email: string;
};

export type PatientDetails = {
  name: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  contact: string;
  email: string;
  gpAddress: string;
};

export type ReferralPayload = {
  referringDentist: ReferringDentist;
  patient: PatientDetails;
  implantInterests: string[];
  clinicalHistory: string;
  medicalHistory: string;
  /** Selected imaging types, e.g. opg, periapical, cbct */
  radiographSelections: string[];
  radiographOther: string;
  imagingNotes: string;
  attachmentUrls: string[];
  signature: string;
  signedDate: string;
  sourcePage: string;
  utm?: Record<string, string>;
};

export async function submitReferral(payload: ReferralPayload) {
  const response = await fetch("/api/referral/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Failed to submit referral");
  }
}
