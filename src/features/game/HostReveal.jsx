import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentQuestion } from './gameSlice';
import { selectAnswerDistribution, selectAnsweredCount } from '../player/playersSlice';
import { Check, ArrowRight, BarChart2 } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function HostReveal({ onShowLeaderboard }) {
  const currentQuestion = useSelector(selectCurrentQuestion);
  const distribution = useSelector(selectAnswerDistribution);
  const totalAnswers = useSelector(selectAnsweredCount);

  useEffect(() => {
    soundFx.playCorrect();
  }, []);

  if (!currentQuestion) return null;

  const optionStyles = [
    { bg: 'bg-red-600', border: 'border-red-400', icon: '▲', label: 'Red' },
    { bg: 'bg-blue-600', border: 'border-blue-400', icon: '◆', label: 'Blue' },
    { bg: 'bg-amber-600', border: 'border-amber-400', icon: '●', label: 'Yellow' },
    { bg: 'bg-emerald-600', border: 'border-emerald-400', icon: '■', label: 'Green' }
  ];

  const maxVotes = Math.max(...distribution, 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase">
          <BarChart2 className="w-4 h-4" /> Answer Breakdown
        </span>
        <h2 className="text-2xl font-extrabold text-white">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answer Distribution Bar Chart */}
      <div className="glass-panel p-8 rounded-3xl border-2 border-purple-500/30 flex-1 flex flex-col justify-end space-y-6">
        <div className="grid grid-cols-4 gap-4 items-end h-64 border-b border-slate-700 pb-4">
          {currentQuestion.options.map((opt, idx) => {
            if (currentQuestion.type === 'true_false' && idx >= 2) return null;
            const count = distribution[idx] || 0;
            const heightPercent = Math.round((count / maxVotes) * 100);
            const style = optionStyles[idx % optionStyles.length];
            const isCorrect = opt.isCorrect;

            return (
              <div key={idx} className="flex flex-col items-center gap-3 h-full justify-end group">
                <span className="text-lg font-black text-white">{count}</span>
                <div
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  className={`w-full rounded-t-2xl ${style.bg} transition-all duration-700 relative flex items-center justify-center ${
                    isCorrect ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-slate-950 shadow-xl' : 'opacity-75'
                  }`}
                >
                  {isCorrect && (
                    <div className="absolute -top-4 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <span className="text-sm">{style.icon}</span>
                  <span className="truncate max-w-[100px]">{opt.text || `Option ${idx + 1}`}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-slate-400 text-sm font-medium pt-2">
          <span>Total Responses: <strong className="text-white">{totalAnswers}</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-4 h-4" /> Correct Answer Highlighted
          </span>
        </div>
      </div>

      {/* Next Leaderboard Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            soundFx.playSelect();
            onShowLeaderboard();
          }}
          className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-purple-950/60 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          View Leaderboard <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
