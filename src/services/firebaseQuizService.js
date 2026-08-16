import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

/**
 * Firebase Quiz Service
 * Handles all CRUD operations for quizzes in Firestore
 */

/**
 * Save a quiz to Firestore
 * @param {Object} quizData - Quiz object with id, title, description, category, questions, coverImage
 * @returns {Promise<Object>} - The saved quiz data
 */
export async function saveQuizToFirebase(quizData) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, using local storage only');
    return quizData;
  }

  try {
    const quizRef = doc(db, 'quizzes', quizData.id);
    const firestoreData = {
      ...quizData,
      createdAt: quizData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      isArchived: false
    };

    await setDoc(quizRef, firestoreData, { merge: true });
    console.log(`✅ Quiz saved to Firebase: ${quizData.id}`);
    return firestoreData;
  } catch (error) {
    console.error('❌ Error saving quiz to Firebase:', error.message);
    throw error;
  }
}

/**
 * Load a single quiz from Firestore
 * @param {string} quizId - The quiz ID
 * @returns {Promise<Object|null>} - The quiz data or null if not found
 */
export async function getQuizFromFirebase(quizId) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready');
    return null;
  }

  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const snapshot = await getDoc(quizRef);

    if (snapshot.exists()) {
      console.log(`✅ Quiz loaded from Firebase: ${quizId}`);
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error loading quiz from Firebase:', error.message);
    return null;
  }
}

/**
 * Load all quizzes from Firestore
 * @returns {Promise<Array>} - Array of quiz objects
 */
export async function getAllQuizzesFromFirebase() {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready');
    return [];
  }

  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(quiz => !quiz.isArchived);

    console.log(`✅ Loaded ${quizzes.length} quizzes from Firebase`);
    return quizzes;
  } catch (error) {
    console.error('❌ Error loading quizzes from Firebase:', error.message);
    return [];
  }
}

/**
 * Delete a quiz from Firestore (soft delete - archives it)
 * @param {string} quizId - The quiz ID
 * @returns {Promise<void>}
 */
export async function deleteQuizFromFirebase(quizId) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, skipping Firebase deletion');
    return;
  }

  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, {
      isArchived: true,
      archivedAt: serverTimestamp()
    });
    console.log(`✅ Quiz archived in Firebase: ${quizId}`);
  } catch (error) {
    console.error('❌ Error deleting quiz from Firebase:', error.message);
    throw error;
  }
}

/**
 * Sync quizzes from local storage to Firebase
 * @param {Array} localQuizzes - Array of quizzes from local storage
 * @returns {Promise<Array>} - The synced quizzes
 */
export async function syncQuizzesToFirebase(localQuizzes) {
  if (!isFirebaseReady || !db) {
    console.warn('Firebase not ready, cannot sync quizzes');
    return localQuizzes;
  }

  try {
    const syncedQuizzes = [];
    for (const quiz of localQuizzes) {
      await saveQuizToFirebase(quiz);
      syncedQuizzes.push(quiz);
    }
    console.log(`✅ Synced ${syncedQuizzes.length} quizzes to Firebase`);
    return syncedQuizzes;
  } catch (error) {
    console.error('❌ Error syncing quizzes to Firebase:', error.message);
    return localQuizzes;
  }
}

export default {
  saveQuizToFirebase,
  getQuizFromFirebase,
  getAllQuizzesFromFirebase,
  deleteQuizFromFirebase,
  syncQuizzesToFirebase
};
