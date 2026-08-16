import{ configureStore } from '@reduxjs/toolkit';
import quizReducer from '../features/quiz/quizSlice';
import gameReducer from '../features/game/gameSlice';
import playersReducer from '../features/player/playersSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    game: gameReducer,
    players: playersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
