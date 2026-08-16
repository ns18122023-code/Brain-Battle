import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import quizBg from './assets/quiz_bg.png';

// Quiz Slices
import { selectAllQuizzes, fetchQuizzes } from './features/quiz/quizSlice';
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

  // Ref container for latest state inside event listeners
  const stateRef = useRef({});
  stateRef.current = { appMode, gameStatus, game, playersMap };
  const lastSyncTimestampRef = useRef(0);

  // 0. Initialize Firebase & Load Quizzes on App Mount
  useEffect(() => {
    console.log('🚀 Initializing Brain Battle App...');
    console.log('📱 Current Mode:', appMode);
    
    // Load quizzes from Firebase (with localStorage fallback)
    dispatch(fetchQuizzes()).catch(err => 
      console.error('Failed to load quizzes:', err.message)
    );
  }, []);

  // 1. Subscribe to Real-Time Data Sync over ntfy.sh + Firebase + BroadcastChannel
  useEffect(() => {
    if (!gamePin) return;

    const unsubscribe = subscribeToGameSync(gamePin, (syncedData) => {
      if (!syncedData) return;

      // Deduplicate updates by timestamp to avoid redundant processing from multiple channels (ntfy, Firestore, BroadcastChannel, localStorage)
      if (syncedData.updatedAt && syncedData.updatedAt <= lastSyncTimestampRef.current) {
        return;
      }
      if (syncedData.updatedAt) {
        lastSyncTimestampRef.current = syncedData.updatedAt;
      }

      const { appMode: currentAppMode, gameStatus: currentStatus, game: currentGame, playersMap: currentPlayers } = stateRef.current;

      // Handle Event: New Player Joined
      if (syncedData.type === 'PLAYER_JOINED' && syncedData.player) {
        dispatch(addPlayer(syncedData.player));

        // If I am the Host, re-publish full state so the joining player receives current status & quiz!
        if (currentAppMode === 'HOST_GAME') {
          setTimeout(() => {
            const updatedMap = {
              ...currentPlayers,
              [syncedData.player.id]: syncedData.player
            };
            publishGameSync(gamePin, {
              type: 'SYNC_FULL_STATE',
              gamePin,
              status: currentStatus,
              quiz: currentGame.quiz,
              currentQuestionIndex: currentGame.currentQuestionIndex,
              questionStartTime: currentGame.questionStartTime,
              timeRemaining: currentGame.timeRemaining,
              isTimerActive: currentGame.isTimerActive,
              playersMap: updatedMap
            });
          }, 100);
        }
        return;
      }

      // Handle Event: Player Submitted Answer
      if (syncedData.type === 'PLAYER_ANSWER_SUBMITTED' && syncedData.playerId && syncedData.playerData) {
        if (currentAppMode === 'HOST_GAME') {
          dispatch(syncPlayersFromExternal({
            [syncedData.playerId]: syncedData.playerData
          }));

          setTimeout(() => {
            const updatedMap = {
              ...stateRef.current.playersMap,
              [syncedData.playerId]: syncedData.playerData
            };
            publishGameSync(gamePin, {
              type: 'SYNC_FULL_STATE',
              gamePin,
              status: currentStatus,
              quiz: currentGame.quiz,
              currentQuestionIndex: currentGame.currentQuestionIndex,
              questionStartTime: currentGame.questionStartTime,
              timeRemaining: currentGame.timeRemaining,
              isTimerActive: currentGame.isTimerActive,
              playersMap: updatedMap
            });
          }, 100);
        }
        return;
      }

      // Handle Event: Player Ready Toggled
      if (syncedData.type === 'PLAYER_READY_TOGGLED' && syncedData.playerId) {
        if (currentAppMode === 'HOST_GAME') {
          const updatedPlayer = {
            ...currentPlayers[syncedData.playerId],
            isReady: syncedData.isReady
          };
          dispatch(syncPlayersFromExternal({
            [syncedData.playerId]: updatedPlayer
          }));

          setTimeout(() => {
            const updatedMap = {
              ...stateRef.current.playersMap,
              [syncedData.playerId]: updatedPlayer
            };
            publishGameSync(gamePin, {
              type: 'SYNC_FULL_STATE',
              gamePin,
              status: currentStatus,
              quiz: currentGame.quiz,
              currentQuestionIndex: currentGame.currentQuestionIndex,
              questionStartTime: currentGame.questionStartTime,
              timeRemaining: currentGame.timeRemaining,
              isTimerActive: currentGame.isTimerActive,
              playersMap: updatedMap
            });
          }, 100);
        }
        return;
      }

      // If Host, ignore SYNC_FULL_STATE from other clients to prevent state corruption
      if (syncedData.type === 'SYNC_FULL_STATE' && currentAppMode === 'HOST_GAME') {
        return;
      }

      // If current client is Host and has playersMap sync, update from external sync
      if (currentAppMode === 'HOST_GAME' && syncedData.playersMap) {
        dispatch(syncPlayersFromExternal(syncedData.playersMap));
      }

      // If question index changed for a question state, reset player answered status locally
      if (syncedData.status === 'QUESTION' && syncedData.currentQuestionIndex !== undefined) {
        if (stateRef.current.game.currentQuestionIndex !== syncedData.currentQuestionIndex) {
          dispatch(resetQuestionState());
        }
      }

      // Update Redux Game state
      dispatch(updateGameFromSync(syncedData));

      // Update Redux Players state
      if (syncedData.playersMap) {
        dispatch(syncPlayersFromExternal(syncedData.playersMap));
      }
    });

    return () => unsubscribe();
  }, [gamePin, dispatch]);

  // Helper to clear active session storage
  const clearActiveSession = () => {
    try {
      sessionStorage.removeItem('quiz_battle_active_session');
      sessionStorage.removeItem('quiz_battle_game_pin');
      sessionStorage.removeItem('quiz_battle_player_id');
      localStorage.removeItem('quiz_battle_active_session');
      localStorage.removeItem('quiz_battle_game_pin');
      localStorage.removeItem('quiz_battle_player_id');
    } catch (e) {}
  };

  // 1b. Smart Session Persistence: Auto-resume active game on page reload for both Host and Player (Tab Isolated)
  useEffect(() => {
    try {
      const activeSessionRaw = sessionStorage.getItem('quiz_battle_active_session') || localStorage.getItem('quiz_battle_active_session');
      if (activeSessionRaw) {
        const activeSession = JSON.parse(activeSessionRaw);

        if (activeSession && activeSession.gamePin) {
          const cachedStateRaw = localStorage.getItem(`quiz_battle_state_${activeSession.gamePin}`);
          const cachedState = cachedStateRaw ? JSON.parse(cachedStateRaw) : null;

          // Check if session is still active (not finished / PODIUM)
          if (cachedState && cachedState.status && cachedState.status !== 'PODIUM') {
            // Restore Host active session
            if (activeSession.role === 'HOST') {
              dispatch(setGameSession({
                gamePin: activeSession.gamePin,
                quiz: cachedState.quiz
              }));
              dispatch(updateGameFromSync(cachedState));
              setAppMode('HOST_GAME');
              console.log('🔄 Resumed active Host session for Game PIN:', activeSession.gamePin);
              return;
            }

            // Restore Player active session
            if (activeSession.role === 'PLAYER' && activeSession.playerId) {
              dispatch(setCurrentPlayer(activeSession.playerId));
              dispatch(updateGameFromSync({
                gamePin: activeSession.gamePin,
                quiz: cachedState.quiz,
                status: cachedState.status,
                currentQuestionIndex: cachedState.currentQuestionIndex,
                questionStartTime: cachedState.questionStartTime
              }));
              setAppMode('PLAYER');
              console.log('🔄 Resumed active Player session for Game PIN:', activeSession.gamePin);
              return;
            }
          } else {
            // Session was completed or stale -> clear it
            clearActiveSession();
          }
        }
      }
    } catch (e) {
      console.warn('Could not restore session:', e);
    }
  }, [dispatch]);

  // Helper to construct clean reset players map for new questions
  const getResetPlayersMap = (currentMap) => {
    const cleanMap = {};
    Object.keys(currentMap || {}).forEach((id) => {
      cleanMap[id] = {
        ...currentMap[id],
        answeredCurrentQuestion: false,
        lastAnswerIndex: null,
        isCorrect: null,
        lastPoints: 0,
        lastBasePoints: 0,
        lastStreakBonus: 0,
        answerTimeRemaining: null
      };
    });
    return cleanMap;
  };

  // Helper to publish Redux state updates to real-time sync channel
  const syncToCloud = (extraPayload = {}) => {
    if (!gamePin) return;
    const payload = {
      type: 'SYNC_FULL_STATE',
      gamePin,
      status: extraPayload.status || gameStatus,
      quiz: extraPayload.quiz || game.quiz,
      currentQuestionIndex: extraPayload.currentQuestionIndex !== undefined ? extraPayload.currentQuestionIndex : game.currentQuestionIndex,
      questionStartTime: extraPayload.questionStartTime !== undefined ? extraPayload.questionStartTime : game.questionStartTime,
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

    // Save tab-isolated active session for Host persistence
    try {
      const sessionData = JSON.stringify({
        role: 'HOST',
        gamePin: generatedPin,
        appMode: 'HOST_GAME'
      });
      sessionStorage.setItem('quiz_battle_active_session', sessionData);
    } catch (e) {}

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
    const now = Date.now();
    const cleanMap = getResetPlayersMap(playersMap);
    const nextState = {
      type: 'SYNC_FULL_STATE',
      status: 'QUESTION',
      currentQuestionIndex: 0,
      questionStartTime: now,
      quiz: game.quiz,
      playersMap: cleanMap
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
      const now = Date.now();
      const cleanMap = getResetPlayersMap(playersMap);
      const nextState = {
        type: 'SYNC_FULL_STATE',
        status: 'QUESTION',
        currentQuestionIndex: nextIndex,
        questionStartTime: now,
        quiz: game.quiz,
        playersMap: cleanMap
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
    
    // Save tab-isolated player ID, PIN, and active session to sessionStorage for session persistence
    try {
      const sessionData = JSON.stringify({
        role: 'PLAYER',
        gamePin: enteredPin,
        appMode: 'PLAYER',
        playerId: playerData.id
      });
      sessionStorage.setItem('quiz_battle_active_session', sessionData);
      sessionStorage.setItem('quiz_battle_player_id', playerData.id);
      sessionStorage.setItem('quiz_battle_game_pin', enteredPin);
    } catch (e) {}
    
    // Dispatch gamePin to Redux so player starts syncing immediately
    dispatch(updateGameFromSync({ gamePin: enteredPin }));
    
    // Publish PLAYER_JOINED event to cloud pub/sub channel
    publishGameSync(enteredPin, {
      type: 'PLAYER_JOINED',
      gamePin: enteredPin,
      player: playerData
    });
  };

  const handlePlayerAnswerSubmitted = (updatedPlayerData) => {
    if (currentPlayer && gamePin && updatedPlayerData) {
      publishGameSync(gamePin, {
        type: 'PLAYER_ANSWER_SUBMITTED',
        gamePin,
        playerId: currentPlayer.id,
        playerData: updatedPlayerData
      });
    }
  };
 
  const handlePlayerToggleReady = () => {
    if (currentPlayer && gamePin) {
      const isReady = !playersMap[currentPlayer.id]?.isReady;
      
      // Toggle locally
      dispatch(togglePlayerReady(currentPlayer.id));
      
      // Publish event to cloud
      publishGameSync(gamePin, {
        type: 'PLAYER_READY_TOGGLED',
        gamePin,
        playerId: currentPlayer.id,
        isReady
      });
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
    <div className="min-h-screen flex flex-col text-slate-100 font-sans relative overflow-x-hidden bg-slate-950">
      {/* Fixed Blurred Quiz Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(3, 7, 18, 0.82)), url(${quizBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(7px) brightness(95%) contrast(110%)',
          transform: 'scale(1.05)'
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar
          activeMode={appMode}
          onSwitchMode={(mode) => {
            if (mode === 'HOST_DASHBOARD' || mode === 'PLAYER') {
              clearActiveSession();
              dispatch(resetGameSession());
            }
            setAppMode(mode);
          }}
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
                  clearActiveSession();
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
                      clearActiveSession();
                      dispatch(resetAllPlayers());
                      dispatch(resetGameSession());
                      setAppMode('PLAYER');
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
    </div>
  );
}
