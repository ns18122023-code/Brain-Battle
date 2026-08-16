import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_QUIZZES } from '../../utils/sampleQuizzes';
import { saveQuizToFirebase, deleteQuizFromFirebase, getAllQuizzesFromFirebase } from '../../services/firebaseQuizService';

const LOCAL_STORAGE_KEY = 'quiz_battle_quizzes_v1';

// Load initial quizzes from LocalStorage or default samples
const loadStoredQuizzes = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
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
      
      if (firebaseQuizzes && firebaseQuizzes.length > 0) {
        console.log('📚 Loaded quizzes from Firebase');
        // Also sync to localStorage for offline access
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firebaseQuizzes));
        return firebaseQuizzes;
      }

      // Fallback to localStorage
      console.log('📚 Loaded quizzes from localStorage');
      const localQuizzes = loadStoredQuizzes();
      
      // If we have quizzes, try to sync them to Firebase
      if (localQuizzes.length > 0) {
        setTimeout(() => {
          localQuizzes.forEach(quiz => {
            saveQuizToFirebase(quiz).catch(err => 
              console.warn('Could not sync quiz to Firebase:', err.message)
            );
          });
        }, 1000);
      }
      
      return localQuizzes;
    } catch (err) {
      console.error('Error fetching quizzes:', err.message);
      // Last resort: return localStorage data
      return loadStoredQuizzes();
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
        state.quizzes = action.payload;
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
