import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_QUIZZES } from '../../utils/sampleQuizzes';
import { saveQuizToFirebase, deleteQuizFromFirebase, getAllQuizzesFromFirebase } from '../../services/firebaseQuizService';

const LOCAL_STORAGE_KEY = 'quiz_battle_quizzes_v2';
const INITIAL_QUIZ_IDS = new Set(INITIAL_QUIZZES.map(q => q.id));

// Helper to merge INITIAL_QUIZZES with any custom user or Firebase quizzes (no duplicates)
const mergeWithInitialQuizzes = (fetchedQuizzes) => {
  const map = new Map();
  INITIAL_QUIZZES.forEach(q => map.set(q.id, q));
  if (Array.isArray(fetchedQuizzes)) {
    fetchedQuizzes.forEach(q => {
      if (q && q.id && !INITIAL_QUIZ_IDS.has(q.id)) {
        map.set(q.id, q);
      }
    });
  }
  return Array.from(map.values());
};

// Load initial quizzes from LocalStorage or default samples, merging any custom user quizzes
const loadStoredQuizzes = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return mergeWithInitialQuizzes(parsed);
      }
    }
  } catch (e) {}
  return INITIAL_QUIZZES;
};

// Async Thunk: Fetch Quizzes (from Firebase first, fallback to localStorage)
export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      // Try to fetch from Firebase first
      const firebaseQuizzes = await getAllQuizzesFromFirebase();
      let rawQuizzes = [];

      if (firebaseQuizzes && firebaseQuizzes.length > 0) {
        console.log('📚 Loaded quizzes from Firebase');
        rawQuizzes = firebaseQuizzes;
      } else {
        console.log('📚 Loaded quizzes from localStorage');
        rawQuizzes = loadStoredQuizzes();
      }

      const mergedQuizzes = mergeWithInitialQuizzes(rawQuizzes);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedQuizzes));
      return mergedQuizzes;
    } catch (err) {
      console.error('Error fetching quizzes:', err.message);
      return mergeWithInitialQuizzes(loadStoredQuizzes());
    }
  }
);

// Async Thunk: Save Quiz (to both Firebase and localStorage)
export const saveQuizAsync = createAsyncThunk(
  'quiz/saveQuizAsync',
  async (quizData, { getState, rejectWithValue }) => {
    try {
      const state = getState().quiz;
      let updatedQuizzes;

      const existingIndex = state.quizzes.findIndex(q => q.id === quizData.id);
      if (existingIndex >= 0) {
        updatedQuizzes = state.quizzes.map(q => q.id === quizData.id ? quizData : q);
      } else {
        updatedQuizzes = [quizData, ...state.quizzes];
      }

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQuizzes));

      // Try to save to Firebase (async, don't wait)
      saveQuizToFirebase(quizData).catch(err =>
        console.warn('Could not save quiz to Firebase:', err.message)
      );

      return quizData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk: Delete Quiz (from both Firebase and localStorage)
export const deleteQuizAsync = createAsyncThunk(
  'quiz/deleteQuizAsync',
  async (quizId, { getState, rejectWithValue }) => {
    try {
      const state = getState().quiz;
      const updated = state.quizzes.filter(q => q.id !== quizId);

      // Update localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

      // Try to delete from Firebase (async, don't wait)
      deleteQuizFromFirebase(quizId).catch(err =>
        console.warn('Could not delete quiz from Firebase:', err.message)
      );

      return quizId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: loadStoredQuizzes(),
    activeQuiz: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    setActiveQuiz: (state, action) => {
      state.activeQuiz = action.payload;
    },
    resetActiveQuiz: (state) => {
      state.activeQuiz = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = mergeWithInitialQuizzes(action.payload);
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Save Quiz
      .addCase(saveQuizAsync.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(q => q.id === action.payload.id);
        if (index >= 0) {
          state.quizzes[index] = action.payload;
        } else {
          state.quizzes.unshift(action.payload);
        }
        if (state.activeQuiz?.id === action.payload.id) {
          state.activeQuiz = action.payload;
        }
      })
      // Delete Quiz
      .addCase(deleteQuizAsync.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
        if (state.activeQuiz?.id === action.payload) {
          state.activeQuiz = null;
        }
      });
  }
});

export const { setActiveQuiz, resetActiveQuiz } = quizSlice.actions;

// Selectors
export const selectAllQuizzes = (state) => state.quiz.quizzes;
export const selectActiveQuiz = (state) => state.quiz.activeQuiz;
export const selectQuizById = (id) => (state) => state.quiz.quizzes.find(q => q.id === id);

export default quizSlice.reducer;
