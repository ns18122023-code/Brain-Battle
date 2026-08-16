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

  const optionStyles = [
    { name: 'Red', bg: 'kahoot-btn-red', icon: '▲' },
    { name: 'Blue', bg: 'kahoot-btn-blue', icon: '◆' },
    { name: 'Yellow', bg: 'kahoot-btn-yellow', icon: '●' },
    { name: 'Green', bg: 'kahoot-btn-green', icon: '■' }
  ];

  const hasAnswered = player?.answeredCurrentQuestion;

  return (
    <div className="max-w-md mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-purple-500/30">
        <span className="px-3 py-1 bg-purple-600 font-extrabold text-white text-xs rounded-lg">
          Q{questionIndex + 1} of {game.quiz?.questions?.length || 1}
        </span>

        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
          <Clock className="w-4 h-4" /> {displayTime}s Left
        </div>
      </div>

      {/* Answer Lock State vs Active Buttons */}
      {hasAnswered ? (
        <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white">Answer Locked!</h3>
          <p className="text-slate-300 text-xs font-semibold">
            Waiting for all players or timer to finish...
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <div className="text-center font-bold text-slate-300 text-sm mb-2">
            Select your answer on your phone!
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, idx) => {
              if (currentQuestion.type === 'true_false' && idx >= 2) return null;
              const style = optionStyles[idx % optionStyles.length];

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`h-36 sm:h-44 rounded-3xl ${style.bg} flex flex-col items-center justify-center transition-all cursor-pointer transform active:scale-95 text-white font-black shadow-2xl hover:brightness-110`}
                >
                  <span className="text-4xl sm:text-5xl mb-2">{style.icon}</span>
                  <span className="text-xs sm:text-sm px-2 text-center font-extrabold opacity-90 line-clamp-2">
                    {opt.text || style.name}
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
