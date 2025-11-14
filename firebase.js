import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-Vic2z53CmxTxGK2aS0o8by5rM9GfP8o",
  authDomain: "kaylin-68c93.firebaseapp.com",
  projectId: "kaylin-68c93",
  storageBucket: "kaylin-68c93.firebasestorage.app",
  messagingSenderId: "216553651563",
  appId: "1:216553651563:web:277b05b11a95ed9fb3602e",
  measurementId: "G-NNRDYYJY7W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);