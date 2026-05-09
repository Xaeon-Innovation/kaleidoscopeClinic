"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact?: "form" | "whatsapp" | "phone";
  sourcePage?: string;
  utm?: Record<string, string>;
};

export async function submitLead(payload: LeadPayload) {
  const cleaned = {
    createdAt: serverTimestamp(),
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    message: payload.message.trim(),
    preferredContact: payload.preferredContact ?? "form",
    sourcePage: payload.sourcePage ?? "",
    utm: payload.utm ?? {},
  };

  if (!cleaned.name || !cleaned.email || !cleaned.phone || !cleaned.message) {
    throw new Error("Missing required fields");
  }

  await addDoc(collection(getFirebaseDb(), "leads"), cleaned);
}

