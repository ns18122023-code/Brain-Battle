import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer, selectPlayerRank } from './playersSlice';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Sparkles } from 'lucide-react';
import { soundFx } from '../../services/soundService';

export default function PlayerPodium({ onPlayAgain }) {
  const player = useSelector(selectCurrentPlayer);
  const rank = useSelector(selectPlayerRank(player?.id));

  useEffect(() => {
    soundFx.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!player) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-center text-center">
      <div className="glass-panel p-8 rounded-3xl border-2 border-purple-500/40 shadow-2xl space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs uppercase border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-400" /> Game Complete!
        </span>

        <div className="space-y-1">
          <span className="text-6xl block mb-2">{player.avatar || '🚀'}</span>
          <h2 className="text-3xl font-black text-white">{player.nickname}</h2>
        </div>

        <div className="bg-gradient-to-tr from-purple-950 to-pink-950/60 p-6 rounded-2xl border border-purple-500/40 space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Final Rank
          </div>
          <div className="text-5xl font-black text-amber-400 flex items-center justify-center gap-2">
            <Trophy className="w-10 h-10 text-amber-400" /> #{rank || 1}
          </div>
          <div className="text-sm font-extrabold text-slate-200">
            Score: {player.score.toLocaleString()} pts
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playSelect();
            onPlayAgain();
          }}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-lg rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Play Another Game
        </button>
      </div>
    </div>
  );
}
