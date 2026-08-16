import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer, selectPlayerRank, selectSortedLeaderboard } from './playersSlice';
import { CheckCircle2, XCircle, Flame, Trophy, Award } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function PlayerFeedback() {
  const player = useSelector(selectCurrentPlayer);
  const rank = useSelector(selectPlayerRank(player?.id));
  const leaderboard = useSelector(selectSortedLeaderboard);

  const isCorrect = player?.isCorrect;
  const pointsAdded = player?.lastPoints || 0;
  const totalScore = player?.score || 0;
  const streak = player?.streak || 0;

  useEffect(() => {
    if (isCorrect) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }
  }, [isCorrect]);

  if (!player) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-center text-center">
      <div
        className={`glass-panel p-8 rounded-3xl border-4 shadow-2xl space-y-6 ${
          isCorrect
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

        {/* Points Added */}
        {isCorrect && (
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/40">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Points Earned
            </div>
            <div className="text-4xl font-black text-emerald-400">
              +{pointsAdded.toLocaleString()}
            </div>
          </div>
        )}

        {/* Streak Bonus */}
        {streak > 1 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/50 text-sm font-extrabold animate-pulse">
            <Flame className="w-5 h-5 fill-orange-500" /> Answer Streak: {streak} in a row!
          </div>
        )}

        {/* Rank & Total Score */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card p-4 rounded-2xl border border-purple-500/30">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Current Rank
            </div>
            <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" /> #{rank || 1}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-purple-500/30">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Total Score
            </div>
            <div className="text-2xl font-black text-white">
              {totalScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
