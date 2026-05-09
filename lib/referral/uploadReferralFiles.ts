import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

/**
 * Uploads referral attachments to Storage. Requires `referral_uploads/**` rules
 * allowing unauthenticated creates with size/type limits.
 */
export async function uploadReferralFiles(
  submissionId: string,
  files: File[]
): Promise<string[]> {
  if (files.length === 0) return [];
  const storage = getFirebaseStorage();
  const urls: string[] = [];

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      throw new Error(
        `Each file must be under ${MAX_BYTES / 1024 / 1024}MB (${file.name})`
      );
    }
    const ct = file.type || "application/octet-stream";
    if (!ALLOWED.has(ct)) {
      throw new Error(`Unsupported file type: ${file.name} (use PDF or image)`);
    }
    const path = `referral_uploads/${submissionId}/${Date.now()}_${safeName(file.name)}`;
    const r = ref(storage, path);
    await uploadBytes(r, file, { contentType: ct });
    urls.push(await getDownloadURL(r));
  }

  return urls;
}
