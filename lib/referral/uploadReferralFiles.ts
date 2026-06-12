import { compressImage } from "@/lib/admin/compressImageClient";

const MAX_BYTES = 4 * 1024 * 1024;
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

async function readApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? "Upload failed.";
  } catch {
    return "Upload failed.";
  }
}

async function uploadOne(
  submissionId: string,
  file: File
): Promise<string> {
  const ct = file.type || "application/octet-stream";
  if (!ALLOWED.has(ct)) {
    throw new Error(`Unsupported file type: ${file.name} (use PDF or image)`);
  }

  let payload = file;
  if (ct.startsWith("image/")) {
    payload = await compressImage(file);
  }

  if (payload.size > MAX_BYTES) {
    throw new Error(
      `Each file must be under ${MAX_BYTES / 1024 / 1024}MB (${file.name})`
    );
  }

  const form = new FormData();
  form.append("submissionId", submissionId);
  form.append("file", payload, safeName(payload.name));

  const res = await fetch("/api/referral/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await readApiError(res));

  const data = (await res.json()) as { url: string };
  return data.url;
}

/**
 * Uploads referral attachments via the server API to Vercel Blob.
 */
export async function uploadReferralFiles(
  submissionId: string,
  files: File[]
): Promise<string[]> {
  if (files.length === 0) return [];
  const urls: string[] = [];

  for (const file of files) {
    urls.push(await uploadOne(submissionId, file));
  }

  return urls;
}
