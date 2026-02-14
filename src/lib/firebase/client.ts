import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA3kLoCuXAunN6KGeIu_76nLhBqKOwGyYA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "thesangathanapp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "thesangathanapp",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "thesangathanapp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "7338441945",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:7338441945:web:0bdf90348167aca1c1d2c8",
  measurementId: "G-MHMMN07YBY"
};

// Singleton pattern to avoid re-initialization
// We only initialize if we have a valid config, otherwise we might be in build time or missing envs
let app;
try {
  if (!getApps().length) {
    // Basic validation to prevent crash if config is empty
    if (!firebaseConfig.apiKey) {
      console.warn('Firebase Client: Missing API Key. Phone auth will fail.');
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error('Firebase Client Initialization Error:', error);
}

export const firebaseAuth = app ? getAuth(app) : null;
