
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase client config — these are public by design.
// Security is enforced by Firestore rules, not by keeping these values secret.
// Previously used process.env.NEXT_PUBLIC_* which is undefined in Vite,
// causing all Firestore reads to silently fail in production.
const firebaseConfig = {
  apiKey: "AIzaSyCw1CKeLk3f80CEqfv-5Pnm_u5h_o4E44M",
  authDomain: "canteen-roulette.firebaseapp.com",
  projectId: "canteen-roulette",
  storageBucket: "canteen-roulette.firebasestorage.app",
  messagingSenderId: "1017822425092",
  appId: "1:1017822425092:web:38c18cb6bd875173e38551",
  measurementId: "G-MR0MLBQC15"
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
