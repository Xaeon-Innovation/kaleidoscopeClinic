import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

function stripUndefined<T extends object>(data: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

export async function listDocs<T = unknown>(
  col: string,
  orderField: string = "ordering"
) {
  const q = query(collection(getFirebaseDb(), col), orderBy(orderField, "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function createDoc<T extends object>(col: string, data: T) {
  const ref = await addDoc(
    collection(getFirebaseDb(), col),
    stripUndefined(data)
  );
  return ref.id;
}

export async function updateDocById<T extends object>(
  col: string,
  id: string,
  data: Partial<T>
) {
  // Firestore's TS generics are strict; this helper is intentionally loosely typed.
  await updateDoc(doc(getFirebaseDb(), col, id), stripUndefined(data));
}
export async function deleteDocById(col: string, id: string) {
  await deleteDoc(doc(getFirebaseDb(), col, id));
}

export async function deleteDocFields(col: string, id: string, fields: string[]) {
  const patch: Record<string, ReturnType<typeof deleteField>> = {};
  for (const field of fields) patch[field] = deleteField();
  await updateDoc(doc(getFirebaseDb(), col, id), patch);
}

