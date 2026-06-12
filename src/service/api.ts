// src/service/firestoreService.ts
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // O arquivo que você já tem

// Exemplo: Buscar dados do usuário (Substitui o GET de /user/name)
export async function getUserProfile(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Usuário não encontrado");
  }
}

// Exemplo: Criar ou atualizar um documento genérico (Substitui o apiPost)
export async function salvarDados(colecao: string, id: string, dados: any) {
  const docRef = doc(db, colecao, id);
  await setDoc(docRef, dados, { merge: true });
}
