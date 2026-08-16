import React from 'react';
import { useSelector } from 'react-redux';
import { selectSortedLeaderboard } from '../player/playersSlice';
import { selectCurrentQuestionIndex, selectGame } from './gameSlice';
import { Trophy, Flame, ArrowRight, Award } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function HostLeaderboard({ onNext }) {
  const sortedPlayers = useSelector(selectSortedLeaderboard);
  const currentQIndex = useSelector(selectCurrentQuestionIndex);
  const game = useSelector(selectGame);

  const totalQuestions = game.quiz?.questions?.length || 1;
  const isLastQuestion = currentQIndex + 1 >= totalQuestions;
  const topFive = sortedPlayers.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-between space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
          <Trophy className="w-5 h-5" /> Scoreboard Standings
        </div>
        <h2 className="text-3xl font-black text-white">
          Leaderboard
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          After Question {currentQIndex + 1} of {totalQuestions}
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-purple-500/30 space-y-3 flex-1">
        {topFive.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            No player scores recorded yet.
          </div>
        ) : (
          topFive.map((player, idx) => {
            const rankColors = [
              'bg-gradient-to-r from-amber-500/30 to-yellow-600/30 border-amber-400/50 text-amber-300',
              'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-300/40 text-slate-200',
              'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-600/40 text-amber-400',
              'bg-slate-900/60 border-slate-800 text-slate-300',
              'bg-slate-900/40 border-slate-800/60 text-slate-400'
            ];

            return (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 hover:scale-[1.01] ${
                  rankColors[idx] || rankColors[3]
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-xl bg-slate-950/80 flex items-center justify-center font-black text-lg border border-slate-700">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </span>
                  <span className="text-2xl">{player.avatar || '🚀'}</span>
                  <div>
                    <h4 className="font-extrabold text-white text-lg leading-tight flex items-center gap-2">
                      {player.nickname}
                      {player.streak > 1 && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs font-bold">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {player.streak} Streak
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    {player.score.toLocaleString()} <span className="text-xs font-semibold text-purple-300">pts</span>
                  </div>
                  {player.lastPoints > 0 && (
                    <div className="text-xs font-bold text-emerald-400">
                      +{player.lastPoints.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            soundFx.playSelect();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-emerald-950/60 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          {isLastQuestion ? (
            <>
              Show Final Podium <Award className="w-6 h-6" />
            </>
          ) : (
            <>
              Next Question <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
