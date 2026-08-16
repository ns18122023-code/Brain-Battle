import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSortedLeaderboard } from '../player/playersSlice';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Home, RotateCcw } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function HostPodium({ onPlayAgain, onBackHome }) {
  const sortedPlayers = useSelector(selectSortedLeaderboard);

  const firstPlace = sortedPlayers[0];
  const secondPlace = sortedPlayers[1];
  const thirdPlace = sortedPlayers[2];

  useEffect(() => {
    // Play fanfare sound
    soundFx.playFanfare();

    // Fire Confetti Cannon!
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-between space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-sm uppercase tracking-wider border border-amber-500/40">
          <Sparkles className="w-4 h-4 text-amber-400" /> Quiz Champions 🏆
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-pink-400 to-purple-400">
          Final Winner Podium
        </h1>
      </div>

      {/* 3D Animated Podium Blocks */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 min-h-[360px] pb-4">
        {/* 2nd Place Block (Silver) */}
        {secondPlace ? (
          <div className="flex flex-col items-center flex-1 max-w-45 animate-podium" style={{ animationDelay: '300ms' }}>
            <div className="text-center mb-3">
              <span className="text-4xl block mb-1">{secondPlace.avatar || '🚀'}</span>
              <h4 className="font-extrabold text-slate-200 text-sm sm:text-base truncate max-w-[130px]">
                {secondPlace.nickname}
              </h4>
              <span className="text-xs font-bold text-slate-400">
                {secondPlace.score.toLocaleString()} pts
              </span>
            </div>
            <div className="w-full bg-linear-to-t from-slate-700 to-slate-500 h-44 rounded-t-2xl border-t-4 border-slate-300 flex flex-col items-center justify-center p-2 shadow-2xl">
              <span className="text-3xl font-black text-white">2</span>
              <span className="text-xs font-bold text-slate-300 uppercase">Silver</span>
            </div>
          </div>
        ) : (
          <div className="w-24 sm:w-36 h-32 bg-slate-900/40 rounded-t-2xl border border-slate-800" />
        )}

        {/* 1st Place Block (Gold - Center & Highest) */}
        {firstPlace ? (
          <div className="flex flex-col items-center flex-1 max-w-50 z-10 animate-podium" style={{ animationDelay: '0ms' }}>
            <div className="text-center mb-3">
              <span className="text-6xl block mb-1 drop-shadow-lg">👑 {firstPlace.avatar || '🚀'}</span>
              <h3 className="font-black text-amber-300 text-base sm:text-xl truncate max-w-40">
                {firstPlace.nickname}
              </h3>
              <span className="text-sm font-extrabold text-amber-400">
                {firstPlace.score.toLocaleString()} pts
              </span>
            </div>
            <div className="w-full bg-linear-to-t from-amber-600 via-amber-500 to-yellow-400 h-60 rounded-t-3xl border-t-4 border-yellow-200 flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-white mb-1 drop-shadow" />
              <span className="text-4xl font-black text-white">1</span>
              <span className="text-xs font-black text-amber-950 uppercase tracking-widest">Champion</span>
            </div>
          </div>
        ) : (
          <div className="w-28 sm:w-40 h-48 bg-slate-900/40 rounded-t-3xl border border-slate-800" />
        )}

        {/* 3rd Place Block (Bronze) */}
        {thirdPlace ? (
          <div className="flex flex-col items-center flex-1 max-w-45 animate-podium" style={{ animationDelay: '600ms' }}>
            <div className="text-center mb-3">
              <span className="text-4xl block mb-1">{thirdPlace.avatar || '🚀'}</span>
              <h4 className="font-extrabold text-amber-500 text-sm sm:text-base truncate max-w-[130px]">
                {thirdPlace.nickname}
              </h4>
              <span className="text-xs font-bold text-slate-400">
                {thirdPlace.score.toLocaleString()} pts
              </span>
            </div>
            <div className="w-full bg-linear-to-t from-amber-900 to-amber-700 h-36 rounded-t-2xl border-t-4 border-amber-500 flex flex-col items-center justify-center p-2 shadow-2xl">
              <span className="text-3xl font-black text-white">3</span>
              <span className="text-xs font-bold text-amber-200 uppercase">Bronze</span>
            </div>
          </div>
        ) : (
          <div className="w-24 sm:w-36 h-24 bg-slate-900/40 rounded-t-2xl border border-slate-800" />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            soundFx.playSelect();
            onPlayAgain();
          }}
          className="flex items-center gap-2 px-6 py-3.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>

        <button
          onClick={() => {
            soundFx.playSelect();
            onBackHome();
          }}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-2xl transition-all cursor-pointer"
        >
          <Home className="w-5 h-5" /> Dashboard
        </button>
      </div>
    </div>
  );
}
