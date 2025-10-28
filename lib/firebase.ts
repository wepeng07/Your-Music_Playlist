import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAuXFMKRzs2zVvoVePD73k3dpnCtgUaoGg",
  authDomain: "yourmusicplaylist-3dfbe.firebaseapp.com",
  projectId: "yourmusicplaylist-3dfbe",
  storageBucket: "yourmusicplaylist-3dfbe.firebasestorage.app",
  messagingSenderId: "126624172059",
  appId: "1:126624172059:web:e9838abfbe31bebda050be",
  measurementId: "G-P8V4VJZEW8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
