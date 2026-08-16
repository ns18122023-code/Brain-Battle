import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gamePin: null,
  status: 'IDLE', // 'IDLE' | 'LOBBY' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'PODIUM'
  quiz: null,
  currentQuestionIndex: 0,
  timeRemaining: 20,
  questionStartTime: null, // Wall-clock timestamp when question started
  isTimerActive: false,
  hostId: null,
  updatedAt: 0
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameSession: (state, action) => {
      state.gamePin = action.payload.gamePin;
      state.quiz = action.payload.quiz;
      state.status = 'LOBBY';
      state.currentQuestionIndex = 0;
      state.questionStartTime = null;
      state.hostId = action.payload.hostId || 'host_' + Date.now();
      state.updatedAt = Date.now();
    },
    setGameStatus: (state, action) => {
      state.status = action.payload;
      state.updatedAt = Date.now();
    },
    startQuestion: (state, action) => {
      const qIndex = action.payload !== undefined ? action.payload : state.currentQuestionIndex;
      state.currentQuestionIndex = qIndex;
      state.status = 'QUESTION';
      const question = state.quiz?.questions?.[qIndex];
      state.timeRemaining = question?.timeLimit || 20;
      state.questionStartTime = Date.now();
      state.isTimerActive = true;
      state.updatedAt = Date.now();
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.isTimerActive = false;
      }
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    stopTimer: (state) => {
      state.isTimerActive = false;
    },
    nextQuestion: (state) => {
      if (state.quiz && state.currentQuestionIndex + 1 < state.quiz.questions.length) {
        state.currentQuestionIndex += 1;
        state.status = 'QUESTION';
        const question = state.quiz.questions[state.currentQuestionIndex];
        state.timeRemaining = question?.timeLimit || 20;
        state.questionStartTime = Date.now();
        state.isTimerActive = true;
      } else {
        state.status = 'PODIUM';
        state.isTimerActive = false;
        state.questionStartTime = null;
      }
      state.updatedAt = Date.now();
    },
    resetGameSession: () => initialState,
    // Sync external payload into Redux
    updateGameFromSync: (state, action) => {
      const payload = action.payload;
      if (!payload) return;
      if (payload.status) state.status = payload.status;
      if (payload.gamePin) state.gamePin = payload.gamePin;
      if (payload.quiz) state.quiz = payload.quiz;
      if (payload.currentQuestionIndex !== undefined) state.currentQuestionIndex = payload.currentQuestionIndex;
      if (payload.questionStartTime) state.questionStartTime = payload.questionStartTime;
      if (payload.timeRemaining !== undefined && !state.questionStartTime) {
        state.timeRemaining = payload.timeRemaining;
      }
      if (payload.isTimerActive !== undefined) state.isTimerActive = payload.isTimerActive;
      state.updatedAt = payload.updatedAt || Date.now();
    }
  }
});

export const {
  setGameSession,
  setGameStatus,
  startQuestion,
  decrementTimer,
  setTimeRemaining,
  stopTimer,
  nextQuestion,
  resetGameSession,
  updateGameFromSync
} = gameSlice.actions;

// Selectors
export const selectGame = (state) => state.game;
export const selectGamePin = (state) => state.game.gamePin;
export const selectGameStatus = (state) => state.game.status;
export const selectCurrentQuestionIndex = (state) => state.game.currentQuestionIndex;

// Derived selector for current active question
export const selectCurrentQuestion = (state) => {
  const { quiz, currentQuestionIndex } = state.game;
  if (!quiz || !quiz.questions || currentQuestionIndex >= quiz.questions.length) {
    return null;
  }
  return quiz.questions[currentQuestionIndex];
};

export const selectTimeRemaining = (state) => state.game.timeRemaining;
export const selectQuestionStartTime = (state) => state.game.questionStartTime;
export const selectIsTimerActive = (state) => state.game.isTimerActive;

export default gameSlice.reducer;

