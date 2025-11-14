import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";

export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
export function logout() {
  return signOut(auth);
}