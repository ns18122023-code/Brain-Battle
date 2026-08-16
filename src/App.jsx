import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';

// Quiz Slices
import { selectAllQuizzes } from './features/quiz/quizSlice';
import QuizList from './features/quiz/QuizList';
import QuizBuilder from './features/quiz/QuizBuilder';

// Game Slices & Components
import {
  setGameSession,
  setGameStatus,
  startQuestion,
  nextQuestion,
  resetGameSession,
  updateGameFromSync,
  selectGame,
  selectGamePin,
  selectGameStatus
} from './features/game/gameSlice';
import HostLobby from './features/game/HostLobby';
import HostQuestion from './features/game/HostQuestion';
import HostReveal from './features/game/HostReveal';
import HostLeaderboard from './features/game/HostLeaderboard';
import HostPodium from './features/game/HostPodium';

// Player Slices & Components
import {
  addPlayer,
  syncPlayersFromExternal,
  resetQuestionState,
  resetAllPlayers,
  selectPlayersMap,
  selectCurrentPlayer,
  setCurrentPlayer,
  togglePlayerReady
} from './features/player/playersSlice';
import PlayerJoin from './features/player/PlayerJoin';
import PlayerLobby from './features/player/PlayerLobby';
import PlayerQuestion from './features/player/PlayerQuestion';
import PlayerFeedback from './features/player/PlayerFeedback';
import PlayerPodium from './features/player/PlayerPodium';

// Sync Service
import { publishGameSync, subscribeToGameSync } from './services/syncService';

