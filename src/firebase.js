// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7qDhpWxGQKgRGMK7MGjT2MBZF1EAGfLI",
  authDomain: "netlify-a7bd7.firebaseapp.com",
  projectId: "netlify-a7bd7",
  storageBucket: "netlify-a7bd7.firebasestorage.app",
  messagingSenderId: "241532446970",
  appId: "1:241532446970:web:c5acff2320a8a986044143",
  measurementId: "G-ZRD38MG6X2"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
