import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer, selectPlayerRank } from './playersSlice';
import { CheckCircle2, XCircle, Flame, Trophy } from 'lucide-react';
import { soundFx } from '../../services/soundService';

// Animated Points Count-Up Component
function AnimatedCounter({ to, duration = 1000 }) {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const end = parseInt(to, 10);
    if (isNaN(end) || end <= 0) {
      setCount(0);
      return;
    }
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16); // ~60fps
    return () => clearInterval(timer);
  }, [to, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function PlayerFeedback() {
  const player = useSelector(selectCurrentPlayer);
  const rank = useSelector(selectPlayerRank(player?.id));

  const isCorrect = player?.isCorrect;
  const pointsAdded = player?.lastPoints || 0;
  const totalScore = player?.score || 0;
  const streak = player?.streak || 0;

  // Rank difference calculation
  const prevRank = player?.previousRank;
  const currentRank = rank || 1;
  const rankDiff = prevRank ? prevRank - currentRank : 0;

  useEffect(() => {
    if (isCorrect) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }
  }, [isCorrect]);

  if (!player) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-center text-center animate-fade-in">
      <div
        className={`glass-panel p-8 rounded-3xl border-4 shadow-2xl space-y-6 transition-all duration-500 ${isCorrect
            ? 'border-emerald-500 bg-emerald-950/30'
            : 'border-red-500 bg-red-950/30'
          }`}
      >
        {/* Banner */}
        <div className="space-y-2">
          {isCorrect ? (
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12" />
            </div>
          )}

          <h2 className="text-3xl font-black text-white">
            {isCorrect ? 'Correct! 🎉' : 'Incorrect ❌'}
          </h2>
        </div>

        {/* Points Added & Breakdown */}
        {isCorrect && (
          <div className="space-y-3">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/40 shadow-inner">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Points Earned
              </div>
              <div className="text-4xl font-black text-emerald-400">
                +<AnimatedCounter to={pointsAdded} />
              </div>
            </div>

            {/* Detailed Points Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-900 font-semibold text-slate-400">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">⏱️ Speed Score</span>
                <span className="text-white font-extrabold text-sm">+{player.lastBasePoints || 0}</span>
              </div>
              <div className="flex flex-col border-l border-slate-900 pl-3">
                <span className="text-[10px] uppercase font-bold text-slate-500">🔥 Streak Bonus</span>
                <span className="text-orange-400 font-extrabold text-sm">+{player.lastStreakBonus || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Streak Bonus */}
        {streak > 1 && (
          <>
            <style>{`
              @keyframes flame-glow {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(249, 115, 22, 0.6)); }
                50% { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(249, 115, 22, 1)); }
              }
              .animate-flame-burn {
                animation: flame-glow 1.2s infinite ease-in-out;
              }
            `}</style>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-sm font-extrabold animate-flame-burn">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" /> Answer Streak: {streak} in a row!
            </div>
          </>
        )}

        {/* Rank & Total Score */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 flex flex-col justify-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Current Rank
            </div>
            <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" /> #{currentRank}
            </div>
            {prevRank !== null && prevRank !== undefined && (
              <div className="text-[10px] font-extrabold mt-1">
                {rankDiff > 0 ? (
                  <span className="text-emerald-400">▲ {rankDiff} Ranks Up</span>
                ) : rankDiff < 0 ? (
                  <span className="text-red-400">▼ {Math.abs(rankDiff)} Ranks Down</span>
                ) : (
                  <span className="text-slate-400">➖ No Change</span>
                )}
              </div>
            )}
          </div>

          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 flex flex-col justify-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Total Score
            </div>
            <div className="text-2xl font-black text-white">
              {totalScore.toLocaleString()}
            </div>
            <div className="text-[10px] font-extrabold text-slate-500 mt-1 uppercase">
              Points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
