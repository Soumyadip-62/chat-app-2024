import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBb_YlMcZuz8NWmyV1F2ejmRLB1SHYf8_s",
  authDomain: "chat-2024-6897a.firebaseapp.com",
  projectId: "chat-2024-6897a",
  storageBucket: "chat-2024-6897a.appspot.com",
  messagingSenderId: "837498699064",
  appId: "1:837498699064:web:d700aa4a28dcea666295cd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, setDoc, serverTimestamp, getDoc, addDoc };
