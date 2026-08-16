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
 * Publish game update to ntfy.sh (Cross-Device Cloud Relay), Firebase Firestore, and BroadcastChannel
 */
export async function publishGameSync(gamePin, payload) {
  if (!gamePin) return;

  const fullData = {
    ...payload,
    gamePin,
    updatedAt: Date.now()
  };

  // 1. BroadcastChannel (for sub-millisecond local multi-tab sync on same browser)
  const bc = getBroadcastChannel(gamePin);
  if (bc) {
    try {
      bc.postMessage(fullData);
    } catch (e) {}
  }

  // 2. LocalStorage backup sync for multi-tab state fallback
  try {
    localStorage.setItem(`quiz_battle_state_${gamePin}`, JSON.stringify(fullData));
  } catch (e) {
    // Ignore storage quota errors
  }

  // 3. ntfy.sh Zero-Config Global Cloud Relay (Works across physical phones, PCs, and different networks worldwide!)
  try {
    fetch(`https://ntfy.sh/quiz_battle_pin_${gamePin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    }).catch(() => {});
  } catch (e) {}

  // 4. Firebase Firestore Real-Time Cloud Sync (if configured with valid keys)
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
 * Subscribe to Game updates from ntfy.sh, Firebase Firestore, BroadcastChannel & LocalStorage
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

  // 3. Listen to ntfy.sh Global Cloud Relay SSE (Server-Sent Events) for real-time mobile/cross-device sync
  try {
    const sseUrl = `https://ntfy.sh/quiz_battle_pin_${gamePin}/json`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'message' && data.message) {
          const payload = JSON.parse(data.message);
          onUpdateCallback(payload);
        }
      } catch (e) {}
    };

    unsubscribes.push(() => {
      try {
        eventSource.close();
      } catch (e) {}
    });
  } catch (e) {
    console.warn("ntfy subscription error:", e.message);
  }

  // 4. Listen to Firebase Firestore `onSnapshot` (if configured)
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

