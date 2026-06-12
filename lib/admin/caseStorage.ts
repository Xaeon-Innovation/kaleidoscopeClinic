import "server-only";

import {
  isBlobImageUrl,
  removeBlobByUrl,
  uploadCaseImageBlob,
} from "@/lib/admin/blobStorage";
import {
  isLocalCaseImageUrl,
  removeCaseImageLocal,
  uploadCaseImageLocal,
} from "@/lib/admin/caseLocalStorage";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type CaseImageStorageMode = "blob" | "local";

export function getCaseImageStorageMode(): CaseImageStorageMode {
  const mode = process.env.CASE_IMAGE_STORAGE?.trim().toLowerCase();
  if (mode === "local") return "local";
  if (mode === "blob") return "blob";
  return process.env.NODE_ENV === "production" ? "blob" : "local";
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
    throw new Error("Image must be under 4MB.");
  }

  if (getCaseImageStorageMode() === "local") {
    return uploadCaseImageLocal(caseId, which, buffer, ct, originalName);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel or use CASE_IMAGE_STORAGE=local for offline dev."
    );
  }

  return uploadCaseImageBlob(caseId, which, buffer, ct, originalName);
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

  if (isBlobImageUrl(currentUrl)) {
    await removeBlobByUrl(currentUrl);
    return;
  }

  if (!currentUrl || getCaseImageStorageMode() === "local") return;
}