export default function App() {
  const dispatch = useDispatch();

  // Read URL query parameters for direct QR / PIN links
  const urlParams = new URLSearchParams(window.location.search);
  const queryPin = urlParams.get('pin');

  const quizzes = useSelector(selectAllQuizzes);
  const game = useSelector(selectGame);
  const gamePin = useSelector(selectGamePin);
  const gameStatus = useSelector(selectGameStatus);
  const playersMap = useSelector(selectPlayersMap);
  const currentPlayer = useSelector(selectCurrentPlayer);

  // App Modes: 'HOST_DASHBOARD' | 'HOST_BUILDER' | 'HOST_GAME' | 'PLAYER'
  const [appMode, setAppMode] = useState(queryPin ? 'PLAYER' : 'HOST_DASHBOARD');
  const [editingQuiz, setEditingQuiz] = useState(null);

  // 1. Subscribe to Real-Time Data Sync over ntfy.sh + Firebase + BroadcastChannel
  useEffect(() => {
    if (!gamePin) return;

    const unsubscribe = subscribeToGameSync(gamePin, (syncedData) => {
      if (!syncedData) return;

      // Handle Event: New Player Joined
      if (syncedData.type === 'PLAYER_JOINED' && syncedData.player) {
        dispatch(addPlayer(syncedData.player));

        // If I am the Host, re-publish full state so the joining player receives current status & quiz!
        if (appMode === 'HOST_GAME') {
          setTimeout(() => {
            const updatedMap = {
              ...playersMap,
              [syncedData.player.id]: syncedData.player
            };
            publishGameSync(gamePin, {
              type: 'SYNC_FULL_STATE',
              gamePin,
              status: gameStatus,
              quiz: game.quiz,
              currentQuestionIndex: game.currentQuestionIndex,
              timeRemaining: game.timeRemaining,
              isTimerActive: game.isTimerActive,
              playersMap: updatedMap
            });
          }, 100);
        }
        return;
      }

      // Update Redux Game state
      dispatch(updateGameFromSync(syncedData));

      // Update Redux Players state
      if (syncedData.playersMap) {
        dispatch(syncPlayersFromExternal(syncedData.playersMap));
      }
    });

    return () => unsubscribe();
  }, [gamePin, dispatch, appMode, gameStatus, game.quiz, game.currentQuestionIndex, game.timeRemaining, game.isTimerActive, playersMap]);

  // 1b. Auto-reconnect player if session exists in localStorage and matches queryPin
  useEffect(() => {
    if (queryPin) {
      const savedPin = localStorage.getItem('quiz_battle_game_pin');
      const savedPlayerId = localStorage.getItem('quiz_battle_player_id');
      
      if (savedPin === queryPin && savedPlayerId) {
        // Restore player ID in Redux
        dispatch(setCurrentPlayer(savedPlayerId));
        // Set gamePin in Redux to trigger subscription
        dispatch(updateGameFromSync({ gamePin: queryPin }));
      }
    }
  }, [queryPin, dispatch]);

  // Helper to publish Redux state updates to real-time sync channel
  const syncToCloud = (extraPayload = {}) => {
    if (!gamePin) return;
    const payload = {
      type: 'SYNC_FULL_STATE',
      gamePin,
      status: extraPayload.status || gameStatus,
      quiz: game.quiz,
      currentQuestionIndex: extraPayload.currentQuestionIndex !== undefined ? extraPayload.currentQuestionIndex : game.currentQuestionIndex,
      timeRemaining: extraPayload.timeRemaining !== undefined ? extraPayload.timeRemaining : game.timeRemaining,
      isTimerActive: extraPayload.isTimerActive !== undefined ? extraPayload.isTimerActive : game.isTimerActive,
      playersMap: extraPayload.playersMap || playersMap
    };
    publishGameSync(gamePin, payload);
  };

  // --- HOST ACTIONS ---
  const handleStartHostSession = (quiz) => {
    const generatedPin = String(Math.floor(100000 + Math.random() * 900000));
    dispatch(setGameSession({ gamePin: generatedPin, quiz }));
    dispatch(resetAllPlayers());
    setAppMode('HOST_GAME');

    // Publish initial lobby state
    publishGameSync(generatedPin, {
      type: 'SYNC_FULL_STATE',
      gamePin: generatedPin,
      status: 'LOBBY',
      quiz,
      currentQuestionIndex: 0,
      playersMap: {}
    });
  };

  const handleHostStartGame = () => {
    dispatch(resetQuestionState());
    dispatch(startQuestion(0));
    const nextState = {
      status: 'QUESTION',
      currentQuestionIndex: 0,
      playersMap
    };
    syncToCloud(nextState);
  };

  const handleQuestionExpired = () => {
    dispatch(setGameStatus('REVEAL'));
    syncToCloud({ status: 'REVEAL' });
  };

  const handleShowLeaderboard = () => {
    dispatch(setGameStatus('LEADERBOARD'));
    syncToCloud({ status: 'LEADERBOARD' });
  };

  const handleNextQuestion = () => {
    dispatch(resetQuestionState());
    dispatch(nextQuestion());
    
    // Check if game reached podium or next question
    const nextIndex = game.currentQuestionIndex + 1;
    if (nextIndex < (game.quiz?.questions?.length || 0)) {
      const nextState = {
        status: 'QUESTION',
        currentQuestionIndex: nextIndex,
        playersMap
      };
      syncToCloud(nextState);
    } else {
      dispatch(setGameStatus('PODIUM'));
      syncToCloud({ status: 'PODIUM' });
    }
  };

  // --- PLAYER ACTIONS ---
  const handlePlayerJoined = (enteredPin, playerData) => {
    dispatch(addPlayer(playerData));
    
    // Save player ID and PIN to localStorage for session persistence
    localStorage.setItem('quiz_battle_player_id', playerData.id);
    localStorage.setItem('quiz_battle_game_pin', enteredPin);
    
    // Dispatch gamePin to Redux so player starts syncing immediately
    dispatch(updateGameFromSync({ gamePin: enteredPin }));
    
    // Publish PLAYER_JOINED event to cloud pub/sub channel
    publishGameSync(enteredPin, {
      type: 'PLAYER_JOINED',
      gamePin: enteredPin,
      player: playerData
    });
  };

  const handlePlayerAnswerSubmitted = () => {
    // Sync answer submission back to host real-time layer
    setTimeout(() => {
      syncToCloud();
    }, 100);
  };

  const handlePlayerToggleReady = () => {
    if (currentPlayer && gamePin) {
      const updatedPlayers = {
        ...playersMap,
        [currentPlayer.id]: {
          ...playersMap[currentPlayer.id],
          isReady: !playersMap[currentPlayer.id]?.isReady
        }
      };
      
      // Toggle locally
      dispatch(togglePlayerReady(currentPlayer.id));
      // Publish to cloud
      publishGameSync(gamePin, { playersMap: updatedPlayers });
    }
  };

  // --- QUICK DEMO MULTI-TAB LAUNCHER ---
  const handleLaunchQuickDemo = () => {
    const sampleQuiz = quizzes[0];
    if (!sampleQuiz) return;

    const demoPin = String(Math.floor(100000 + Math.random() * 900000));
    dispatch(setGameSession({ gamePin: demoPin, quiz: sampleQuiz }));
    dispatch(resetAllPlayers());

    // Pre-populate 2 demo players
    const demoPlayers = {
      'p_alex': { id: 'p_alex', nickname: 'Alex ⚡', avatar: '🦊', score: 0, streak: 0, lastPoints: 0, answeredCurrentQuestion: false },
      'p_sam': { id: 'p_sam', nickname: 'Sam 🚀', avatar: '👾', score: 0, streak: 0, lastPoints: 0, answeredCurrentQuestion: false }
    };
    dispatch(syncPlayersFromExternal(demoPlayers));

    setAppMode('HOST_GAME');
    publishGameSync(demoPin, {
      gamePin: demoPin,
      status: 'LOBBY',
      quiz: sampleQuiz,
      currentQuestionIndex: 0,
      playersMap: demoPlayers
    });

    // Open a second tab pre-configured as Player
    const playerUrl = `${window.location.origin}${window.location.pathname}?pin=${demoPin}`;
    window.open(playerUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar
        activeMode={appMode}
        onSwitchMode={(mode) => setAppMode(mode)}
        onLaunchDemo={handleLaunchQuickDemo}
      />

      <main className="flex-1">
        {/* MODE 1: HOST DASHBOARD (Quiz List) */}
        {appMode === 'HOST_DASHBOARD' && (
          <QuizList
            onCreateNew={() => {
              setEditingQuiz(null);
              setAppMode('HOST_BUILDER');
            }}
            onEditQuiz={(quiz) => {
              setEditingQuiz(quiz);
              setAppMode('HOST_BUILDER');
            }}
            onStartGame={handleStartHostSession}
          />
        )}

        {/* MODE 2: HOST QUIZ BUILDER */}
        {appMode === 'HOST_BUILDER' && (
          <QuizBuilder
            initialQuiz={editingQuiz}
            onCancel={() => setAppMode('HOST_DASHBOARD')}
            onSaved={() => setAppMode('HOST_DASHBOARD')}
          />
        )}

        {/* MODE 3: HOST GAME CONTROLLER LOOP */}
        {appMode === 'HOST_GAME' && (
          <>
            {gameStatus === 'LOBBY' && (
              <HostLobby onStartGame={handleHostStartGame} />
            )}

            {gameStatus === 'QUESTION' && (
              <HostQuestion
                onTimeExpired={handleQuestionExpired}
                onEndQuestionEarly={handleQuestionExpired}
              />
            )}

            {gameStatus === 'REVEAL' && (
              <HostReveal onShowLeaderboard={handleShowLeaderboard} />
            )}

            {gameStatus === 'LEADERBOARD' && (
              <HostLeaderboard onNext={handleNextQuestion} />
            )}

            {gameStatus === 'PODIUM' && (
              <HostPodium
                onPlayAgain={() => {
                  if (game.quiz) handleStartHostSession(game.quiz);
                }}
                onBackHome={() => {
                  dispatch(resetGameSession());
                  setAppMode('HOST_DASHBOARD');
                }}
              />
            )}
          </>
        )}

        {/* MODE 4: PLAYER CLIENT CONTROLLER LOOP */}
        {appMode === 'PLAYER' && (
          <>
            {!currentPlayer ? (
              <PlayerJoin initialPin={queryPin} onJoined={handlePlayerJoined} />
            ) : (
              <>
                {gameStatus === 'LOBBY' && (
                  <PlayerLobby gamePin={gamePin} onToggleReady={handlePlayerToggleReady} />
                )}

                {gameStatus === 'QUESTION' && (
                  <PlayerQuestion onAnswerSubmitted={handlePlayerAnswerSubmitted} />
                )}

                {(gameStatus === 'REVEAL' || gameStatus === 'LEADERBOARD') && (
                  <PlayerFeedback />
                )}

                {gameStatus === 'PODIUM' && (
                  <PlayerPodium
                    onPlayAgain={() => {
                      // Clear player session on game exit / restart
                      localStorage.removeItem('quiz_battle_player_id');
                      localStorage.removeItem('quiz_battle_game_pin');
                      dispatch(resetAllPlayers());
                      window.location.href = window.location.pathname;
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
