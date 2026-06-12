import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export async function cadastrarFirebase(email: string, senha: string) {
  return await createUserWithEmailAndPassword(auth, email, senha);
}

export async function loginFirebase(email: string, senha: string) {
  return await signInWithEmailAndPassword(auth, email, senha);
}
