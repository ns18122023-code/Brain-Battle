import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { calculateSpeedPoints } from '../../utils/scoring';

// Async Thunk: Submit Player Answer with Speed & Streak bonus calculation
export const submitAnswerThunk = createAsyncThunk(
  'players/submitAnswer',
  async ({ playerId, optionIndex, timeRemaining, totalTime, isCorrect }, { getState, rejectWithValue }) => {
    try {
      const state = getState().players;
      const player = state.players[playerId];
      
      if (!player) throw new Error("Player not found");
      if (player.answeredCurrentQuestion) return player; // Already answered

      const pointsEarned = isCorrect ? calculateSpeedPoints(timeRemaining, totalTime) : 0;
      const newStreak = isCorrect ? (player.streak || 0) + 1 : 0;
      const streakBonus = isCorrect && newStreak > 1 ? Math.min(newStreak * 100, 500) : 0;
      const totalAdded = pointsEarned + streakBonus;

      const updatedPlayer = {
        ...player,
        score: player.score + totalAdded,
        streak: newStreak,
        lastPoints: totalAdded,
        lastAnswerIndex: optionIndex,
        isCorrect: isCorrect,
        answeredCurrentQuestion: true,
        answerTimeRemaining: timeRemaining
      };

      return updatedPlayer;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    players: {}, // Keyed by playerId
    currentPlayerId: null
  },
  reducers: {
    setCurrentPlayer: (state, action) => {
      state.currentPlayerId = action.payload;
    },
    addPlayer: (state, action) => {
      const { id, nickname, avatar } = action.payload;
      state.players[id] = {
        id,
        nickname,
        avatar: avatar || '🚀',
        score: 0,
        streak: 0,
        lastPoints: 0,
        lastAnswerIndex: null,
        isCorrect: null,
        answeredCurrentQuestion: false,
        answerTimeRemaining: null
      };
    },
    resetQuestionState: (state) => {
      Object.keys(state.players).forEach((id) => {
        state.players[id].lastAnswerIndex = null;
        state.players[id].isCorrect = null;
        state.players[id].answeredCurrentQuestion = false;
        state.players[id].lastPoints = 0;
        state.players[id].answerTimeRemaining = null;
      });
    },
    resetAllPlayers: (state) => {
      state.players = {};
      state.currentPlayerId = null;
    },
    syncPlayersFromExternal: (state, action) => {
      if (action.payload) {
        state.players = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(submitAnswerThunk.fulfilled, (state, action) => {
      const updatedPlayer = action.payload;
      state.players[updatedPlayer.id] = updatedPlayer;
    });
  }
});

export const {
  setCurrentPlayer,
  addPlayer,
  resetQuestionState,
  resetAllPlayers,
  syncPlayersFromExternal
} = playersSlice.actions;

// Selectors
export const selectPlayersMap = (state) => state.players.players;
export const selectCurrentPlayerId = (state) => state.players.currentPlayerId;

// Derived Selector: Current Active Player Object
export const selectCurrentPlayer = createSelector(
  [selectPlayersMap, selectCurrentPlayerId],
  (players, currentId) => (currentId ? players[currentId] : null)
);

// Derived Selector: Sorted Leaderboard array by Score (descending)
export const selectSortedLeaderboard = createSelector(
  [selectPlayersMap],
  (playersMap) => {
    const list = Object.values(playersMap || {});
    return list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.streak - a.streak;
    });
  }
);

// Derived Selector: Total players joined
export const selectPlayerCount = createSelector(
  [selectPlayersMap],
  (playersMap) => Object.keys(playersMap || {}).length
);

// Derived Selector: Count of players who have answered the active question
export const selectAnsweredCount = createSelector(
  [selectPlayersMap],
  (playersMap) => Object.values(playersMap || {}).filter(p => p.answeredCurrentQuestion).length
);

// Derived Selector: Distribution of answers (for bar chart reveal)
export const selectAnswerDistribution = createSelector(
  [selectPlayersMap],
  (playersMap) => {
    const counts = [0, 0, 0, 0];
    Object.values(playersMap || {}).forEach((p) => {
      if (p.lastAnswerIndex !== null && p.lastAnswerIndex >= 0 && p.lastAnswerIndex < 4) {
        counts[p.lastAnswerIndex] += 1;
      }
    });
    return counts;
  }
);

// Derived Selector: Rank of a specific player
export const selectPlayerRank = (playerId) => createSelector(
  [selectSortedLeaderboard],
  (sortedList) => {
    const index = sortedList.findIndex(p => p.id === playerId);
    return index >= 0 ? index + 1 : null;
  }
);

export default playersSlice.reducer;
