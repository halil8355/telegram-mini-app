import { db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function getUserData(uid) {
  const ref = doc(db, "users", uid);
  const docSnap = await getDoc(ref);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setDefaultUser(uid) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { exp: 0, pickaxeLevel: 0, shovelLevel: 0 });
}

export async function addExp(uid, amount) {
  const ref = doc(db, "users", uid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    let exp = docSnap.data().exp || 0;
    await updateDoc(ref, { exp: exp + amount });
  }
}

export async function upgradeTool(uid, toolType) {
  const ref = doc(db, "users", uid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    let level = docSnap.data()[toolType] || 0;
    await updateDoc(ref, { [toolType]: level + 1 });
  }
}