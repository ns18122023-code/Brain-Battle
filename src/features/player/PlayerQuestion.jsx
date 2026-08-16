import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentQuestion, selectTimeRemaining, selectQuestionStartTime, selectCurrentQuestionIndex, selectGame } from '../game/gameSlice';
import { selectCurrentPlayer, submitAnswerThunk } from './playersSlice';
import { Clock, CheckCircle } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function PlayerQuestion({ onAnswerSubmitted }) {
  const dispatch = useDispatch();

  const game = useSelector(selectGame);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const questionIndex = useSelector(selectCurrentQuestionIndex);
  const timeRemainingRedux = useSelector(selectTimeRemaining);
  const questionStartTime = useSelector(selectQuestionStartTime);
  const player = useSelector(selectCurrentPlayer);

  const totalTime = currentQuestion?.timeLimit || 20;
  const hasAnswered = player?.answeredCurrentQuestion;
  const [displayTime, setDisplayTime] = useState(totalTime);

  useEffect(() => {
    const startTime = questionStartTime || Date.now();
    const updateTimer = () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, totalTime - elapsedSec);
      setDisplayTime(remaining);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [questionStartTime, totalTime]);

  if (!currentQuestion) return null;

  const percentage = (displayTime / totalTime) * 100;

  const handleSelectOption = (index) => {
    if (!player || player.answeredCurrentQuestion) return;

    soundFx.playSelect();

    const selectedOption = currentQuestion.options[index];
    const isCorrect = Boolean(selectedOption?.isCorrect);

    dispatch(
      submitAnswerThunk({
        playerId: player.id,
        optionIndex: index,
        timeRemaining: displayTime,
        totalTime,
        isCorrect
      })
    ).then(() => {
      if (onAnswerSubmitted) onAnswerSubmitted();
    });
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!player || hasAnswered || !currentQuestion) return;

      let optionIdx = -1;
      if (e.key === '1') optionIdx = 0;
      else if (e.key === '2') optionIdx = 1;
      else if (e.key === '3') optionIdx = 2;
      else if (e.key === '4') optionIdx = 3;

      if (optionIdx >= 0 && optionIdx < (currentQuestion.options?.length || 0)) {
        if (currentQuestion.type === 'true_false' && optionIdx >= 2) return;
        handleSelectOption(optionIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, hasAnswered, currentQuestion, displayTime]);

  const optionStyles = [
    { name: 'Red', bg: 'kahoot-btn-red', icon: '▲' },
    { name: 'Blue', bg: 'kahoot-btn-blue', icon: '◆' },
    { name: 'Yellow', bg: 'kahoot-btn-yellow', icon: '●' },
    { name: 'Green', bg: 'kahoot-btn-green', icon: '■' }
  ];

  // Dynamic progress bar color
  let barColor = 'bg-linear-to-r from-emerald-500 to-teal-400';
  if (displayTime <= 5) {
    barColor = 'bg-linear-to-r from-red-500 to-pink-500 animate-pulse';
  } else if (displayTime <= 10) {
    barColor = 'bg-linear-to-r from-amber-500 to-orange-400';
  }

  // Calculate locked speed
  const lockedTime = player?.answerTimeRemaining !== null && player?.answerTimeRemaining !== undefined
    ? totalTime - player.answerTimeRemaining
    : totalTime - displayTime;

  return (
    <div className="max-w-md mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Header & Visual Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-purple-500/30">
          <span className="px-3 py-1 bg-purple-600 font-extrabold text-white text-xs rounded-lg">
            Q{questionIndex + 1} of {game.quiz?.questions?.length || 1}
          </span>

          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
            <Clock className="w-4 h-4" /> {displayTime}s Left
          </div>
        </div>

        {/* Visual Countdown Timer Bar */}
        {!hasAnswered && (
          <div className="w-full h-2.5 bg-slate-900/60 rounded-full overflow-hidden border border-slate-900 shadow-inner">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Answer Lock State vs Active Buttons */}
      {hasAnswered ? (
        <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 text-center space-y-4 my-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white">Answer Locked!</h3>
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 font-extrabold text-xs border border-emerald-500/20 shadow-md">
            ⚡ Locked in {lockedTime}s!
          </div>

          <p className="text-slate-400 text-[11px] font-semibold tracking-wide">
            Waiting for other players or timer to finish...
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <div className="text-center font-bold text-slate-350 text-xs uppercase tracking-wider mb-2">
            Select your answer (Shortcuts: keys 1-4)
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, idx) => {
              if (currentQuestion.type === 'true_false' && idx >= 2) return null;
              const style = optionStyles[idx % optionStyles.length];

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`h-36 sm:h-44 rounded-3xl ${style.bg} flex flex-col items-center justify-center transition-all cursor-pointer transform active:scale-95 text-white font-black shadow-2xl hover:brightness-110 hover:shadow-purple-500/10`}
                >
                  <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-md">{style.icon}</span>
                  <span className="text-xs sm:text-sm px-2 text-center font-extrabold opacity-95 line-clamp-2">
                    {opt.text || style.name}
                  </span>
                  <span className="text-[9px] uppercase font-bold opacity-40 mt-1 bg-black/20 px-2 py-0.5 rounded-md">
                    Key {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
