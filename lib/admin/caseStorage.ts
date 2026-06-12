import "server-only";

import { randomUUID } from "crypto";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "@/lib/firebase/admin";
import {
  isLocalCaseImageUrl,
  removeCaseImageLocal,
  uploadCaseImageLocal,
} from "@/lib/admin/caseLocalStorage";
import { loadServiceAccount } from "@/lib/firebase/serviceAccount";
import { resolveFirebaseStorageBucket } from "@/lib/firebase/storageBucket";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type CaseImageStorageMode = "firebase" | "local";

function imageExtension(contentType: string, originalName?: string) {
  const lower = originalName?.toLowerCase() ?? "";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (lower.endsWith(".webp") || contentType === "image/webp") return "webp";
  return "jpg";
}

export function getCaseImageStorageMode(): CaseImageStorageMode {
  const mode = process.env.CASE_IMAGE_STORAGE?.trim().toLowerCase();
  if (mode === "local") return "local";
  if (mode === "firebase") return "firebase";
  return process.env.NODE_ENV === "production" ? "firebase" : "local";
}

function isBucketMissingError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("bucket does not exist")) return true;
  if (message.includes("Bucket name not specified")) return true;

  const code =
    err && typeof err === "object" && "code" in err
      ? Number((err as { code: unknown }).code)
      : null;
  return code === 404;
}

function storageSetupError(): Error {
  return new Error(
    "Firebase Storage is not set up for this project. In Firebase Console go to Storage → Get started (Blaze billing is required). For local development without Storage, add CASE_IMAGE_STORAGE=local to .env.local and restart the dev server."
  );
}

async function uploadCaseImageFirebase(
  caseId: string,
  which: "before" | "after",
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const app = getAdminApp();
  if (!app) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env.local."
    );
  }

  const ext = imageExtension(contentType, originalName);
  const filePath = `public/cases/${caseId}/${which}.${ext}`;
  const sa = loadServiceAccount();
  const bucketName = resolveFirebaseStorageBucket(sa?.project_id);
  const bucket = getStorage(app).bucket(bucketName);
  const token = randomUUID();

  await bucket.file(filePath).save(buffer, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const encoded = encodeURIComponent(filePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`;
}

export async function uploadCaseImageAdmin(
  caseId: string,
  which: "before" | "after",
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const ct = contentType || "image/jpeg";
  if (!ALLOWED.has(ct)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, or WebP.");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be under 15MB.");
  }

  if (getCaseImageStorageMode() === "local") {
    return uploadCaseImageLocal(caseId, which, buffer, ct, originalName);
  }

  try {
    return await uploadCaseImageFirebase(
      caseId,
      which,
      buffer,
      ct,
      originalName
    );
  } catch (err) {
    if (isBucketMissingError(err) && process.env.NODE_ENV !== "production") {
      console.warn(
        "[caseStorage] Firebase Storage bucket not found — saving to public/uploads/ for local development."
      );
      return uploadCaseImageLocal(caseId, which, buffer, ct, originalName);
    }
    if (isBucketMissingError(err)) throw storageSetupError();
    throw err instanceof Error ? err : new Error("Upload failed.");
  }
}

export async function removeCaseImageAdmin(
  caseId: string,
  which: "before" | "after",
  currentUrl?: string
) {
  if (isLocalCaseImageUrl(currentUrl)) {
    await removeCaseImageLocal(currentUrl);
    return;
  }

  if (!currentUrl || getCaseImageStorageMode() === "local") return;

  const app = getAdminApp();
  if (!app) return;

  try {
    const sa = loadServiceAccount();
    const bucketName = resolveFirebaseStorageBucket(sa?.project_id);
    const bucket = getStorage(app).bucket(bucketName);
    const ext = currentUrl.includes(".png") ? "png" : "jpg";
    await bucket
      .file(`public/cases/${caseId}/${which}.${ext}`)
      .delete({ ignoreNotFound: true });
  } catch {
    // Best-effort cleanup; Firestore field is still cleared by the caller.
  }
}
