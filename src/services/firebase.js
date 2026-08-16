import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const isFirebaseReady = true;

export { db, isFirebaseReady };

// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

// // Default Firebase Configuration (Users can replace with their own Firebase credentials)
// const firebaseConfig = {
//   apiKey: "AIzaSyDemoConfigKeyForQuizBattleApp2026",
//   authDomain: "quiz-battle-kahoot.firebaseapp.com",
//   projectId: "quiz-battle-kahoot",
//   storageBucket: "quiz-battle-kahoot.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:demo1234567890"
// };

// let app = null;
// let db = null;
// let isFirebaseReady = false;

// try {
//   app = initializeApp(firebaseConfig);
//   db = getFirestore(app);
//   isFirebaseReady = true;
//   console.log("🔥 Firebase initialized successfully!");
// } catch (error) {
//   console.warn("Firebase initialization warning (using local real-time sync mode):", error.message);
// }

// export { db, isFirebaseReady };
