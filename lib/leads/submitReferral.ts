"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

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

function must(s: string, label: string) {
  const t = s.trim();
  if (!t) throw new Error(`Missing ${label}`);
  return t;
}

export async function submitReferral(payload: ReferralPayload) {
  const rd = payload.referringDentist;
  const pt = payload.patient;

  const doc = {
    createdAt: serverTimestamp(),
    sourcePage: payload.sourcePage,
    utm: payload.utm ?? {},
    referringDentist: {
      name: must(rd.name, "referring dentist name"),
      practice: must(rd.practice, "practice name"),
      address: must(rd.address, "practice address"),
      postcode: must(rd.postcode, "practice postcode"),
      contact: must(rd.contact, "referring contact number"),
      email: must(rd.email, "referring email"),
    },
    patient: {
      name: must(pt.name, "patient name"),
      dateOfBirth: must(pt.dateOfBirth, "patient date of birth"),
      address: must(pt.address, "patient address"),
      postcode: must(pt.postcode, "patient postcode"),
      contact: must(pt.contact, "patient contact number"),
      email: must(pt.email, "patient email"),
      gpAddress: pt.gpAddress.trim(),
    },
    implantInterests: payload.implantInterests.filter(Boolean),
    clinicalHistory: must(payload.clinicalHistory, "clinical history"),
    medicalHistory: must(payload.medicalHistory, "medical history"),
    radiographSelections: payload.radiographSelections,
    radiographOther: payload.radiographOther.trim(),
    imagingNotes: payload.imagingNotes.trim(),
    attachmentUrls: payload.attachmentUrls,
    signature: must(payload.signature, "signature"),
    signedDate: must(payload.signedDate, "date"),
  };

  if (doc.implantInterests.length === 0) {
    throw new Error("Select at least one treatment area");
  }

  await addDoc(collection(getFirebaseDb(), "referrals"), doc);
}
