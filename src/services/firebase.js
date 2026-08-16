import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

// Default Firebase Configuration (Users can replace with their own Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDemoConfigKeyForQuizBattleApp2026",
  authDomain: "quiz-battle-kahoot.firebaseapp.com",
  projectId: "quiz-battle-kahoot",
  storageBucket: "quiz-battle-kahoot.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo1234567890"
};

let app = null;
let db = null;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseReady = true;
  console.log("🔥 Firebase initialized successfully!");
} catch (error) {
  console.warn("Firebase initialization warning (using local real-time sync mode):", error.message);
}

export { db, isFirebaseReady };
