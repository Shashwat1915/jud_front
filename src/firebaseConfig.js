import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOyS1LeMGs9G2dmq5lFgwSRsqgpnE7Sxg",
  authDomain: "judicioo.firebaseapp.com",
  projectId: "judicioo",
  storageBucket: "judicioo.firebasestorage.app",
  messagingSenderId: "1042230975032",
  appId: "1:1042230975032:web:a3767cae6df06f8da824cd",
  measurementId: "G-P929GLX0SL",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
