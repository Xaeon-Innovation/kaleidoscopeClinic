import { compressImage } from "@/lib/admin/compressImageClient";

async function readApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? "Upload failed.";
  } catch {
    return "Upload failed.";
  }
}

export async function uploadTeamHeadshot(
  file: File,
  memberId?: string
): Promise<string> {
  const compressed = await compressImage(file);
  const form = new FormData();
  form.append("file", compressed);
  if (memberId) form.append("memberId", memberId);

  const res = await fetch("/api/admin/team/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await readApiError(res));

  const data = (await res.json()) as { url: string };
  return data.url;
}

export async function uploadCaseImage(
  caseId: string,
  which: "before" | "after",
  file: File
): Promise<void> {
  const compressed = await compressImage(file);
  const form = new FormData();
  form.append("which", which);
  form.append("file", compressed);

  const res = await fetch(`/api/admin/cases/${caseId}/images`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await readApiError(res));
}

/** Compress without uploading — for create-form draft previews. */
export async function prepareImageForUpload(file: File): Promise<File> {
  return compressImage(file);
}
