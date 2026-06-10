import "server-only";

import { randomUUID } from "crypto";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "@/lib/firebase/admin";
import { getCaseImageStorageMode } from "@/lib/admin/caseStorage";
import { uploadTeamHeadshotLocal } from "@/lib/admin/teamLocalStorage";
import { loadServiceAccount } from "@/lib/firebase/serviceAccount";
import { resolveFirebaseStorageBucket } from "@/lib/firebase/storageBucket";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function imageExtension(contentType: string, originalName?: string) {
  const lower = originalName?.toLowerCase() ?? "";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (lower.endsWith(".webp") || contentType === "image/webp") return "webp";
  return "jpg";
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
    "Firebase Storage is not set up for this project. For local development without Storage, add CASE_IMAGE_STORAGE=local to .env.local and restart the dev server."
  );
}

async function uploadTeamHeadshotFirebase(
  memberKey: string,
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
  const filePath = `public/team/${memberKey}/headshot.${ext}`;
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

export function resolveTeamMemberKey(memberId?: string): string {
  const trimmed = memberId?.trim();
  return trimmed || `drafts/${randomUUID()}`;
}

export async function uploadTeamHeadshotAdmin(
  memberKey: string,
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
    return uploadTeamHeadshotLocal(memberKey, buffer, ct, originalName);
  }

  try {
    return await uploadTeamHeadshotFirebase(
      memberKey,
      buffer,
      ct,
      originalName
    );
  } catch (err) {
    if (isBucketMissingError(err) && process.env.NODE_ENV !== "production") {
      console.warn(
        "[teamStorage] Firebase Storage bucket not found — saving to public/uploads/ for local development."
      );
      return uploadTeamHeadshotLocal(memberKey, buffer, ct, originalName);
    }
    if (isBucketMissingError(err)) throw storageSetupError();
    throw err instanceof Error ? err : new Error("Upload failed.");
  }
}
