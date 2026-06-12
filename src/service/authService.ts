import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Agora a função recebe os dados extras do usuário
export async function cadastrarFirebase(
  email: string,
  senha: string,
  nome: string,
  genero: string,
) {
  // 1. Cria o usuário na Autenticação do Firebase
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    senha,
  );
  const user = userCredential.user;

  // 2. Salva o nome e o gênero no Firestore, usando o UID como ID do documento
  await setDoc(doc(db, "users", user.uid), {
    nome: nome,
    genero: genero,
    email: email,
  });

  return userCredential;
}

export async function loginFirebase(email: string, senha: string) {
  return await signInWithEmailAndPassword(auth, email, senha);
}
