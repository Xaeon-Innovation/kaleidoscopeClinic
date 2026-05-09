import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function getEnv(name: string) {
  return process.env[name];
}

function assertClientConfig() {
  const required = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;
  for (const k of required) {
    if (!getEnv(k)) throw new Error(`Missing env var: ${k}`);
  }
}

export function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0]!;

  // Avoid failing builds/prerender when env isn't configured yet.
  // Real usage happens in the browser; validate before initializing there.
  if (typeof window !== "undefined") assertClientConfig();

  return initializeApp({
    apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  });
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

