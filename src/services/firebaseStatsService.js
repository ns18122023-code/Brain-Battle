import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  increment,
  addDoc
} from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

/**
 * Firebase Player Stats Service
 * Handles player statistics and game history persistence
 */

/**
 * Create or update player profile in Firebase
 * @param {string} playerId - Unique player ID
 * @param {Object} playerData - Player data (nickname, avatar, etc)
 * @returns {Promise<Object>} - Updated player data
 */
export async function savePlayerToFirebase(playerId, playerData) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, skipping player save');
    return playerData;
  }

  try {
    const playerRef = doc(db, 'players', playerId);
    const firestoreData = {
      ...playerData,
      updatedAt: serverTimestamp(),
      lastSeen: serverTimestamp()
    };

    await setDoc(playerRef, firestoreData, { merge: true });
    console.log(`✅ Player saved to Firebase: ${playerId}`);
    return firestoreData;
  } catch (error) {
    console.error('❌ Error saving player to Firebase:', error.message);
    return playerData;
  }
}

/**
 * Get player profile from Firebase
 * @param {string} playerId - Player ID
 * @returns {Promise<Object|null>} - Player data or null
 */
export async function getPlayerFromFirebase(playerId) {
  if (!isFirebaseReady || !db) {
    return null;
  }

  try {
    const playerRef = doc(db, 'players', playerId);
    const snapshot = await getDoc(playerRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error loading player from Firebase:', error.message);
    return null;
  }
}

/**
 * Update player statistics after game completion
 * @param {string} playerId - Player ID
 * @param {Object} gameStats - Stats object with score, streak, etc
 * @returns {Promise<void>}
 */
export async function updatePlayerStats(playerId, gameStats) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, skipping stats update');
    return;
  }

  try {
    const playerRef = doc(db, 'players', playerId);
    
    const update = {
      updatedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      totalScore: increment(gameStats.score || 0),
      gamesPlayed: increment(1),
      bestStreak: Math.max(gameStats.streak || 0, gameStats.bestStreak || 0),
      correctAnswers: increment(gameStats.correctAnswers || 0),
      totalAnswers: increment(gameStats.totalAnswers || 0)
    };

    await updateDoc(playerRef, update);
    console.log(`✅ Player stats updated in Firebase: ${playerId}`);
  } catch (error) {
    console.error('❌ Error updating player stats in Firebase:', error.message);
  }
}

/**
 * Save a game session/result to Firebase
 * @param {string} gamePin - Game PIN
 * @param {Object} gameData - Complete game data with results
 * @returns {Promise<string>} - Document ID of saved session
 */
export async function saveGameSessionToFirebase(gamePin, gameData) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, skipping game session save');
    return null;
  }

  try {
    const sessionsRef = collection(db, 'gameSessions');
    const sessionDoc = {
      gamePin,
      quizId: gameData.quizId,
      quizTitle: gameData.quizTitle,
      hostId: gameData.hostId,
      players: gameData.players || {},
      finalResults: gameData.finalResults || [],
      totalDuration: gameData.totalDuration,
      questionsCount: gameData.questionsCount,
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      status: 'completed'
    };

    const docRef = await addDoc(sessionsRef, sessionDoc);
    console.log(`✅ Game session saved to Firebase: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving game session to Firebase:', error.message);
    return null;
  }
}

/**
 * Save individual player answer for analytics
 * @param {string} gamePin - Game PIN
 * @param {string} playerId - Player ID
 * @param {Object} answerData - Answer details (questionIndex, selectedOption, isCorrect, timeRemaining, etc)
 * @returns {Promise<void>}
 */
export async function savePlayerAnswerToFirebase(gamePin, playerId, answerData) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, skipping answer save');
    return;
  }

  try {
    const answersRef = collection(db, 'gameAnswers');
    const answer = {
      gamePin,
      playerId,
      questionIndex: answerData.questionIndex,
      selectedOption: answerData.selectedOption,
      isCorrect: answerData.isCorrect,
      timeRemaining: answerData.timeRemaining,
      pointsEarned: answerData.pointsEarned || 0,
      streak: answerData.streak || 0,
      timestamp: serverTimestamp()
    };

    await addDoc(answersRef, answer);
    console.log(`✅ Player answer saved to Firebase: ${gamePin}/${playerId}`);
  } catch (error) {
    console.error('❌ Error saving player answer to Firebase:', error.message);
  }
}

/**
 * Get player's game history
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} - Array of game sessions
 */
export async function getPlayerGameHistory(playerId) {
  if (!isFirebaseReady || !db) {
    return [];
  }

  try {
    // This would require a more complex query implementation
    // For now, we'll return an empty array as a placeholder
    console.log(`Fetching game history for player: ${playerId}`);
    return [];
  } catch (error) {
    console.error('❌ Error fetching player game history:', error.message);
    return [];
  }
}

export default {
  savePlayerToFirebase,
  getPlayerFromFirebase,
  updatePlayerStats,
  saveGameSessionToFirebase,
  savePlayerAnswerToFirebase,
  getPlayerGameHistory
};
