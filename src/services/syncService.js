import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

const channels = {};

function getBroadcastChannel(gamePin) {
  if (!channels[gamePin]) {
    try {
      channels[gamePin] = new BroadcastChannel(`quiz_battle_${gamePin}`);
    } catch (e) {
      console.warn("BroadcastChannel not supported in browser", e);
    }
  }
  return channels[gamePin];
}

/**
 * Publish game update to Firebase Firestore and BroadcastChannel
 */
export async function publishGameSync(gamePin, payload) {
  if (!gamePin) return;

  const fullData = {
    ...payload,
    updatedAt: Date.now()
  };

  // 1. BroadcastChannel (for sub-millisecond local multi-tab sync)
  const bc = getBroadcastChannel(gamePin);
  if (bc) {
    bc.postMessage(fullData);
  }

  // 2. LocalStorage backup sync for multi-tab state fallback
  try {
    localStorage.setItem(`quiz_battle_state_${gamePin}`, JSON.stringify(fullData));
  } catch (e) {
    // Ignore storage quota errors
  }

  // 3. Firebase Firestore Real-Time Cloud Sync
  if (isFirebaseReady && db) {
    try {
      const gameRef = doc(db, 'games', String(gamePin));
      await setDoc(gameRef, fullData, { merge: true });
    } catch (err) {
      console.warn("Firestore sync update note:", err.message);
    }
  }
}

/**
 * Subscribe to Game updates from Firebase Firestore & local channel
 */
export function subscribeToGameSync(gamePin, onUpdateCallback) {
  if (!gamePin) return () => {};

  const unsubscribes = [];

  // 1. Listen to Local BroadcastChannel
  const bc = getBroadcastChannel(gamePin);
  if (bc) {
    const handleBcMessage = (event) => {
      if (event.data) {
        onUpdateCallback(event.data);
      }
    };
    bc.addEventListener('message', handleBcMessage);
    unsubscribes.push(() => bc.removeEventListener('message', handleBcMessage));
  }

  // 2. Listen to window storage events
  const handleStorage = (event) => {
    if (event.key === `quiz_battle_state_${gamePin}` && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        onUpdateCallback(parsed);
      } catch (e) {}
    }
  };
  window.addEventListener('storage', handleStorage);
  unsubscribes.push(() => window.removeEventListener('storage', handleStorage));

  // 3. Listen to Firebase Firestore `onSnapshot`
  if (isFirebaseReady && db) {
    try {
      const gameRef = doc(db, 'games', String(gamePin));
      const unsubFs = onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
          onUpdateCallback(docSnap.data());
        }
      }, (error) => {
        console.warn("Firestore snapshot listener note:", error.message);
      });
      unsubscribes.push(unsubFs);
    } catch (e) {
      console.warn("Firestore subscription error:", e.message);
    }
  }

  // Initial fetch check from localStorage
  try {
    const cached = localStorage.getItem(`quiz_battle_state_${gamePin}`);
    if (cached) {
      onUpdateCallback(JSON.parse(cached));
    }
  } catch (e) {}

  return () => {
    unsubscribes.forEach((unsub) => {
      try { unsub(); } catch (e) {}
    });
  };
}
