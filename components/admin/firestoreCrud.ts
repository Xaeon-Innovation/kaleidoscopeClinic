import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export async function listDocs<T = unknown>(
  col: string,
  orderField: string = "ordering"
) {
  const q = query(collection(getFirebaseDb(), col), orderBy(orderField, "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function createDoc<T extends object>(col: string, data: T) {
  const ref = await addDoc(collection(getFirebaseDb(), col), data);
  return ref.id;
}

export async function updateDocById<T extends object>(
  col: string,
  id: string,
  data: Partial<T>
) {
  // Firestore's TS generics are strict; this helper is intentionally loosely typed.
  await updateDoc(
    doc(getFirebaseDb(), col, id),
    data as Record<string, unknown>
  );
}

export async function deleteDocById(col: string, id: string) {
  await deleteDoc(doc(getFirebaseDb(), col, id));
}

