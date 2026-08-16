import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer } from './playersSlice';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function PlayerLobby({ gamePin }) {
  const currentPlayer = useSelector(selectCurrentPlayer);

  return (
    <div className="max-w-md mx-auto px-4 py-12 min-h-[80vh] flex flex-col justify-center text-center">
      <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" /> Game PIN #{gamePin}
          </span>
          <h2 className="text-3xl font-black text-white">
            You're in! 🎉
          </h2>
          <p className="text-slate-300 text-sm font-medium">
            See your nickname on the host screen!
          </p>
        </div>

        {currentPlayer && (
          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 flex items-center justify-center gap-3">
            <span className="text-4xl">{currentPlayer.avatar}</span>
            <span className="text-xl font-black text-white">
              {currentPlayer.nickname}
            </span>
          </div>
        )}

        <div className="pt-4 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Waiting for host to start game...
        </div>
      </div>
    </div>
  );
}
