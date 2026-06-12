import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ==========================================
// FUNÇÕES GENÉRICAS (Servem para qualquer coleção)
// ==========================================

/**
 * Busca todos os documentos de uma coleção específica.
 */
export async function getAll(colecao: string) {
  const querySnapshot = await getDocs(collection(db, colecao));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Busca um único documento pelo ID.
 */
export async function getById(colecao: string, id: string) {
  const docRef = doc(db, colecao, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Documento não encontrado");
  }
}

/**
 * Adiciona um novo documento com ID gerado automaticamente.
 */
export async function create(colecao: string, dados: any) {
  const docRef = await addDoc(collection(db, colecao), dados);
  return docRef.id;
}

/**
 * Atualiza um documento existente.
 */
export async function update(colecao: string, id: string, dados: any) {
  const docRef = doc(db, colecao, id);
  await updateDoc(docRef, dados);
}

/**
 * Deleta um documento.
 */
export async function remove(colecao: string, id: string) {
  const docRef = doc(db, colecao, id);
  await deleteDoc(docRef);
}

// ==========================================
// FUNÇÕES ESPECÍFICAS (Exemplos para o seu app)
// ==========================================

export async function getUserProfile(uid: string) {
  // Mantemos o setDoc/getDoc direto para o usuário pois o ID do documento é o UID do Auth
  return await getById("users", uid);
}

export async function listarMaterias() {
  return await getAll("materias");
}

export async function listarPacotesDaMateria(materiaId: string) {
  // Exemplo de como você pode evoluir o código futuramente para buscar pacotes
  // que pertencem a uma matéria específica usando 'query' e 'where' do Firestore.
  // Por enquanto, retorna todos os pacotes:
  return await getAll("pacotes");
}
