import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";

export async function uploadPublicFile(file: File, path: string) {
  const r = ref(getFirebaseStorage(), path);
  await uploadBytes(r, file, {
    contentType: file.type || "application/octet-stream",
  });
  return await getDownloadURL(r);
}

