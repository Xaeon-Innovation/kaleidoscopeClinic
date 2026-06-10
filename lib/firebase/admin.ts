import "server-only";

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { loadServiceAccount } from "@/lib/firebase/serviceAccount";
import { resolveFirebaseStorageBucket } from "@/lib/firebase/storageBucket";

export function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;
  const sa = loadServiceAccount();
  if (!sa) {
    return null;
  }
  return initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: resolveFirebaseStorageBucket(sa.project_id),
  });
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}

