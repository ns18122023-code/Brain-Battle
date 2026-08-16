# 🎯 Quiz Battle — Kahoot Clone

Welcome to **Quiz Battle**, a real-time multiplayer Kahoot clone built with **React**, **Redux Toolkit**, **Firebase**, and **Tailwind CSS**.

---

## 🚀 Key Features

- **Host Experience**:
  - Quiz Builder: Create & edit custom quizzes (MCQ & True/False, custom timers, point values).
  - PIN Generator & QR Code: Instant 6-digit PIN and mobile QR code for easy player joining.
  - Live Game Flow: Start game -> Question view with countdown SVG timer -> Instant answer breakdown chart -> Animated Leaderboard -> 3D Podium reveal with confetti & fanfare!
- **Player Experience**:
  - Mobile-responsive interface featuring classic Kahoot colored shape buttons (Red Triangle ▲, Blue Diamond ◆, Yellow Circle ●, Green Square ■).
  - Speed-based scoring algorithm (up to 1,000 points based on answer speed).
  - Consecutive Answer Streak bonuses 🔥.
  - Instant correct/incorrect feedback & live rank display.
- **Real-Time Multiplayer Sync**:
  - Cloud synchronization powered by Firebase Firestore `onSnapshot` real-time listeners.
  - Dual Sync Adapter with local BroadcastChannel support for instant multi-tab testing across browser windows.
- **Audio & Visual Effects**:
  - Synthesized Web Audio API sound effects (countdown clock ticking, answer selection, correct chime, wrong buzzer, podium fanfare).
  - Celebration confetti cannon via `canvas-confetti`.

---

## 🧠 Redux Toolkit Architecture

Our state management is cleanly structured into 3 distinct slices under `src/features/`:

### 1. `quizSlice` (`src/features/quiz/quizSlice.js`)
- **Purpose**: Manages the library of quizzes, CRUD operations, and active quiz selection.
- **Async Thunks**:
  - `fetchQuizzes`: Asynchronously loads quizzes from storage or pre-loaded samples.
  - `saveQuizAsync`: Saves newly created or updated quizzes to persistent storage.
  - `deleteQuizAsync`: Removes a quiz from the library.
- **Reducers**: `setActiveQuiz`, `resetActiveQuiz`.

### 2. `gameSlice` (`src/features/game/gameSlice.js`)
- **Purpose**: Controls the game session state machine and live countdown timer.
- **State Fields**: `gamePin`, `status` (`'IDLE' | 'LOBBY' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'PODIUM'`), `currentQuestionIndex`, `timeRemaining`, `isTimerActive`.
- **Reducers**: `setGameSession`, `setGameStatus`, `startQuestion`, `decrementTimer`, `nextQuestion`, `updateGameFromSync`.
- **Derived Selectors**: `selectCurrentQuestion` (derives active question object based on index).

### 3. `playersSlice` (`src/features/player/playersSlice.js`)
- **Purpose**: Manages joined players, scores, answer selections, and streak counters.
- **Async Thunks**:
  - `submitAnswerThunk`: Calculates speed-based points (`Math.round(1000 * timeRemaining / totalTime)`), updates streak multiplier, and locks answer state.
- **Derived Selectors**:
  - `selectSortedLeaderboard`: Computes descending leaderboard array by score and streak tie-breaker.
  - `selectPlayerRank`: Computes a player's live rank position.
  - `selectAnswerDistribution`: Computes answer counts across choices for host chart reveal.

---

## 🔥 Firebase Data Structure

Each game session is stored under the `games/{gamePin}` collection in Firebase Firestore:

```json
{
  "gamePin": "849201",
  "status": "QUESTION",
  "currentQuestionIndex": 0,
  "timeRemaining": 18,
  "isTimerActive": true,
  "quiz": {
    "id": "quiz-react-redux",
    "title": "React + Redux Master Challenge",
    "questions": [ ... ]
  },
  "playersMap": {
    "player_1776315": {
      "id": "player_1776315",
      "nickname": "SpeedDemon",
      "avatar": "⚡",
      "score": 950,
      "streak": 1,
      "lastPoints": 950,
      "lastAnswerIndex": 0,
      "isCorrect": true,
      "answeredCurrentQuestion": true
    }
  },
  "updatedAt": 1776315200000
}
```

---

## 🛠️ Local Setup & Running

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open App**:
   - Open `http://localhost:5173` in your browser.
   - Click **"Quick Multi-Tab Demo"** on the navigation bar to automatically start a host session and open a second player tab!

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📝 Documentation & Quality Assurance

- **Documentation (README)**: Documented with assistance from GitHub Copilot.
- **Codacy Review**: Clean component structure, pure state reducers, and typed prop flow.
- **Error Bot Integration**: Error handling and boundary checks implemented across thunks and audio synthesizers.
