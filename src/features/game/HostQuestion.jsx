import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectTimeRemaining,
  selectQuestionStartTime,
  selectGame,
  setTimeRemaining,
  decrementTimer
} from './gameSlice';
import { selectAnsweredCount, selectPlayerCount } from '../player/playersSlice';
import { Clock, Users, SkipForward } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function HostQuestion({ onTimeExpired, onEndQuestionEarly }) {
  const dispatch = useDispatch();

  const game = useSelector(selectGame);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const questionIndex = useSelector(selectCurrentQuestionIndex);
  const timeRemainingRedux = useSelector(selectTimeRemaining);
  const questionStartTime = useSelector(selectQuestionStartTime);
  const answeredCount = useSelector(selectAnsweredCount);
  const playerCount = useSelector(selectPlayerCount);

  const totalQuestions = game.quiz?.questions?.length || 1;
  const totalTime = currentQuestion?.timeLimit || 20;

  const [displayTime, setDisplayTime] = useState(totalTime);

  // Robust Timestamp-Based Countdown Effect
  useEffect(() => {
    const startTime = questionStartTime || Date.now();

    const updateTimer = () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, totalTime - elapsedSec);
      
      setDisplayTime(remaining);
      dispatch(setTimeRemaining(remaining));

      if (remaining <= 5 && remaining > 0) {
        soundFx.playTick();
      }

      if (remaining === 0) {
        onTimeExpired();
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 500);

    return () => clearInterval(interval);
  }, [questionStartTime, totalTime, dispatch, onTimeExpired]);

  // Auto-expire question if all players have submitted answers
  useEffect(() => {
    if (playerCount > 0 && answeredCount >= playerCount) {
      onTimeExpired();
    }
  }, [answeredCount, playerCount, onTimeExpired]);

  // Fallback UI if question data is missing/malformed (prevents blank screen)
  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-white">Question Data Not Available</h2>
          <p className="text-slate-300 text-sm">
            Question #{questionIndex + 1} could not be loaded or has no valid question content.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onEndQuestionEarly && onEndQuestionEarly()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer shadow-lg"
            >
              Skip Question ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  const optionStyles = [
    { name: 'Red', bg: 'kahoot-btn-red', icon: '▲' },
    { name: 'Blue', bg: 'kahoot-btn-blue', icon: '◆' },
    { name: 'Yellow', bg: 'kahoot-btn-yellow', icon: '●' },
    { name: 'Green', bg: 'kahoot-btn-green', icon: '■' }
  ];

  const timerPercentage = (displayTime / totalTime) * 100;
  const safeOptions = Array.isArray(currentQuestion.options) ? currentQuestion.options : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-purple-500/30">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-xl bg-purple-600 font-extrabold text-white text-sm">
            Question {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-slate-400 text-xs font-semibold uppercase">
            {currentQuestion.type === 'true_false' ? 'True / False' : 'Multiple Choice'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-1.5 rounded-xl border border-slate-700">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="font-extrabold text-white text-sm">
              {answeredCount} / {playerCount} Answered
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playSelect();
              onEndQuestionEarly();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <SkipForward className="w-4 h-4" /> End Early
          </button>
        </div>
      </div>

      {/* Main Question & Timer Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Circular Timer */}
        <div className="md:col-span-3 flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`fill-none transition-all duration-1000 ${
                  displayTime <= 5 ? 'stroke-red-500' : 'stroke-purple-500'
                }`}
                strokeWidth="10"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * timerPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className={`text-4xl font-black ${displayTime <= 5 ? 'text-red-400 animate-ping' : 'text-white'}`}>
                {displayTime}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Sec Left</div>
            </div>
          </div>
        </div>

        {/* Question Text Box */}
        <div className="md:col-span-9 glass-panel p-8 rounded-3xl border-2 border-purple-500/40 text-center flex items-center justify-center min-h-40">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {currentQuestion.question || '(No Question Text)'}
          </h2>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {safeOptions.map((opt, idx) => {
          if (currentQuestion.type === 'true_false' && idx >= 2) return null;
          const style = optionStyles[idx % optionStyles.length];

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl ${style.bg} text-white flex items-center gap-4 transition-all duration-300 font-extrabold text-xl shadow-xl`}
            >
              <span className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-2xl shrink-0">
                {style.icon}
              </span>
              <span className="truncate">{opt?.text || `Option ${idx + 1}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
