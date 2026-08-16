import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer } from './playersSlice';
import { CheckCircle2, Sparkles, Flame } from 'lucide-react';
import { soundFx } from '../../services/soundService';

const TIPS = [
  "💡 Answering faster gives you more points (up to 1,000 pts per question)!",
  "🔥 Keep a streak going to earn up to 500 bonus points per correct answer!",
  "⚡ The speed multiplier decreases each second, so click immediately!",
  "🛡️ Reconnection is supported—if you refresh, you will automatically reconnect!",
  "🎯 Double check the host screen shapes before clicking on your screen!"
];

export default function PlayerLobby({ gamePin, onToggleReady }) {
  const currentPlayer = useSelector(selectCurrentPlayer);
  const [tipIndex, setTipIndex] = React.useState(0);

  // Cycle tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isReady = currentPlayer?.isReady || false;

  const handleToggleClick = () => {
    soundFx.playSelect();
    if (onToggleReady) {
      onToggleReady();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 min-h-[80vh] flex flex-col justify-center text-center">
      <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6">
        {/* Status Indicator */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
          isReady 
            ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 scale-110' 
            : 'bg-purple-500/20 border-2 border-purple-400 text-purple-400 animate-bounce'
        }`}>
          {isReady ? <CheckCircle2 className="w-12 h-12" /> : <Flame className="w-12 h-12" />}
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" /> Game PIN #{gamePin}
          </span>
          <h2 className="text-3xl font-black text-white">
            {isReady ? "Locked In! ⚡" : "You're in! 🎉"}
          </h2>
          <p className="text-slate-350 text-sm font-medium">
            See your nickname on the host screen!
          </p>
        </div>

        {/* Player Identity Card */}
        {currentPlayer && (
          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 flex items-center justify-center gap-3 shadow-md">
            <span className="text-4xl">{currentPlayer.avatar}</span>
            <span className="text-xl font-black text-white">
              {currentPlayer.nickname}
            </span>
          </div>
        )}

        {/* Toggle Ready Button */}
        <button
          onClick={handleToggleClick}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 cursor-pointer transform active:scale-95 border shadow-xl flex items-center justify-center gap-2 ${
            isReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-500/30 shadow-purple-950/60'
          }`}
        >
          {isReady ? '✓ Ready (Click to Chill)' : '⚡ I\'m Ready! Lock In'}
        </button>

        {/* Game Tips & Trivia Carousel */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-950 shadow-inner h-20 flex items-center justify-center">
          <p className="text-slate-300 text-xs font-semibold transition-all duration-300 leading-relaxed max-w-xs">
            {TIPS[tipIndex]}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
          <div className={`w-2.5 h-2.5 rounded-full ${isReady ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
          {isReady ? "Ready and waiting for host..." : "Waiting for host to start..."}
        </div>
      </div>
    </div>
  );
}
