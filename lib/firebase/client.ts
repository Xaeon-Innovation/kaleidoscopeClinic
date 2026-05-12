import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Next.js only inlines NEXT_PUBLIC_* variables when they are
// accessed with their LITERAL names (not via dynamic bracket notation).
// Using process.env[name] with a runtime variable does NOT work on the client.
const clientConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0]!;

  // In the browser, log a warning if any key is missing instead of throwing.
  if (typeof window !== "undefined") {
    const missing = Object.entries(clientConfig)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length > 0) {
      console.error("Firebase: missing client config keys:", missing);
    }
  }

  return initializeApp(clientConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}
